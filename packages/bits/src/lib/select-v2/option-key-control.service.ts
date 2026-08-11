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

import { ActiveDescendantKeyManager, LiveAnnouncer } from "@angular/cdk/a11y";
import { Injectable, QueryList } from "@angular/core";
import isNil from "lodash/isNil";

import {
    ANNOUNCER_CLOSE_MESSAGE,
    ANNOUNCER_OPEN_MESSAGE_SUFFIX,
} from "./constants";
import { IFocusableAction } from "./types";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { IOption, IOverlayComponent } from "../overlay/types";

@Injectable()
export class OptionKeyControlService<T extends IOption> {
    public popup: IOverlayComponent;
    public optionItems: QueryList<T>;
    public skipSpace: boolean = false;

    /** Group-level focusable actions (e.g. header buttons) reachable via ArrowUp */
    public groupActions?: QueryList<IFocusableAction>;

    private keyboardEventsManager: ActiveDescendantKeyManager<T>;

    // Active option index saved while its highlight is suspended.
    private suspendedActiveIndex: number | null = null;

    constructor(public liveAnnouncer: LiveAnnouncer) {}

    public initKeyboardManager(): void {
        this.keyboardEventsManager = new ActiveDescendantKeyManager(
            this.optionItems
        ).withVerticalOrientation();
    }

    public handleKeydown(event: KeyboardEvent): void {
        this.popup.showing
            ? this.handleOpenKeyDown(event)
            : this.handleClosedKeyDown(event);
    }

    public setActiveItem(option: T): void {
        this.keyboardEventsManager?.setActiveItem(option);
    }

    public resetActiveItem(): void {
        this.keyboardEventsManager.setActiveItem(-1);
    }

    /** Removes the active option highlight while focus is on a group action. */
    public suspendActiveHighlight(): void {
        this.suspendedActiveIndex = this.getActiveItemIndex();
        this.resetActiveItem();
    }

    /** Restores the option highlight suspended by {@link suspendActiveHighlight}. */
    public restoreActiveHighlight(): void {
        if (this.suspendedActiveIndex == null) {
            return;
        }
        if (this.suspendedActiveIndex >= 0) {
            this.keyboardEventsManager.setActiveItem(this.suspendedActiveIndex);
        }
        this.suspendedActiveIndex = null;
    }

    public setFirstItemActive(): void {
        this.keyboardEventsManager?.setFirstItemActive();
    }

    public getActiveItemIndex(): number | null {
        return this.keyboardEventsManager.activeItemIndex;
    }

    public setSkipPredicate(predicate: (option: T) => boolean): void {
        this.keyboardEventsManager.skipPredicate(predicate);
    }

    public scrollToActiveItem(options: ScrollIntoViewOptions): void {
        if (this.keyboardEventsManager.activeItem) {
            // setTimeout is necessary because scrolling to the selected item should occur only when overlay rendered
            setTimeout(() => {
                this.keyboardEventsManager.activeItem?.scrollIntoView(options);
            });
        }
    }

    private hasActiveItem(): boolean {
        if (isNil(this.keyboardEventsManager.activeItemIndex)) {
            throw new Error("ActiveItemIndex is not defined");
        }
        return Boolean(
            this.keyboardEventsManager.activeItem &&
                this.keyboardEventsManager.activeItemIndex >= 0
        );
    }

    /** Moves DOM focus to the active option's first nested action, if any. */
    private focusActiveOptionAction(): boolean {
        const activeItem = this.keyboardEventsManager.activeItem as
            | (T & { actions?: QueryList<IFocusableAction> })
            | null;
        const action = activeItem?.actions?.first;
        if (action) {
            action.focus();
            return true;
        }
        return false;
    }

    /** Moves DOM focus to the first group action when the first option is active. */
    private focusGroupActionOnArrowUp(): boolean {
        const action = this.groupActions?.first;
        if (action && this.getActiveItemIndex() === 0) {
            // Focus leaves the options list, so drop the option highlight.
            this.suspendActiveHighlight();
            action.focus();
            return true;
        }
        return false;
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        switch (event.code) {
            case KEYBOARD_CODE.ARROW_UP:
                // ArrowUp on the first option reaches the group action.
                if (this.focusGroupActionOnArrowUp()) {
                    event.preventDefault();
                    return;
                }
                this.keyboardEventsManager.onKeydown(event);
                this.announceNavigatedOption();
                break;
            case KEYBOARD_CODE.ARROW_DOWN:
                this.keyboardEventsManager.onKeydown(event);
                this.announceNavigatedOption();
                break;
            case KEYBOARD_CODE.ARROW_RIGHT:
                // ArrowRight enters the active option's nested action(s)
                if (this.focusActiveOptionAction()) {
                    event.preventDefault();
                    return;
                }
                break;
            case KEYBOARD_CODE.PAGE_UP:
                event.preventDefault();
                this.keyboardEventsManager.onKeydown(event);
                this.keyboardEventsManager.setFirstItemActive();
                break;
            case KEYBOARD_CODE.PAGE_DOWN:
                event.preventDefault();
                this.keyboardEventsManager.onKeydown(event);
                this.keyboardEventsManager.setLastItemActive();
                break;
        }

        this.scrollToActiveItem({ block: "nearest" });

        // prevent page scroll on space and prevent closing on enter/space when no item is active
        if (
            (!this.skipSpace && event.code === KEYBOARD_CODE.SPACE) ||
            (!this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER)
        ) {
            event.preventDefault();
        }

        if (
            this.hasActiveItem() &&
            (event.code === KEYBOARD_CODE.ENTER ||
                (!this.skipSpace && event.code === KEYBOARD_CODE.SPACE))
        ) {
            if (!this.keyboardEventsManager.activeItem) {
                throw new Error("ActiveItem is not defined");
            }

            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem.element.nativeElement.click();
        }

        if (
            event.code === KEYBOARD_CODE.TAB ||
            event.code === KEYBOARD_CODE.ESCAPE
        ) {
            this.popup.toggle();
            this.announceDropdown(this.popup.showing);
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent opening on enter and prevent scrolling page on key down/key up when focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }

        if (
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.code === KEYBOARD_CODE.ENTER ||
            (!this.skipSpace && event.code === KEYBOARD_CODE.SPACE)
        ) {
            this.popup.toggle();
            this.scrollToActiveItem({ block: "center" });
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return (
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.code === KEYBOARD_CODE.ARROW_UP ||
            event.code === KEYBOARD_CODE.ENTER
        );
    }

    private announceNavigatedOption(): void {
        const activeItem = this.keyboardEventsManager.activeItem;

        if (activeItem) {
            this.liveAnnouncer.announce((activeItem as any).value);
        }
    }

    private announceDropdown(open: boolean) {
        const message = open
            ? `${this.optionItems.length} ${ANNOUNCER_OPEN_MESSAGE_SUFFIX}`
            : ANNOUNCER_CLOSE_MESSAGE;

        this.liveAnnouncer.announce(message);
    }
}
