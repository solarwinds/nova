import { Injectable } from "@angular/core";
import { KEYBOARD_CODE } from "../../constants";
import { MenuComponent } from "../menu";

@Injectable()
export class ToolbarKeyboardService {
    private toolbarItems: HTMLElement[] = [];
    private menu: MenuComponent | undefined;

    public setToolbarItems(items: HTMLElement[], menu?: MenuComponent): void {
        this.toolbarItems = items;
        this.menu = menu;
    }

    public onKeyDown(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ARROW_LEFT || code === KEYBOARD_CODE.ARROW_RIGHT) {
            event.preventDefault();
            this.navigateByArrow(code);
        }

        if (code === KEYBOARD_CODE.TAB) {
            this.closeMenuIfOpened();
        }
    }

    private navigateByArrow(code: KEYBOARD_CODE): void {
        const activeEl = document.activeElement;
        const activeIndex = this.toolbarItems.indexOf(activeEl as HTMLElement);
        const first = this.toolbarItems[0];
        const last = this.toolbarItems[this.toolbarItems.length - 1];

        if (code === KEYBOARD_CODE.ARROW_LEFT) {
            activeEl === first ? this.focusLast() : this.focusLeft(activeIndex);
        }

        if (code === KEYBOARD_CODE.ARROW_RIGHT && activeIndex !== -1) {
            activeEl === last ? this.focusFirst() : this.focusRight(activeIndex);
        }
    }

    private focusFirst(): void {
        this.toolbarItems[0].focus();
        this.closeMenuIfOpened();
    }

    private focusLast(): void {
        this.toolbarItems[this.toolbarItems.length - 1].focus();
    }

    private focusRight(index: number) {
        this.toolbarItems[index + 1]?.focus();
    }

    private focusLeft(index: number) {
        this.toolbarItems[index - 1]?.focus();
        this.closeMenuIfOpened();
    }

    private closeMenuIfOpened() {
        if (this.menu && this.menu?.popup?.isOpen) {
            this.menu.popup.isOpen = false;
        }
    }
}
