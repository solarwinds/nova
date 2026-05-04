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
import { DOCUMENT } from "@angular/common";
import {
    ElementRef,
    Injectable,
    OnDestroy,
    QueryList,
    Renderer2,
    Inject,
    inject,
} from "@angular/core";
import isNull from "lodash/isNull";
import { Subject, Subscription } from "rxjs";

import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { MenuActionComponent } from "./menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemBaseComponent } from "./menu-item/menu-item/menu-item-base";
import { MenuItemComponent } from "./menu-item/menu-item/menu-item.component";
import { MenuPopupComponent } from "./menu-popup/menu-popup.component";
import { IPopupActiveOptions } from "./public-api";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

@Injectable()
export class MenuKeyControlService implements OnDestroy {
    private live = inject(LiveAnnouncer);
    private renderer = inject(Renderer2);

    public popup: PopupComponent;
    public menuGroups: QueryList<MenuGroupComponent>;
    public menuItems: QueryList<MenuItemBaseComponent>;
    public menuToggle: ElementRef;
    public menuPopup: MenuPopupComponent;
    public menuOpenListener: Subject<void>;
    public keyControlItemsSource: boolean = false;
    public keyboardEventsManager: ActiveDescendantKeyManager<MenuItemBaseComponent>;
    public menuOpenListenerSubscription: Subscription;
    private keyboardEventsSubscription: Subscription;
    private _scrollContainer: ElementRef;
    private pendingInitialActivation: "first" | "last" | null = null;

    public set scrollContainer(container: ElementRef) {
        this._scrollContainer = container;
    }

    public get scrollContainer(): ElementRef<any> {
        return this._scrollContainer || this.popup?.popupAreaContainer;
    }

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {}

    public initKeyboardManager(): void {
        // Guard: For itemsSource menus, menuPopup must be available first
        // MenuPopup is only rendered when menu is opened, so we need to defer initialization
        if (this.keyControlItemsSource && !this.menuPopup) {
            return;
        }

        // Initialize keyboard manager
        this.keyboardEventsManager = this.keyControlItemsSource
            ? new ActiveDescendantKeyManager(
                  this.menuPopup.menuItems
              ).withVerticalOrientation()
            : new ActiveDescendantKeyManager(
                  this.menuItems
              ).withVerticalOrientation();

        if (this.keyboardEventsSubscription) {
            this.keyboardEventsSubscription.unsubscribe();
        }

        this.initKeyManagerHandlers();

        // when opening menu key 'focus' should disappear from items
        if (this.menuOpenListener) {
            this.menuOpenListenerSubscription = this.menuOpenListener.subscribe(
                () => {
                    // Use timeout to ensure DOM is ready
                    setTimeout(() => {
                        this.activatePendingItem();
                    }, 0);

                    this.live.announce(`
                    ${
                        this.keyControlItemsSource
                            ? this.menuPopup?.menuItems?.length || 0
                            : this.menuItems?.length || 0
                    } menu items available.`);
                }
            );
        }
    }

    public handleKeydown(event: KeyboardEvent): void {
        this.popup.isOpen
            ? this.handleOpenKeyDown(event)
            : this.handleClosedKeyDown(event);
    }

    public setActiveItem(index: number): void {
        this.keyboardEventsManager.setActiveItem(index);
    }

    public getActiveItemIndex(): number | null {
        return this.keyboardEventsManager.activeItemIndex;
    }

    private activatePendingItem(): void {
        if (this.pendingInitialActivation === "first") {
            this.keyboardEventsManager.setFirstItemActive();
        } else if (this.pendingInitialActivation === "last") {
            this.keyboardEventsManager.setLastItemActive();
        } else {
            this.keyboardEventsManager.setActiveItem(-1);
        }
        this.pendingInitialActivation = null;
    }

    private initKeyManagerHandlers(): void {
        this.keyboardEventsSubscription =
            this.keyboardEventsManager.change.subscribe(activeIndex => {
                // when the navigation item changes, we get new activeIndex
                if (this.popup.isOpen && this.hasActiveItem()) {
                    this.scrollActiveOptionIntoView({
                        scrollContainer:
                            this.scrollContainer ||
                            this.popup.popupAreaContainer,
                        menuItemHeight:
                            this.keyboardEventsManager.activeItem?.menuItem
                                .nativeElement.offsetHeight,
                        activeOptionIndex: activeIndex,
                        menuGroups: this.menuGroups,
                        menuItems: this.menuItems,
                    });
                }
            });
    }

    private shouldCloseOnEnter(): boolean {
        const activeItem = this.keyboardEventsManager.activeItem;
        return (
            activeItem instanceof MenuActionComponent ||
            activeItem instanceof MenuItemComponent
        );
    }

