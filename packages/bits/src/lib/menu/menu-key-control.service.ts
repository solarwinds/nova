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
import { ElementRef, Injectable, OnDestroy, QueryList } from "@angular/core";
import isNull from "lodash/isNull";
import { Subject, Subscription } from "rxjs";

import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "./menu-item/menu-item/menu-item.component";
import { MenuPopupComponent } from "./menu-popup/menu-popup.component";
import { KEYBOARD_CODE, KEY_CODE } from "../../constants/keycode.constants";
import { MenuActionComponent } from "../menu/menu-item/menu-action/menu-action.component";
import { MenuLinkComponent } from "./menu-item/menu-link/menu-link.component";
import { MenuItemBaseComponent } from "../menu/menu-item/menu-item/menu-item-base";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { IPopupActiveOptions } from "../public-api";

@Injectable()
export class MenuKeyControlService implements OnDestroy {
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

    public set scrollContainer(container: ElementRef) {
        this._scrollContainer = container;
    }

    public get scrollContainer(): ElementRef<any> {
        return this._scrollContainer || this.popup?.popupAreaContainer;
    }

    constructor(private live: LiveAnnouncer) {}

    public initKeyboardManager(): void {
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
                    // Uncomment in the scope of NUI-6104
                    // this.keyboardEventsManager.setFirstItemActive();

                    // Remove this in the scope of NUI-6104 in favor of the line above
                    this.keyboardEventsManager.setActiveItem(-1);
                    const itemCount = this.keyControlItemsSource
                        ? this.menuPopup.menuItems.length
                        : this.menuItems.length;
                    this.live.announce(
                        $localize`:@@nuiMenuItemsAvailable:${itemCount}:itemCount: menu items available.`
                    );

                    // Uncomment in the scope of NUI-6104 and adjust this to be the part of the announcer's string above
                    // Active item ${this.keyboardEventsManager?.activeItem?.menuItem.nativeElement.innerText}.`);
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

    private initKeyManagerHandlers(): void {
        this.keyboardEventsSubscription =
            this.keyboardEventsManager.change.subscribe((activeIndex) => {
                // when the navigation item changes, we get new activeIndex
                if (this.popup.isOpen && this.hasActiveItem()) {
                    const itemEl = this.keyboardEventsManager.activeItem?.menuItem.nativeElement;
                    // Focus the semantic menu item host, not inner controls, so SR keeps menu navigation mode.
                    const focusTarget: HTMLElement | null =
                        itemEl?.closest?.('[role="menuitem"], [role="menuitemcheckbox"]') ??
                        itemEl?.closest?.('[tabindex="-1"]') ??
                        itemEl;
                    focusTarget?.focus();
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
        // if the item is a MenuItemComponent, we check if it wants to propagate the close action
        if (
            this.keyboardEventsManager.activeItem instanceof MenuItemComponent &&
            !(this.keyboardEventsManager.activeItem as MenuItemComponent)
                .propagateClose
        ) {
            return false;
        }

        return (
            this.keyboardEventsManager.activeItem instanceof
                MenuActionComponent ||
            this.keyboardEventsManager.activeItem instanceof MenuItemComponent ||
            this.keyboardEventsManager.activeItem instanceof MenuLinkComponent
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
            this.isArrowDown(event) ||
            this.isArrowUp(event)
        ) {
            event.preventDefault();
            // passing the event to key manager so we get a change fired
            this.keyboardEventsManager.onKeydown(event);
        }
        if (
            this.isPageUp(event) ||
            this.isHome(event) ||
            (event.metaKey && this.isArrowUp(event))
        ) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setFirstItemActive();
        }
        if (
            this.isPageDown(event) ||
            this.isEnd(event) ||
            (event.metaKey && this.isArrowDown(event))
        ) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setLastItemActive();
        }

        // This keeps the active item visible within the visible area of the menu popup. In case there are disabled items in the list,
        // this scrolls down to the nearest enabled item. Otherwise, the active item will "jump over" the disabled items and remain
        // outside of the visible edge of the list.
        this.keyboardEventsManager.activeItem?.menuItem?.nativeElement?.scrollIntoView(
            { block: "nearest" }
        );

        // prevent page scrolling on space
        if (this.isSpace(event)) {
            event.preventDefault();
        }

        // prevent closing on enter
        if (!this.hasActiveItem() && (this.isEnter(event) || this.isSpace(event))) {
            event.preventDefault();
        }

        if (this.hasActiveItem() && (this.isEnter(event) || this.isSpace(event))) {
            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem?.doAction(event);
            // closing items only if they are MenuAction or MenuItem, others should not close popup
            if (!this.shouldCloseOnEnter()) {
                event.preventDefault();
                return;
            }
            this.popup.toggleOpened(event);
            this.menuToggle.nativeElement.focus();
        }
        if (
            this.isTab(event) ||
            this.isEscape(event)
        ) {
            this.popup.toggleOpened(event);
            this.menuToggle.nativeElement.focus();
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        if (this.isArrowDown(event) || this.isEnter(event) || this.isSpace(event)) {
            event.preventDefault();
            this.popup.toggleOpened(event);
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return (
            this.isArrowUp(event)
        );
    }

    private isArrowDown(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.ARROW_DOWN ||
            event.key === KEYBOARD_CODE.ARROW_DOWN ||
            event.key === "Down" ||
            event.keyCode === KEY_CODE.DOWN_ARROW
        );
    }

    private isArrowUp(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.ARROW_UP ||
            event.key === KEYBOARD_CODE.ARROW_UP ||
            event.key === "Up" ||
            event.keyCode === KEY_CODE.UP_ARROW
        );
    }

    private isEnter(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.ENTER ||
            event.key === KEYBOARD_CODE.ENTER ||
            event.keyCode === KEY_CODE.ENTER
        );
    }

    private isSpace(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.SPACE ||
            event.key === " " ||
            event.key === "Spacebar" ||
            event.keyCode === KEY_CODE.SPACE
        );
    }

    private isTab(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.TAB ||
            event.key === KEYBOARD_CODE.TAB ||
            event.keyCode === KEY_CODE.TAB
        );
    }

    private isEscape(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.ESCAPE ||
            event.key === KEYBOARD_CODE.ESCAPE ||
            event.key === "Esc" ||
            event.keyCode === KEY_CODE.ESCAPE
        );
    }

    private isHome(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.HOME ||
            event.key === KEYBOARD_CODE.HOME ||
            event.keyCode === KEY_CODE.HOME
        );
    }

    private isEnd(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.END ||
            event.key === KEYBOARD_CODE.END ||
            event.keyCode === KEY_CODE.END
        );
    }

    private isPageUp(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.PAGE_UP ||
            event.key === KEYBOARD_CODE.PAGE_UP ||
            event.keyCode === KEY_CODE.PAGE_UP
        );
    }

    private isPageDown(event: KeyboardEvent): boolean {
        return (
            event.code === KEYBOARD_CODE.PAGE_DOWN ||
            event.key === KEYBOARD_CODE.PAGE_DOWN ||
            event.keyCode === KEY_CODE.PAGE_DOWN
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

    public ngOnDestroy(): void {
        if (this.keyboardEventsSubscription) {
            this.keyboardEventsSubscription.unsubscribe();
        }

        if (this.menuOpenListenerSubscription) {
            this.menuOpenListenerSubscription.unsubscribe();
        }
    }
}
