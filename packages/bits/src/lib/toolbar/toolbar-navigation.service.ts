import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Injectable } from "@angular/core";
import { KEYBOARD_CODE } from "../../constants";

@Injectable()
export class ToolbarNavigationService {
    private toolbarItems: HTMLElement[] = [];
    private embeddedContainer: HTMLElement | undefined;
    private active: Element | null;
    private activeIndex: number;

    constructor(private live: LiveAnnouncer) {}

    public setToolbarItems(items: HTMLElement[], embedded: HTMLElement | undefined): void {
        this.toolbarItems = items;
        this.embeddedContainer = embedded;
    }

    public onKeyDown(event: KeyboardEvent): void {
        this.active = document.activeElement;
        this.activeIndex = this.toolbarItems.indexOf(this.active as any);
        const first = this.toolbarItems[0];
        const last = this.toolbarItems[this.toolbarItems.length - 1];

        if (event.code === KEYBOARD_CODE.ARROW_LEFT || event.code === KEYBOARD_CODE.ARROW_RIGHT) {
            if (this.embeddedContainer && this.activeIndex === -1) {
                if (this.isParent(this.embeddedContainer, document.activeElement as HTMLElement)) {
                    this.embeddedContainer.focus();
                    return;
                }
            }
        }

        if (event.code === KEYBOARD_CODE.ARROW_LEFT) {
            this.active === first
                ? this.focusLast()
                : this.focusLeft();
        }

        if (event.code === KEYBOARD_CODE.ARROW_RIGHT) {
            this.active === last
                ? first.focus()
                : this.focusRight();
        }
    }

    private focusLast() {
        this.toolbarItems[this.toolbarItems.length - 1].focus();
        this.readCustomContainer();
    }

    private focusRight() {
        this.toolbarItems[this.activeIndex + 1]?.focus();
        this.readCustomContainer();
    }

    private focusLeft() {
        this.toolbarItems[this.activeIndex - 1]?.focus();
    }

    private isParent(parent: Element, child: Element): boolean {
        return child === parent ? true : this.isParent(parent, child.parentElement as Element);
    }

    private readCustomContainer() {
        if (this.embeddedContainer && document.activeElement === this.embeddedContainer) {
            this.live.announce(`
                This is a toolbar container with custom content.
                Press TAB to select the first focusable item inside this container.
                Press Left or Right Arrow keys to move the focus back to the toolbar custom container.
            `);
        }
    }
}
