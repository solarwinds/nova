// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { InteractivityChecker } from "@angular/cdk/a11y";
import { hasModifierKey } from "@angular/cdk/keycodes";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { QueryList } from "@angular/core";
import { Subscription } from "rxjs";

import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { LoggerService } from "../../services/log-service";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { IPaginatorItem } from "./public-api";

const virtualFocusTimeoutMs = 5000;

interface PendingVirtualPageFocus {
    popup: PopupComponent;
    viewport: CdkVirtualScrollViewport;
    content: HTMLElement;
    page: number;
    observer: MutationObserver;
    closeSubscription: Subscription;
    timeout?: ReturnType<typeof setTimeout>;
}

/** @ignore */
export class PaginatorPopupFocusController {
    private pendingVirtualPageFocus?: PendingVirtualPageFocus;
    private readonly pendingPopupFocusChecks = new Map<
        PopupComponent,
        ReturnType<typeof setTimeout>
    >();

    public constructor(
        private readonly host: HTMLElement,
        private readonly getViewports: () =>
            | QueryList<CdkVirtualScrollViewport>
            | undefined,
        private readonly interactivityChecker: InteractivityChecker,
        private readonly logger: LoggerService,
        private readonly getDotsPagesPerRow: () => number
    ) {}

    public handleDotsClick(
        popup: PopupComponent | undefined,
        fallbackViewport?: CdkVirtualScrollViewport
    ): void {
        const viewport = popup
            ? this.getPopupViewport(popup)
            : fallbackViewport;
        viewport?.checkViewportSize();
    }

    public onPopupOpened(isOpen: boolean, popup: PopupComponent): void {
        this.cancelPendingPopupFocusCheck(popup);
        if (isOpen) {
            this.getPopupViewport(popup)?.checkViewportSize();
        }
    }

    public onDotsKeydown(
        event: KeyboardEvent,
        popup: PopupComponent,
        item?: IPaginatorItem
    ): void {
        if (event.defaultPrevented || !popup.isOpen) {
            return;
        }
        if (this.pendingVirtualPageFocus?.popup === popup) {
            this.cancelPendingVirtualPageFocus();
        }
        if (this.isEscape(event)) {
            this.closePopupFromKeyboard(event, popup);
            return;
        }
        if (!this.isTab(event) || event.shiftKey) {
            return;
        }
        const viewport = this.getPopupViewport(popup);
        viewport?.checkViewportSize();
        if (item?.useVirtualScroll) {
            const content: HTMLElement | undefined =
                popup.popupAreaContent?.nativeElement;
            const firstPage = item.pageRows?.[0]?.[0];
            if (viewport && content && firstPage !== undefined) {
                const firstPageButton = this.getPopupPageButton(
                    content,
                    firstPage
                );
                if (firstPageButton) {
                    firstPageButton.focus();
                } else {
                    this.requestVirtualPageFocus(
                        popup,
                        viewport,
                        content,
                        firstPage,
                        firstPage
                    );
                }
                event.preventDefault();
                return;
            }
            this.logger.warn("Paginator virtual popup is unavailable.");
        }
        const firstTabStop = this.getPopupTabStops(popup)[0];
        if (firstTabStop) {
            firstTabStop.focus();
            event.preventDefault();
        }
    }

    public onPopupKeydown(
        event: KeyboardEvent,
        popup: PopupComponent,
        item?: IPaginatorItem
    ): void {
        if (event.defaultPrevented || !popup.isOpen) {
            return;
        }
        if (this.isEscape(event)) {
            this.closePopupFromKeyboard(event, popup);
            return;
        }
        if (!this.isTab(event)) {
            return;
        }
        if (
            item?.useVirtualScroll &&
            this.handleVirtualPopupTab(event, popup, item)
        ) {
            return;
        }
        const trigger = this.getPopupTrigger(popup);
        const tabStops = this.getPopupTabStops(popup);
        const active = this.getDeepActiveElement(this.host.ownerDocument);
        if (!trigger || tabStops.length === 0) {
            return;
        }
        if (event.shiftKey && tabStops[0] === active) {
            popup.closePopup();
            trigger.focus();
            event.preventDefault();
        } else if (
            !event.shiftKey &&
            tabStops[tabStops.length - 1] === active
        ) {
            popup.closePopup();
            trigger.focus();
        }
    }

    public onPopupFocusOut(event: FocusEvent, popup: PopupComponent): void {
        const nextFocus = event.relatedTarget;
        if (!popup.isOpen) {
            if (this.pendingVirtualPageFocus?.popup === popup) {
                this.cancelPendingVirtualPageFocus();
            }
            return;
        }
        if (
            !(nextFocus instanceof Node) ||
            this.isTriggerShadowHost(popup, nextFocus)
        ) {
            if (this.pendingVirtualPageFocus?.popup === popup) {
                this.cancelPendingVirtualPageFocus();
            }
            this.schedulePopupFocusCheck(popup);
            return;
        }
        if (
            this.getPopupTrigger(popup)?.contains(nextFocus) ||
            popup.popupAreaContent?.nativeElement.contains(nextFocus)
        ) {
            return;
        }
        if (this.pendingVirtualPageFocus?.popup === popup) {
            this.cancelPendingVirtualPageFocus();
        }
        this.cancelPendingPopupFocusCheck(popup);
        popup.closePopup();
    }

