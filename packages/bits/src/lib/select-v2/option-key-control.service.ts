import { ActiveDescendantKeyManager, LiveAnnouncer } from "@angular/cdk/a11y";
import { Injectable, QueryList } from "@angular/core";
import isNil from "lodash/isNil";

import { IOption, IOverlayComponent } from "../overlay/types";
import { ANNOUNCER_CLOSE_MESSAGE, ANNOUNCER_OPEN_MESSAGE_SUFFIX } from "./constants";
import { KEYBOARD_CODE } from "../../constants";

@Injectable()
export class OptionKeyControlService<T extends IOption> {
    public popup: IOverlayComponent;
    public optionItems: QueryList<T>;

    private keyboardEventsManager: ActiveDescendantKeyManager<T>;

    constructor(public liveAnnouncer: LiveAnnouncer) {
    }

    public initKeyboardManager(): void {
        this.keyboardEventsManager = new ActiveDescendantKeyManager(this.optionItems).withVerticalOrientation();
    }

    public handleKeydown(event: KeyboardEvent): void {
        this.popup.showing ? this.handleOpenKeyDown(event) : this.handleClosedKeyDown(event);
    }

    public setActiveItem(option: T): void {
        this.keyboardEventsManager?.setActiveItem(option);
    }

    public resetActiveItem(): void {
        this.keyboardEventsManager.setActiveItem(-1);
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
        return Boolean(this.keyboardEventsManager.activeItem && this.keyboardEventsManager.activeItemIndex >= 0);
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        switch (event.code) {
            case KEYBOARD_CODE.ARROW_DOWN:
            case KEYBOARD_CODE.ARROW_UP:
                this.keyboardEventsManager.onKeydown(event);
                this.announceNavigatedOption();
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

        // prevent closing on enter
        if (!this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
        }

        if (this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER) {

            if (!this.keyboardEventsManager.activeItem) {
                throw new Error("ActiveItem is not defined");
            }

            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem.element.nativeElement.click();
        }

        if (event.code === KEYBOARD_CODE.TAB || event.code === KEYBOARD_CODE.ESCAPE) {
            this.popup.toggle();
            this.announceDropdown(this.popup.showing);
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent opening on enter and prevent scrolling page on key down/key up when focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }

        if (event.code === KEYBOARD_CODE.ARROW_DOWN) {
            this.popup.toggle();
            this.scrollToActiveItem({ block: "center" });
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return event.code === KEYBOARD_CODE.ARROW_DOWN || event.code === KEYBOARD_CODE.ARROW_UP
            || event.code === KEYBOARD_CODE.ENTER;
    }

    private announceNavigatedOption(): void {
        const activeItem = this.keyboardEventsManager.activeItem;

        if (activeItem) {
            this.liveAnnouncer.announce((activeItem as any).value);
        }
    }

    private announceDropdown(open: boolean) {
        const message = open ? `${this.optionItems.length} ${ANNOUNCER_OPEN_MESSAGE_SUFFIX}` : ANNOUNCER_CLOSE_MESSAGE;

        this.liveAnnouncer.announce(message);
    }
}
