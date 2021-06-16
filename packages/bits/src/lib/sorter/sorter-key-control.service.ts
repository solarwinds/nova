import { Injectable, QueryList } from "@angular/core";
import { ListKeyManager, LiveAnnouncer } from "@angular/cdk/a11y";
import isNull from "lodash/isNull";

import { MenuItemBaseComponent } from "../menu";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { KEYBOARD_CODE } from "../../constants";
import { ANNOUNCER_CLOSE_SORTER_LIST_MESSAGE, ANNOUNCER_OPEN_SORTER_LIST_MESSAGE_SUFFIX } from "./constants";

@Injectable()
export class SorterKeyControlService {
    public overlay: OverlayComponent;
    public menuItems: QueryList<MenuItemBaseComponent>;
    private keyboardEventsManager: ListKeyManager<MenuItemBaseComponent>;

    constructor(private liveAnnouncer: LiveAnnouncer) {}

    public initKeyboardManager(): void {
        this.keyboardEventsManager = new ListKeyManager(this.menuItems).withVerticalOrientation();
        // TODO Uncomment in the scope of NUI-
        // this.keyboardEventsManager.setFirstItemActive();

        // TODO Remove this in the scope of NUI-
        this.keyboardEventsManager.setActiveItem(-1);
    }

    public handleKeydown(event: KeyboardEvent): void {
        this.overlay.showing ? this.handleOpenKeyDown(event) : this.handleClosedKeyDown(event);
    }

    public getActiveItemIndex(): number | null {
        return this.keyboardEventsManager.activeItemIndex;
    }

    public announceDropdown(open: boolean): void {
        const menuListLength = this.menuItems.toArray().length;
        const message = open ? `${menuListLength} ${ANNOUNCER_OPEN_SORTER_LIST_MESSAGE_SUFFIX}` : ANNOUNCER_CLOSE_SORTER_LIST_MESSAGE;
        this.liveAnnouncer.announce(message);
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        this.keyboardEventsManager.activeItem?.setInactiveStyles();
        if (event.code === KEYBOARD_CODE.ARROW_DOWN || event.code === KEYBOARD_CODE.ARROW_UP) {
            this.keyboardEventsManager.onKeydown(event);
            this.announceCurrentItem();
        }

        // TODO Remove this in the scope of NUI-
        // prevent closing on enter when item is not focused
        if (!this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
        }

        if (this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
            if (!this.keyboardEventsManager.activeItem) {
                throw new Error("ActiveItem is not defined");
            }

            this.keyboardEventsManager.activeItem?.menuItem.nativeElement.click();

            this.announceDropdown(this.overlay.showing);

            // TODO Remove this in the scope of NUI-
            this.keyboardEventsManager.setActiveItem(-1);
        }

        if (event.code === KEYBOARD_CODE.TAB || event.code === KEYBOARD_CODE.ESCAPE) {
            this.overlay.hide();
            this.announceDropdown(this.overlay.showing);

            // TODO Remove this in the scope of NUI-
            this.keyboardEventsManager.setActiveItem(-1);
        }

        this.keyboardEventsManager.activeItem?.setActiveStyles();
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent scrolling page on key down/key up when sorter focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }
    }

    private hasActiveItem(): boolean {
        if (isNull(this.keyboardEventsManager.activeItem) || isNull(this.keyboardEventsManager.activeItemIndex)) {
            return false;
        }
        return this.keyboardEventsManager.activeItem && this.keyboardEventsManager.activeItemIndex >= 0;
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return event.code === KEYBOARD_CODE.ARROW_DOWN || event.code === KEYBOARD_CODE.ARROW_UP;
    }

    private announceCurrentItem() {
        this.liveAnnouncer.announce(`Sort by ${this.keyboardEventsManager?.activeItem?.menuItem.nativeElement.innerText}.`);
    }
}
