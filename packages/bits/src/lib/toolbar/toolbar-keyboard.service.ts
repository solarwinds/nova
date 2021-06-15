import { Injectable } from "@angular/core";
import { KEYBOARD_CODE } from "../../constants";

@Injectable()
export class ToolbarKeyboardService {
    private toolbarItems: HTMLElement[] = [];

    public setToolbarItems(items: HTMLElement[]): void {
        this.toolbarItems = items;
    }

    public onKeyDown(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ARROW_LEFT || code === KEYBOARD_CODE.ARROW_RIGHT) {
            event.preventDefault();
            this.navigateByArrow(code);
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

        if (code === KEYBOARD_CODE.ARROW_RIGHT) {
            activeEl === last ? first.focus() : this.focusRight(activeIndex);
        }
    }

    private focusLast(): void {
        this.toolbarItems[this.toolbarItems.length - 1].focus();
    }

    private focusRight(index: number) {
        this.toolbarItems[index + 1]?.focus();
    }

    private focusLeft(index: number) {
        this.toolbarItems[index - 1]?.focus();
    }
}
