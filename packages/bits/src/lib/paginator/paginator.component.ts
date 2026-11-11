// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { InteractivityChecker } from "@angular/cdk/a11y";
import { hasModifierKey } from "@angular/cdk/keycodes";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import _chunk from "lodash/chunk";
import _clone from "lodash/clone";
import _get from "lodash/get";
import _includes from "lodash/includes";
import _min from "lodash/min";
import _range from "lodash/range";
import { Subject, Subscription } from "rxjs";

import { IPaginatorItem } from "./public-api";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import {
    IFilter,
    IFilterPub,
    IRange,
} from "../../services/data-source/public-api";
import { LoggerService } from "../../services/log-service";
import { PopupContainerService } from "../popup/popup-container.service";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { SelectComponent } from "../select";
import { ISelectChangedEvent } from "../select/public-api";
import { InputValueTypes } from "../select-v2/types";

export const defaultPageSizeSet = [10, 25, 50, 100];
const singleSymbolWidth = 8;
const singleCellPaddings = 12;
const containerPaddingsWithScroll = 37;
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

/**
 * Component used for pagination of data
 * <example-url>./../examples/index.html#/paginator</example-url>
 */
@Component({
    selector: "nui-paginator",
    templateUrl: "./paginator.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./paginator.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [PopupContainerService],
    host: {
        "role": "navigation",
        "[attr.aria-label]": "ariaLabel",
    },
    standalone: false,
})
export class PaginatorComponent
    implements OnInit, OnChanges, OnDestroy, IFilterPub
{
    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = $localize`Pagination`;

    @Input() public itemsList: Array<IPaginatorItem> = [];
    /**
     * Current page number
     */
    @Input() public page = 1;
    /**
     * Size of the page. For example: 10, 25, 50, 100;
     */
    @Input() public pageSize: number;
    /**
     * Array of page numbers
     */
    @Input() public pageSizeSet: number[] = [];
    /**
     * Total number of items
     */
    @Input() public total = 0;
    /**
     * Paginator separator symbol.
     */
    @Input() public dots = "...";
    /**
     * Hide paginator if all items of data can be displayed on one page
     */
    @Input() public hideIfEmpty = false;
    /**
     * Make paginator hidden
     */
    @Input() public hide: boolean;
    /**
     * Paginator active item class
     */
    @Input() public activeClass = "active";
    /**
     * Paginator disabled item class
     */
    @Input() public disabledClass = "disabled";
    /**
     * Number of items displayed before separator
     */
    @Input() public adjacent = 1;
    /**
     * Maximum number of items in paginator
     */
    @Input() public maxElements = this.adjacent * 2 + 5;
    /**
     * Show previous and next buttons
     */
    @Input() public showPrevNext = true;
    /**
     * Display popup above paginator if equals to 'true'
     */
    @Input() public popupDirectionTop = false;
    /**
     * Popup parent element css class used determining of popup direction
     */
    @Input() public popupBaseElementSelector: string;
    /**
     * inner nui-select appendToBody input
     */
    @Input() public appendToBody: boolean;
    /**
     * Action occurs on page change
     */
    @Output() public pagerAction = new EventEmitter<any>();

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    public onDestroy$ = new Subject<void>();

    @ViewChild("select")
    private selectComponent: SelectComponent;

    @ViewChild(CdkVirtualScrollViewport)
    private virtualScrollViewport: CdkVirtualScrollViewport;

    @ViewChildren(CdkVirtualScrollViewport)
    private virtualScrollViewports: QueryList<CdkVirtualScrollViewport>;

    @ViewChildren("popupPages", { read: ElementRef })
    private popupPages: QueryList<ElementRef<HTMLElement>>;

    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly focusInjector = inject(Injector);
    private readonly interactivityChecker = inject(InteractivityChecker);
    private focusRestorePending = false;
    private pendingVirtualPageFocus?: PendingVirtualPageFocus;

    private _dotsPagesPerRow = 5;

    public get dotsPagesPerRow(): number {
        return this._dotsPagesPerRow;
    }
    private mainRangeStart: number;
    private mainRangeEnd: number;

    public constructor(
        private logger: LoggerService,
        private popupContainer: PopupContainerService,
        private cd: ChangeDetectorRef
    ) {
        this.popupContainer.parent = this;
    }

    /** Keeps DOM nodes (and focus) stable across page changes. */
    public trackItem = (index: number, item: IPaginatorItem): unknown =>
        item.iconName ??
        (item.value === this.dots ? `dots-${index}` : item.value);

    /**
     * Component initialization
     */
    public ngOnInit(): void {
        this.initPageSizeSet();
        const pageCount = this.getPageCount();
        if (this.page > pageCount) {
            this.page = pageCount;
            this.pageChange.emit(this.page);
        }
        if (this.page <= 0) {
            this.page = 1;
            this.pageChange.emit(this.page);
        }
    }

    /**
     * Redraw component when 'total' or 'page' propery was changed
     * @param changes Changed properties
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes["total"] ||
            changes["page"] ||
            changes["adjacent"] ||
            changes["pageSize"]
        ) {
            this.assemble();
        }
    }

    /**
     * Initialize set of pages
     */
    public initPageSizeSet(): void {
        if (!_get(this.pageSizeSet, "length")) {
            this.pageSizeSet = _clone(defaultPageSizeSet);
        }
        if (!this.pageSize || this.pageSize <= 0) {
            this.pageSize = this.pageSizeSet[0];
        }
        if (!_includes(this.pageSizeSet, this.pageSize)) {
            this.logger
                .warn(`pageSize ${this.pageSize} not found in the current pageSizeSet ${this.pageSizeSet}. pageSize will be set to
${this.pageSizeSet[0]}. To set the desired initial page size, include it as part of the paginator's pageSizeSet input.`);
            this.pageSize = this.pageSizeSet[0];
        }
    }

    public getFilters(): IFilter<IRange<number>> {
        return {
            type: "range",
            value: {
                start: (this.page - 1) * this.pageSize,
                end: this.page * this.pageSize,
            },
        };
    }

    public resetFilter(): void {
        this.page = 1;
        this.pageChange.emit(this.page);
    }

    public getPageAriaLabel(pageValue: number): string {
        return $localize`Go to page ${pageValue}`;
    }

    /**
     * Change page number
     * @param page Page number
     */
    public goToPage(page: number): void {
        this.page = page;
        this.pageChange.emit(this.page);

        if (this.pagerAction) {
            const result = {
                page: this.page,
                pageSize: this.pageSize,
                total: this.total,
                pageSizeSet: this.pageSizeSet,
            };
            this.pagerAction.emit(result);
        }

        this.assemble();
    }

    // TODO: remove in vNext. Needs only for backward compatibility
    /**
     * @deprecated - remove in v12. Needs only for backward compatibility - Removal: NUI-5837
     */
    public onPageSizeChange(value: InputValueTypes): void {
        this.setItemsPerPage({
            oldValue: 0,
            newValue: value as number,
        });
    }

    // TODO: refactor in vNext. Replace ISelectChangedEvent to InputValueTypes - NUI-5837
    /**
     * Set items per page that should displayed
     * @param changedEvent select change event
     */
    public setItemsPerPage(changedEvent: ISelectChangedEvent<number>): void {
        if (changedEvent?.newValue === changedEvent?.oldValue) {
            return;
        }

        const newValue = changedEvent?.newValue;

        if (newValue) {
            if (newValue < 1) {
                this.logger.warn(
                    "paginator-controller.setItemsPerPage - invalid newValue: " +
                        newValue
                );
                return;
            }
            this.pageSize = newValue;
        }

        this.goToPage(1);
    }

    /**
     * Get number of pages
     */
    public getPageCount(): number {
        if (this.total <= 0) {
            return 1;
        }
        return Math.ceil(this.total / this.pageSize);
    }

    /**
     * Display paginator component
     */
    public showPaginator(): boolean {
        const count: number = this.getPageCount();
        return isFinite(count) && (this.hideIfEmpty === false || count > 1);
    }

    /**
     * Get sequence number of first item of currently displayed paginated list
     */
    public getFirstItemOnPage(): number {
        return this.pageSize * (this.page - 1) + 1;
    }

    /**
     * Get sequence number of last item of currently displayed paginated repeat
     */
    public getLastItemOnPage(): number | undefined {
        return _min([this.pageSize * this.page, this.total]);
    }

    /**
     * Return range for info section
     */
    public getRange(total: number): string {
        return total > 0
            ? `${this.getFirstItemOnPage()}-${this.getLastItemOnPage()}`
            : "0";
    }

    /**
     * Re-renders the virtual scroll viewport to properly display items within the virtual scroll viewport
     */
    public handleDotsClick(popup?: PopupComponent): void {
        const viewport = popup
            ? this.getPopupViewport(popup)
            : this.virtualScrollViewport;
        viewport?.checkViewportSize();
    }

    public onPopupOpened(isOpen: boolean, popup: PopupComponent): void {
        if (isOpen) {
            this.getPopupViewport(popup)?.checkViewportSize();
        }
    }

    /**
     * Keyboard handling for the "..." trigger: Escape closes the popup and Tab enters it directly,
     * which matters when the popup is appended to the body and is not next to the trigger in the DOM.
     */
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

    /**
     * Keyboard handling inside the popup: Escape closes it, and tabbing past its first or last
     * button returns focus to the trigger so the native Tab continues from the trigger's place.
     * Virtualized lists follow logical pages rather than the currently rendered slice.
     */
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
        const active = this.host.nativeElement.ownerDocument.activeElement;
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

    /**
     * Closes the popup once focus moves to an element outside of the trigger and the popup.
     */
    public onPopupFocusOut(event: FocusEvent, popup: PopupComponent): void {
        const nextFocus = event.relatedTarget;
        if (!popup.isOpen || !(nextFocus instanceof Node)) {
            if (this.pendingVirtualPageFocus?.popup === popup) {
                this.cancelPendingVirtualPageFocus();
            }
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
        popup.closePopup();
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

    private getPopupViewport(
        popup: PopupComponent
    ): CdkVirtualScrollViewport | undefined {
        const content: HTMLElement | undefined =
            popup.popupAreaContent?.nativeElement;
        if (!content) {
            return undefined;
        }
        return this.virtualScrollViewports?.find(viewport =>
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
            Math.floor((page - firstPage) / this.dotsPagesPerRow)
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

    private cancelPendingVirtualPageFocus(): void {
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

    private scheduleFocusRestore(focusedElement: Element | null): void {
        if (this.focusRestorePending) {
            return;
        }
        this.focusRestorePending = true;
        afterNextRender(
            () => {
                this.focusRestorePending = false;
                const element = this.host.nativeElement;
                const active = element.ownerDocument.activeElement;
                const isActiveDisabled =
                    element.contains(active) &&
                    (active as HTMLButtonElement).disabled === true;
                // Focus falls to <body> when the focused button is removed or disabled.
                const isFocusLost =
                    active === element.ownerDocument.body &&
                    (focusedElement?.isConnected === false ||
                        (focusedElement as HTMLButtonElement | null)
                            ?.disabled === true);

                if (isActiveDisabled || isFocusLost) {
                    element
                        .querySelector<HTMLElement>("button[aria-current=page]")
                        ?.focus();
                }
            },
            { injector: this.focusInjector }
        );
    }

    /**
     * Add items to paginator component
     */
    private assemble() {
        this.cancelPendingVirtualPageFocus();
        const focusedElement =
            this.host.nativeElement.ownerDocument.activeElement;
        const hadFocus =
            this.host.nativeElement.contains(focusedElement) ||
            this.popupPages?.some(pages =>
                pages.nativeElement.contains(focusedElement)
            );
        this.itemsList = [];
        if (this.getPageCount() <= 0) {
            return;
        }

        const pageCount = this.getPageCount();

        this.prepareSeparators();

        this.addPrev();

        if (this.mainRangeStart !== 1) {
            // add starting separator and the first page
            this.add(1);
            this.addSeparator(2, this.mainRangeStart - 1);
        }

        this.addRange(this.mainRangeStart, this.mainRangeEnd);

        if (this.mainRangeEnd !== pageCount) {
            // add ending separator and the last page
            this.addSeparator(this.mainRangeEnd + 1, pageCount - 1);
            this.add(pageCount);
        }

        this.addNext();
        this.cd.detectChanges();

        if (hadFocus) {
            this.scheduleFocusRestore(focusedElement);
        }
    }

    /**
     * Fills mainRangeStart and mainRangeEnd properties with proper values. Those properties
     * are used for displaying of page numbers between 'dots' separators.
     */
    private prepareSeparators() {
        // the only 2 variables that are needed to display everything are:
        //      mainRangeStart      mainRangeEnd
        //            |                   |
        //  < 1  ... 100  101  102  103  104 >
        const pageCount = this.getPageCount();
        const page = +this.page;
        const adjacent = +this.adjacent;

        // case when there are few items
        if (pageCount <= this.maxElements) {
            this.mainRangeStart = 1;
            this.mainRangeEnd = pageCount;
            return;
        }

        // set main range to
        this.mainRangeStart = page - adjacent < 1 ? 1 : page - adjacent;
        this.mainRangeEnd =
            page + adjacent > pageCount ? pageCount : page + adjacent;

        // case where starting separator is not shown
        if (
            this.mainRangeStart -
                1 - // end of possible starting separator
                2 < // start of possible starting separator
            1
        ) {
            this.mainRangeStart = 1;
        }

        // case where ending separator is not shown
        if (
            pageCount -
                1 - // end of possible ending separator
                (this.mainRangeEnd + 1) < // start of possible ending separator
            1
        ) {
            this.mainRangeEnd = pageCount;
        }

        // case where we have one of the first pages selected and the ending separator
        if (
            this.mainRangeEnd !== pageCount &&
            page < this.maxElements - 2 - adjacent
        ) {
            this.mainRangeStart = 1;
            this.mainRangeEnd = this.mainRangeStart + this.maxElements - 3;
        }

        // case where we have one of the last pages selected and the starting separator
        if (
            this.mainRangeStart !== 1 &&
            page > pageCount - this.maxElements + 2 + adjacent
        ) {
            this.mainRangeEnd = pageCount;
            this.mainRangeStart = this.mainRangeEnd - this.maxElements + 3;
        }
    }

    private addSeparator(from: number, to: number) {
        const pageRows = _chunk(_range(from, to + 1), this._dotsPagesPerRow);
        this.itemsList.push({
            title: $localize`Pages ${from} - ${to}`,
            value: this.dots,
            pageRows: pageRows,
            popupWidth:
                (to.toString().length * singleSymbolWidth +
                    singleCellPaddings) *
                    this._dotsPagesPerRow +
                containerPaddingsWithScroll, // each popup will have its own width
            useVirtualScroll: pageRows.length * this._dotsPagesPerRow >= 1000,
        });
    }

    private addPrev() {
        const pageCount = this.getPageCount();
        if (!this.showPrevNext || pageCount < 1) {
            return;
        }

        const prevBtn = {
            iconName: "caret-left",
            title: $localize`Previous Page`,
            page: this.page - 1 <= 0 ? 1 : this.page - 1,
        };
        const isDisabled = this.page - 1 <= 0;
        this.addItem(prevBtn, isDisabled);
    }

    private addNext() {
        const pageCount = this.getPageCount();
        if (!this.showPrevNext || pageCount < 1) {
            return;
        }

        const nextBtn = {
            iconName: "caret-right",
            title: $localize`Next Page`,
            page: this.page + 1 >= pageCount ? pageCount : this.page + 1,
        };
        const isDisabled = this.page + 1 > pageCount;
        this.addItem(nextBtn, isDisabled);
    }

    private addItem(item: IPaginatorItem, isDisabled: boolean) {
        this.itemsList.push({
            iconName: item.iconName,
            value: item.value,
            title: item.title,
            style: isDisabled ? this.disabledClass : "",
            action: () => {
                if (item.page) {
                    this.goToPage(item.page);
                }
                return false;
            },
        });
    }

    private add(page: number) {
        const inst = this;
        this.itemsList.push({
            value: page,
            title: $localize`Page ${page}`,
            style: this.page === page ? this.activeClass : "",
            action: function () {
                inst.goToPage(this.value);
                return false;
            },
        });
    }

    private addRange(start: number, finish: number) {
        for (let index = start; index <= finish; index++) {
            this.add(index);
        }
    }

    public ngOnDestroy(): void {
        this.cancelPendingVirtualPageFocus();
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