    public isPopupContentFocused(popup: PopupComponent): boolean {
        const content: HTMLElement | undefined =
            popup.popupAreaContent?.nativeElement;
        return content?.matches(":focus-within") ?? false;
    }

    public schedulePopupFocusCheck(popup: PopupComponent): void {
        this.cancelPendingPopupFocusCheck(popup);
        // Focus may move again before this task completes.
        const timer = setTimeout(() => {
            this.pendingPopupFocusChecks.delete(popup);
            if (!popup.isOpen || !popup.visible) {
                return;
            }
            if (
                this.getPopupTrigger(popup)?.matches(":focus-within") ||
                this.isPopupContentFocused(popup)
            ) {
                return;
            }
            popup.closePopup();
        });
        this.pendingPopupFocusChecks.set(popup, timer);
    }

    public cancelPendingVirtualPageFocus(): void {
        const pending = this.pendingVirtualPageFocus;
        if (!pending) {
            return;
        }
        this.pendingVirtualPageFocus = undefined;
        pending.observer.disconnect();
        pending.closeSubscription.unsubscribe();
        if (pending.timeout !== undefined) {
            clearTimeout(pending.timeout);
        }
    }

    public destroy(): void {
        this.cancelPendingVirtualPageFocus();
        this.pendingPopupFocusChecks.forEach(timer => clearTimeout(timer));
        this.pendingPopupFocusChecks.clear();
    }

    private isTriggerShadowHost(popup: PopupComponent, target: Node): boolean {
        let root = this.getPopupTrigger(popup)?.getRootNode();
        // Focus events crossing a shadow boundary expose the host as relatedTarget.
        while (root instanceof ShadowRoot) {
            if (root.host === target) {
                return true;
            }
            root = root.host.getRootNode();
        }
        return false;
    }

    private cancelPendingPopupFocusCheck(popup: PopupComponent): void {
        const timer = this.pendingPopupFocusChecks.get(popup);
        if (timer !== undefined) {
            clearTimeout(timer);
            this.pendingPopupFocusChecks.delete(popup);
        }
    }

    private closePopupFromKeyboard(
        event: KeyboardEvent,
        popup: PopupComponent
    ): void {
        this.cancelPendingVirtualPageFocus();
        popup.closePopup();
        this.getPopupTrigger(popup)?.focus();
        event.preventDefault();
        event.stopPropagation();
    }

    private getPopupTrigger(popup: PopupComponent): HTMLElement | undefined {
        return popup.popupToggle?.host.nativeElement;
    }