    private hasActiveItem(): boolean {
        if (
            isNull(this.keyboardEventsManager.activeItem) ||
            isNull(this.keyboardEventsManager.activeItemIndex)
        ) {
            return false;
        }
        return (
            this.keyboardEventsManager.activeItem &&
            this.keyboardEventsManager.activeItemIndex >= 0
        );
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        if (
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.code === KEYBOARD_CODE.ARROW_UP
        ) {
            // passing the event to key manager so we get a change fired
            this.keyboardEventsManager.onKeydown(event);
            this.announceCurrentItem();
        }
        if (
            event.code === KEYBOARD_CODE.PAGE_UP ||
            event.code === KEYBOARD_CODE.HOME ||
            (event.metaKey && event.code === KEYBOARD_CODE.ARROW_UP)
        ) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setFirstItemActive();
            this.announceCurrentItem();
        }
        if (
            event.code === KEYBOARD_CODE.PAGE_DOWN ||
            event.code === KEYBOARD_CODE.END ||
            (event.metaKey && event.code === KEYBOARD_CODE.ARROW_DOWN)
        ) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setLastItemActive();
            this.announceCurrentItem();
        }

        // This keeps the active item visible within the visible area of the menu popup. In case there are disabled items in the list,
        // this scrolls down to the nearest enabled item. Otherwise, the active item will "jump over" the disabled items and remain
        // outside of the visible edge of the list.
        this.keyboardEventsManager.activeItem?.menuItem?.nativeElement?.scrollIntoView(
            { block: "nearest" }
        );

        // prevent closing on enter
        if (!this.hasActiveItem() && event.code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
        }

        if (
            this.hasActiveItem() &&
            (event.code === KEYBOARD_CODE.ENTER ||
                event.code === KEYBOARD_CODE.SPACE)
        ) {
            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem?.doAction(event);
            // closing items only if they are MenuAction or MenuItem, others should not close popup
            if (!this.shouldCloseOnEnter()) {
                event.preventDefault();
                return;
            }
            this.popup.toggleOpened(event);
        }
        if (
            event.code === KEYBOARD_CODE.TAB ||
            event.code === KEYBOARD_CODE.ESCAPE
        ) {
            this.popup.toggleOpened(event);
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent opening on enter and prevent scrolling page on key down/key up when focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }

        if (
            event.code === KEYBOARD_CODE.ENTER ||
            event.code === KEYBOARD_CODE.SPACE ||
            event.code === KEYBOARD_CODE.ARROW_DOWN
        ) {
            this.pendingInitialActivation = "first";
            this.popup.toggleOpened(event);
        }

        if (event.code === KEYBOARD_CODE.ARROW_UP) {
            this.pendingInitialActivation = "last";
            this.popup.toggleOpened(event);
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return (
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.code === KEYBOARD_CODE.ARROW_UP ||
            event.code === KEYBOARD_CODE.ENTER ||
            event.code === KEYBOARD_CODE.SPACE
        );
    }

    // functions to scroll items into view for ActiveDescendantKeyManager
    private countGroupLabelsBeforeOption(
        optionIndex: number,
        options: QueryList<MenuItemBaseComponent>,
        optionGroups: QueryList<MenuGroupComponent>
    ): number {
        if (optionGroups.length) {
            const optionsArray = options.toArray();
            const groups = optionGroups.toArray();
            let groupCounter = 0;

            for (let i = 0; i < optionIndex + 1; i++) {
                if (
                    optionsArray[i].group &&
                    optionsArray[i].group === groups[groupCounter]
                ) {
                    groupCounter++;
                }
            }

            return groupCounter;
        }
        return 0;
    }

    private getOptionScrollPosition(
        optionIndex: number,
        optionHeight: number,
        currentScrollPosition: number,
        panelHeight: number
    ): number {
        const optionOffset = optionIndex * optionHeight;

        if (optionOffset < currentScrollPosition) {
            return optionOffset;
        }

        if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
            return Math.max(0, optionOffset - panelHeight + optionHeight);
        }

        return currentScrollPosition;
    }

    private scrollActiveOptionIntoView(options: IPopupActiveOptions): void {
        const activeOptionIndex = options.activeOptionIndex || 0;
        const labelCount = this.countGroupLabelsBeforeOption(
            activeOptionIndex,
            options.menuItems,
            options.menuGroups
        );

        options.scrollContainer.nativeElement.scrollTop =
            this.getOptionScrollPosition(
                activeOptionIndex + labelCount,
                options.menuItemHeight + 4,
                options.scrollContainer.nativeElement.scrollTop,
                300
            );
    }

    private announceCurrentItem() {
        this.live.announce(
            `Active item ${this.keyboardEventsManager?.activeItem?.menuItem.nativeElement.innerText}.`
        );
    }

    public ngOnDestroy(): void {
        this.keyboardEventsSubscription?.unsubscribe();
        this.menuOpenListenerSubscription?.unsubscribe();
    }
}
