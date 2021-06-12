import { Injectable } from "@angular/core";
import { KEYBOARD_CODE } from "../../constants";
import { MenuComponent } from "../menu";

@Injectable()
export class ToolbarKeyboardService {
    public dynamicContainer: HTMLElement | null;

    public moreBtn: HTMLButtonElement | null;

    public menuComponent: MenuComponent | null = null;

    public initService(container: HTMLElement, menu: MenuComponent | null): void {
        this.dynamicContainer = container.querySelector(".nui-toolbar-content__dynamic");

        if (this.dynamicContainer) {
            this.moreBtn = this.dynamicContainer.querySelector(".nui-button.btn.menu-button");
        }

        if (menu) {
            this.menuComponent = menu;
        }
    }

    public disableFocusForMoreBtn(): void {
        if (this.moreBtn) {
            this.moreBtn.setAttribute("tabindex", "-1");
        }
    }

    public onKeyDown(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ARROW_LEFT || code === KEYBOARD_CODE.ARROW_RIGHT) {
            event.preventDefault();
            this.navigateByArrow(code);
        }
    }

    private navigateByArrow(code: string): void {
        const buttons = this.getButtons();
        const length = buttons.length;

        if (!length) {
            return;
        }

        const direction = code === KEYBOARD_CODE.ARROW_RIGHT ? 1 : -1;
        let nextIndex = buttons.findIndex((button) => button === document.activeElement) + direction;

        if (this.moreBtn && document.activeElement === this.moreBtn) {
            this.navigateFormMoreBtn(direction, buttons);

            return;
        }

        if ((nextIndex >= length || nextIndex < 0) && this.moreBtn) {
            this.moreBtn.focus();

            return;
        }

        if (nextIndex < 0 && !this.moreBtn) {
            nextIndex = length - 1;
        }

        if (nextIndex >= length && !this.moreBtn) {
            nextIndex = 0;
        }

        const button: HTMLButtonElement = buttons[nextIndex];

        button.focus();
    }

    private navigateFormMoreBtn(direction: number, buttons: any): void {
        if (this.menuComponent && this.menuComponent.popup) {
            this.menuComponent.popup.isOpen = false;
        }

        if (this.moreBtn && direction === 1) {
            buttons[0].focus();

            return;
        }

        buttons[buttons.length - 1].focus();
    }

    private getButtons(): HTMLButtonElement[] {
        const node = this.dynamicContainer;

        if (!node) {
            return [];
        }

        return Array.from(node.childNodes)
            .filter((node) => (node as HTMLElement).tagName === "BUTTON") as HTMLButtonElement[];
    }
}
