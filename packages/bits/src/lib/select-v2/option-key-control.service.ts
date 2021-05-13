import { ActiveDescendantKeyManager, LiveAnnouncer } from "@angular/cdk/a11y";
import { DOWN_ARROW, ENTER, ESCAPE, PAGE_DOWN, PAGE_UP, TAB, UP_ARROW } from "@angular/cdk/keycodes";
import { Injectable, QueryList } from "@angular/core";
import isNil from "lodash/isNil";

import { IOption, IOverlayComponent } from "../overlay/types";
import { ANNOUNCER_CLOSE_MESSAGE, ANNOUNCER_OPEN_MESSAGE } from "./constants";

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

    public setSkipPredicate(predicate: (option: T) => boolean) {
        this.keyboardEventsManager.skipPredicate(predicate);
    }

    private hasActiveItem(): boolean {
        if (isNil(this.keyboardEventsManager.activeItemIndex)) {
            throw new Error("ActiveItemIndex is not defined");
        }
        return Boolean(this.keyboardEventsManager.activeItem && this.keyboardEventsManager.activeItemIndex >= 0);
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case DOWN_ARROW:
            case UP_ARROW:
                this.keyboardEventsManager.onKeydown(event);
                this.announceNavigatedOption();
                break;
            case PAGE_UP:
                event.preventDefault();
                this.keyboardEventsManager.onKeydown(event);
                this.keyboardEventsManager.setFirstItemActive();
                break;
            case PAGE_DOWN:
                event.preventDefault();
                this.keyboardEventsManager.onKeydown(event);
                this.keyboardEventsManager.setLastItemActive();
                break;
        }

        this.scrollToOption({ block: "nearest" });

        // prevent closing on enter
        if (!this.hasActiveItem() && event.keyCode === ENTER) {
            event.preventDefault();
        }

        if (this.hasActiveItem() && event.keyCode === ENTER) {

            if (!this.keyboardEventsManager.activeItem) {
                throw new Error("ActiveItem is not defined");
            }

            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem.element.nativeElement.click();
        }

        if (event.keyCode === TAB || event.keyCode === ESCAPE) {
            this.popup.toggle();
            this.announceDropdown(this.popup.showing);
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent opening on enter and prevent scrolling page on key down/key up when focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }

        if (event.keyCode === DOWN_ARROW) {
            this.popup.toggle();
            this.scrollToOption({ block: "center" });
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW || event.keyCode === ENTER;
    }

    private scrollToOption(options: ScrollIntoViewOptions): void {
        if (this.keyboardEventsManager.activeItem) {
            // setTimeout is necessary because scrolling to the selected item should occur only when overlay rendered
            setTimeout(() => {
                this.keyboardEventsManager.activeItem?.scrollIntoView(options);
            });
        }
    }

    private announceNavigatedOption(): void {
        const activeItem = this.keyboardEventsManager.activeItem;

        if (activeItem) {
            this.liveAnnouncer.announce((activeItem as any).value);
        }
    }

    private announceDropdown(open: boolean) {
        const message = open ? ANNOUNCER_OPEN_MESSAGE(this.optionItems.length) : ANNOUNCER_CLOSE_MESSAGE;

        this.liveAnnouncer.announce(message);
    }
}
