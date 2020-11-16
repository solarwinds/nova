import { ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { DOWN_ARROW, ENTER, ESCAPE, PAGE_DOWN, PAGE_UP, TAB, UP_ARROW } from "@angular/cdk/keycodes";
import { ElementRef, Injectable, OnDestroy, QueryList } from "@angular/core";
import isNull from "lodash/isNull";
import { Subject, Subscription } from "rxjs";

import { MenuActionComponent } from "../menu/menu-item/menu-action/menu-action.component";
import { MenuItemBaseComponent } from "../menu/menu-item/menu-item/menu-item-base";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { IPopupActiveOptions } from "../public-api";

import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "./menu-item/menu-item/menu-item.component";
import { MenuPopupComponent } from "./menu-popup/menu-popup.component";

@Injectable()
export class MenuKeyControlService implements OnDestroy {
    public popup: PopupComponent;
    public menuGroups: QueryList<MenuGroupComponent>;
    public menuItems: QueryList<MenuItemBaseComponent>;
    public menuToggle: ElementRef;
    public menuPopup: MenuPopupComponent;
    public set scrollContainer(container: ElementRef) {
        this._scrollContainer = container;
    }
    public get scrollContainer() {
        return this._scrollContainer || this.popup?.popupAreaContainer;
    }
    public menuOpenListener: Subject<boolean>;
    public keyControlItemsSource: boolean = false;
    public keyboardEventsManager: ActiveDescendantKeyManager<MenuItemBaseComponent>;
    public menuOpenListenerSubscription: Subscription;
    private keyboardEventsSubscription: Subscription;
    private _scrollContainer: ElementRef;

    public initKeyboardManager(): void {
        this.keyboardEventsManager = this.keyControlItemsSource ?
            new ActiveDescendantKeyManager(this.menuPopup.menuItems).withVerticalOrientation() :
            new ActiveDescendantKeyManager(this.menuItems).withVerticalOrientation();
        if (this.keyboardEventsSubscription) {
            this.keyboardEventsSubscription.unsubscribe();
        }
        this.initKeyManagerHandlers();

        // when opening menu key 'focus' should disappear from items
        if (this.menuOpenListener) {
            this.menuOpenListenerSubscription = this.menuOpenListener.subscribe(() => {
                this.keyboardEventsManager.setActiveItem(-1);
            });
        }
    }

    public handleKeydown(event: KeyboardEvent): void {
        this.popup.isOpen ? this.handleOpenKeyDown(event) : this.handleClosedKeyDown(event);
    }

    public setActiveItem(index: number): void {
        this.keyboardEventsManager.setActiveItem(index);
    }

    public getActiveItemIndex(): number | null {
        return this.keyboardEventsManager.activeItemIndex;
    }

    private initKeyManagerHandlers(): void {
        this.keyboardEventsSubscription = this.keyboardEventsManager
            .change
            .subscribe((activeIndex) => {
                // when the navigation item changes, we get new activeIndex
                if (this.popup.isOpen && this.hasActiveItem()) {
                    this.scrollActiveOptionIntoView({
                        scrollContainer: this.scrollContainer || this.popup.popupAreaContainer,
                        menuItemHeight: this.keyboardEventsManager.activeItem?.menuItem.nativeElement.offsetHeight,
                        activeOptionIndex: activeIndex,
                        menuGroups: this.menuGroups,
                        menuItems: this.menuItems,
                    });
                }
            });
    }

    private shouldCloseOnEnter(): boolean {
        return this.keyboardEventsManager.activeItem instanceof (MenuActionComponent || MenuItemComponent);
    }

    private hasActiveItem(): boolean {
        if (isNull(this.keyboardEventsManager.activeItem) || isNull(this.keyboardEventsManager.activeItemIndex)) {
            return false;
        }
        return this.keyboardEventsManager.activeItem && this.keyboardEventsManager.activeItemIndex >= 0;
    }

    private handleOpenKeyDown(event: KeyboardEvent): void {
        if (event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW) {
            // passing the event to key manager so we get a change fired
            this.keyboardEventsManager.onKeydown(event);
        }
        if (event.keyCode === PAGE_UP) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setFirstItemActive();
        }
        if (event.keyCode === PAGE_DOWN) {
            event.preventDefault();
            this.keyboardEventsManager.onKeydown(event);
            this.keyboardEventsManager.setLastItemActive();
        }

        // prevent closing on enter
        if (!this.hasActiveItem() && event.keyCode === ENTER) {
            event.preventDefault();
        }

        if (this.hasActiveItem() && event.keyCode === ENTER) {
            // perform action in menu item(select, switch, check etc).
            this.keyboardEventsManager.activeItem?.doAction(event);
            // closing items only if they are MenuAction or MenuItem, others should not close popup
            if (!this.shouldCloseOnEnter()) {
                event.preventDefault();
                return;
            }
            this.popup.toggleOpened(event);
        }
        if (event.keyCode === TAB || event.keyCode === ESCAPE) {
            this.popup.toggleOpened(event);
        }
    }

    private handleClosedKeyDown(event: KeyboardEvent): void {
        // prevent opening on enter and prevent scrolling page on key down/key up when focused
        if (this.shouldBePrevented(event)) {
            event.preventDefault();
        }

        if (event.keyCode === DOWN_ARROW) {
            this.popup.toggleOpened(event);
        }
    }

    private shouldBePrevented(event: KeyboardEvent) {
        return event.keyCode === DOWN_ARROW || event.keyCode === UP_ARROW || event.keyCode === ENTER;
    }

    // functions to scroll items into view for ActiveDescendantKeyManager
    private countGroupLabelsBeforeOption(optionIndex: number, options: QueryList<MenuItemBaseComponent>,
                                               optionGroups: QueryList<MenuGroupComponent>): number {
        if (optionGroups.length) {
            const optionsArray = options.toArray();
            const groups = optionGroups.toArray();
            let groupCounter = 0;

            for (let i = 0; i < optionIndex + 1; i++) {
                if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
                    groupCounter++;
                }
            }

            return groupCounter;
        }
        return 0;
    }


    private getOptionScrollPosition(optionIndex: number, optionHeight: number,
                                          currentScrollPosition: number, panelHeight: number): number {
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
        const labelCount = this.countGroupLabelsBeforeOption(activeOptionIndex, options.menuItems, options.menuGroups);

        options.scrollContainer.nativeElement.scrollTop = this.getOptionScrollPosition(
            activeOptionIndex + labelCount,
            options.menuItemHeight + 4,
            options.scrollContainer.nativeElement.scrollTop,
            300
        );
    }

    ngOnDestroy(): void {
        if (this.keyboardEventsSubscription) {
            this.keyboardEventsSubscription.unsubscribe();
        }

        if (this.menuOpenListenerSubscription) {
            this.menuOpenListenerSubscription.unsubscribe();
        }
    }
}
