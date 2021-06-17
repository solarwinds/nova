import { Injectable, QueryList } from "@angular/core";
import { MenuItemBaseComponent, MenuPopupComponent } from "../menu";
import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { KEYBOARD_CODE } from "../../constants";

const scrollOption = { block: "nearest" } as ScrollIntoViewOptions;

@Injectable()
export class TimePickerKeyboardService {
    public overlay: OverlayComponent;
    private popup: MenuPopupComponent;
    private menuItems: QueryList<MenuItemBaseComponent>;
    private keyboardEventsManager: ActiveDescendantKeyManager<MenuItemBaseComponent>;
    private menuTrigger: HTMLElement;

    initService(
        items: QueryList<MenuItemBaseComponent>,
        popup: MenuPopupComponent,
        overlay: OverlayComponent,
        trigger: HTMLElement
    ): void {
        this.overlay = overlay;
        this.popup = popup;
        this.menuItems = items;
        this.keyboardEventsManager = new ActiveDescendantKeyManager<MenuItemBaseComponent>(items);
        this.keyboardEventsManager.setActiveItem(this.getSelectedIndex());
        this.menuTrigger = trigger;
    }

    onKeyDown(event: KeyboardEvent): void {
        this.overlay.showing ? this.handleOpenedMenu(event) : this.handleClosedMenu(event);
    }

    private handleOpenedMenu(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ESCAPE) {
            this.hideMenu();
        }

        if (code === KEYBOARD_CODE.ARROW_DOWN || code === KEYBOARD_CODE.ARROW_UP) {
            this.navigateByArrow(event);
        }

        if (code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
            this.keyboardEventsManager.activeItem?.doAction(event);
        }
    }

    private handleClosedMenu(event: KeyboardEvent): void {
        const { code } = event;
        const isIconTrigger = document.activeElement === this.menuTrigger && this.isOpenMenuCode(code as KEYBOARD_CODE);

        if (code === KEYBOARD_CODE.ARROW_DOWN || isIconTrigger) {
            event.preventDefault();
            this.overlay.show();
            this.keyboardEventsManager.activeItem?.menuItem?.nativeElement?.scrollIntoView({ block: "center" });
        }
    }

    private hideMenu(): void {
        this.overlay.hide();
    }

    private navigateByArrow(event: KeyboardEvent): void {
        const { code } = event;
        const index = this.keyboardEventsManager.activeItemIndex;

        event.preventDefault();

        if (code === KEYBOARD_CODE.ARROW_UP && index === 0) {
            this.navigateOnLast();

            return;
        }

        if (code === KEYBOARD_CODE.ARROW_DOWN && index === this.menuItems.length) {
            this.navigateOnFirst();

            return;
        }

        this.keyboardEventsManager.onKeydown(event);
        this.keyboardEventsManager.activeItem?.menuItem?.nativeElement?.scrollIntoView(scrollOption);
    }

    private navigateOnLast(): void {
        this.keyboardEventsManager.setActiveItem(this.menuItems.length - 1);
        this.keyboardEventsManager.activeItem?.menuItem.nativeElement.scrollIntoView(scrollOption);
    }

    private navigateOnFirst(): void {
        this.keyboardEventsManager.setActiveItem(0);
        this.keyboardEventsManager.activeItem?.menuItem.nativeElement.scrollIntoView(scrollOption);
    }

    private getSelectedIndex(): number {
        return this.popup.menuItems.toArray().findIndex((component) => {
            const parent = component.menuItem.nativeElement.parentElement;

            return parent.classList.contains("nui-menu-item--selected");
        });
    }

    private isOpenMenuCode(code: KEYBOARD_CODE): boolean {
        return code === KEYBOARD_CODE.ENTER ||  code === KEYBOARD_CODE.SPACE || code === KEYBOARD_CODE.ARROW_DOWN;
    }
}