    private getDeepActiveElement(document: Document): Element | null {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) {
            active = active.shadowRoot.activeElement;
        }
        return active;
    }

    private getPopupViewport(
        popup: PopupComponent
    ): CdkVirtualScrollViewport | undefined {
        const content: HTMLElement | undefined =
            popup.popupAreaContent?.nativeElement;
        if (!content) {
            return undefined;
        }
        return this.getViewports()?.find(viewport =>
            content.contains(viewport.elementRef.nativeElement)
        );
    }

    private handleVirtualPopupTab(
        event: KeyboardEvent,
        popup: PopupComponent,
        item: IPaginatorItem
    ): boolean {
        const content: HTMLElement | undefined =
            popup.popupAreaContent?.nativeElement;
        const rows = item.pageRows;
        if (!content || !rows?.length) {
            this.logger.warn("Paginator virtual popup is unavailable.");
            return false;
        }

        const firstPage = rows[0][0];
        const lastRow = rows[rows.length - 1];
        const lastPage = lastRow[lastRow.length - 1];
        const pending = this.pendingVirtualPageFocus;
        const target = event.target;
        let currentPage: number;
        if (
            pending?.popup === popup &&
            target === pending.viewport.elementRef.nativeElement
        ) {
            currentPage = pending.page;
        } else if (
            target instanceof HTMLButtonElement &&
            content.contains(target)
        ) {
            const value = target.getAttribute("data-nui-paginator-page");
            if (value === null) {
                return false;
            }
            currentPage = Number(value);
        } else {
            return false;
        }

        if (
            firstPage === undefined ||
            lastPage === undefined ||
            !Number.isInteger(currentPage) ||
            currentPage < firstPage ||
            currentPage > lastPage
        ) {
            this.logger.warn("Invalid page in virtualized paginator popup.");
            return false;
        }

        const nextPage = currentPage + (event.shiftKey ? -1 : 1);
        if (nextPage < firstPage || nextPage > lastPage) {
            if (
                pending?.popup === popup &&
                target === pending.viewport.elementRef.nativeElement
            ) {
                const trigger = this.getPopupTrigger(popup);
                this.cancelPendingVirtualPageFocus();
                if (!trigger) {
                    this.logger.warn("Paginator popup trigger is unavailable.");
                    return false;
                }
                popup.closePopup();
                trigger.focus();
                if (event.shiftKey) {
                    event.preventDefault();
                }
                return true;
            }
            return false;
        }

        const nextButton = this.getPopupPageButton(content, nextPage);
        if (nextButton) {
            this.cancelPendingVirtualPageFocus();
            nextButton.focus();
            event.preventDefault();
            return true;
        }

        const viewport = this.getPopupViewport(popup);
        if (!viewport) {
            this.logger.warn(
                "Paginator virtual scroll viewport is unavailable."
            );
            return false;
        }
        event.preventDefault();
        this.requestVirtualPageFocus(
            popup,
            viewport,
            content,
            nextPage,
            firstPage
        );
        return true;
    }

    private getPopupPageButton(
        content: HTMLElement,
        page: number
    ): HTMLButtonElement | null {
        return content.querySelector<HTMLButtonElement>(
            `button[data-nui-paginator-page="${page}"]`
        );
    }

    private requestVirtualPageFocus(
        popup: PopupComponent,
        viewport: CdkVirtualScrollViewport,
        content: HTMLElement,
        page: number,
        firstPage: number
    ): void {
        let pending = this.pendingVirtualPageFocus;
        if (
            !pending ||
            pending.popup !== popup ||
            pending.viewport !== viewport
        ) {
            this.cancelPendingVirtualPageFocus();
            const observer = new MutationObserver(() =>
                this.focusVirtualPage()
            );
            const closeSubscription = popup.opened.subscribe(isOpen => {
                if (!isOpen && this.pendingVirtualPageFocus?.popup === popup) {
                    this.cancelPendingVirtualPageFocus();
                }
            });
            pending = {
                popup,
                viewport,
                content,
                page,
                observer,
                closeSubscription,
            };
            this.pendingVirtualPageFocus = pending;
            observer.observe(content, {
                attributes: true,
                attributeFilter: ["data-nui-paginator-page"],
                childList: true,
                subtree: true,
            });
            const viewportElement = viewport.elementRef.nativeElement;
            viewportElement.focus({ preventScroll: true });
            if (!viewportElement.matches(":focus")) {
                this.cancelPendingVirtualPageFocus();
                this.logger.warn(
                    "Could not focus the paginator virtual scroll viewport."
                );
                return;
            }
        } else {
            pending.page = page;
        }

        if (pending.timeout !== undefined) {
            clearTimeout(pending.timeout);
        }
        const request = pending;
        pending.timeout = setTimeout(() => {
            if (this.pendingVirtualPageFocus !== request) {
                return;
            }
            this.cancelPendingVirtualPageFocus();
            this.logger.warn(
                `Timed out focusing virtual paginator page ${request.page}.`
            );
            if (
                request.popup.isOpen &&
                request.viewport.elementRef.nativeElement.matches(":focus")
            ) {
                request.popup.closePopup();
                const trigger = this.getPopupTrigger(request.popup);
                if (trigger) {
                    trigger.focus();
                } else {
                    this.logger.warn("Paginator popup trigger is unavailable.");
                }
            }
        }, virtualFocusTimeoutMs);
        viewport.checkViewportSize();
        viewport.scrollToIndex(
            Math.floor((page - firstPage) / this.getDotsPagesPerRow())
        );
        this.focusVirtualPage();
    }

    private focusVirtualPage(): void {
        const pending = this.pendingVirtualPageFocus;
        if (!pending) {
            return;
        }
        const viewportElement = pending.viewport.elementRef.nativeElement;
        if (
            !pending.popup.isOpen ||
            !viewportElement.isConnected ||
            !viewportElement.matches(":focus")
        ) {
            this.cancelPendingVirtualPageFocus();
            return;
        }
        const button = this.getPopupPageButton(pending.content, pending.page);
        if (button) {
            this.cancelPendingVirtualPageFocus();
            button.focus();
        }
    }

    private getPopupTabStops(popup: PopupComponent): HTMLElement[] {
        const content: HTMLElement | undefined =
            popup.popupAreaContent?.nativeElement;
        return Array.from(
            content?.querySelectorAll<HTMLElement>("button") ?? []
        ).filter(
            element =>
                this.interactivityChecker.isFocusable(element) &&
                this.interactivityChecker.isTabbable(element)
        );
    }

    private isEscape(event: KeyboardEvent): boolean {
        return (
            (event.key === KEYBOARD_CODE.ESCAPE ||
                event.code === KEYBOARD_CODE.ESCAPE) &&
            !hasModifierKey(event)
        );
    }

    private isTab(event: KeyboardEvent): boolean {
        return (
            (event.key === KEYBOARD_CODE.TAB ||
                event.code === KEYBOARD_CODE.TAB) &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
        );
    }
}
