import { ActiveDescendantKeyManager, LiveAnnouncer } from "@angular/cdk/a11y";
import { BACKSPACE, LEFT_ARROW, RIGHT_ARROW } from "@angular/cdk/keycodes";
import { Injectable, QueryList } from "@angular/core";
import isNil from "lodash/isNil";

import { ComboboxV2Component } from "./combobox-v2/combobox-v2.component";
import { MarkAsSelectedItemDirective } from "./mark-as-selected-item.directive";


@Injectable()
export class SelectedItemsKeyControlService {

    private selectedItems: QueryList<MarkAsSelectedItemDirective>;
    private selectedItemsKeyManager: ActiveDescendantKeyManager<any>;
    private activeSelectedItemIndex?: number;
    private combobox: ComboboxV2Component;
    private inputElement: HTMLInputElement;

    constructor(public liveAnnouncer: LiveAnnouncer) {}

    public initSelectedItemsKeyManager(elems: QueryList<MarkAsSelectedItemDirective>, combobox: ComboboxV2Component): void {
        this.combobox = combobox;
        this.inputElement = combobox.inputElement?.nativeElement;
        this.selectedItems = elems;

        this.selectedItemsKeyManager = new ActiveDescendantKeyManager(elems).withHorizontalOrientation("ltr").withWrap();

        if (!isNil(this.activeSelectedItemIndex) && this.activeSelectedItemIndex >= 0 && Number.isInteger(this.activeSelectedItemIndex)) {
            setTimeout(() => this.selectedItemsKeyManager.setActiveItem(this.activeSelectedItemIndex));
        }
    }

    public onKeydown(event: KeyboardEvent): void {
        const caretPosition = (event.target as HTMLInputElement).selectionStart;
        const isKeyAllowed = this.isBackspace(event) || this.isLeftOrRightArrow(event);

        if ((caretPosition !== 0) || (!this.activeItem && this.isRightArrow(event))) {
            return;
        }

        if (!isKeyAllowed) {
            this.deactivateSelectedItems();
            return;
        }

        if (!this.combobox.manualDropdownControl && !this.activeItem) {
            this.combobox.hideDropdown();
        }

        if (this.isLeftArrow(event) && (this.activeItem !== this.selectedItems.first)) {
            this.selectedItemsKeyManager.onKeydown(event);
            this.liveAnnouncer.announce(`${this.getActiveItemTitle} selected`);
            return;
        }

        if (this.isRightArrow(event) && this.activeItem) {
            this.handleRightArrow(event);
            return;
        }

        if (this.isBackspace(event)) {
            this.handleBackspace();
            return;
        }
    }

    public setLastItemActive(): void {
        this.selectedItemsKeyManager.setLastItemActive();
    }

    public isSelectedItemsActive(): boolean {
        return Boolean(this.activeItem);
    }

    public deactivateSelectedItems(): void {
        this.selectedItemsKeyManager.setActiveItem(-1);
        this.activeSelectedItemIndex = undefined;
    }

    private handleBackspace(): void {
        if (this.activeItem) {
            this.deselectItem();
            return;
        }

        if (!this.activeItem) {
            this.setLastItemActive();
            return;
        }
    }

    private handleRightArrow(event: KeyboardEvent): void {
        const isLastSelectedItemActive = (this.activeItem === this.selectedItems.last);

        if (isLastSelectedItemActive) {
            this.selectedItemsKeyManager.onKeydown(event);
            this.deactivateSelectedItems();

            if (!this.combobox.manualDropdownControl) {
                this.combobox.showDropdown();
            }

            return;
        }

        this.selectedItemsKeyManager.onKeydown(event);
        this.liveAnnouncer.announce(`${this.getActiveItemTitle} selected`);
    }

    private calculateActiveSelectedItemIndex(): void {

        if (isNil(this.selectedItemsKeyManager.activeItemIndex)) {
            throw new Error("ActiveItemIndex is not defined");
        }

        const previousItemIndex = this.selectedItemsKeyManager.activeItemIndex - 1;

        if (previousItemIndex >= 0) {
            this.activeSelectedItemIndex = previousItemIndex;
            return;
        }

        if (previousItemIndex === -1 && this.selectedItems.length > 1) {
            this.activeSelectedItemIndex = 0;
            return;
        }

        if (previousItemIndex === -1 && this.selectedItems.length) {
            this.activeSelectedItemIndex = undefined;
            return;
        }

        if (previousItemIndex >= 0 && this.selectedItems.length === 0) {
            this.activeSelectedItemIndex = undefined;
            return;
        }
    }

    private isBackspace(event: KeyboardEvent): boolean {
        return event.keyCode === BACKSPACE;
    }

    private isLeftOrRightArrow(event: KeyboardEvent) {
        return this.isLeftArrow(event) || this.isRightArrow(event);
    }

    private isRightArrow(event: KeyboardEvent) {
        return event.keyCode === RIGHT_ARROW;
    }

    private isLeftArrow(event: KeyboardEvent) {
        return event.keyCode === LEFT_ARROW;
    }

    private get activeItem() {
        return this.selectedItemsKeyManager.activeItem;
    }

    private deselectItem(): void {
        if (!isNil(this.selectedItemsKeyManager.activeItemIndex)) {
            this.calculateActiveSelectedItemIndex();
            this.combobox.deselectItem(this.selectedItemsKeyManager.activeItemIndex);
            this.liveAnnouncer.announce(`${this.getActiveItemTitle} removed`);
        }
    }

    private get getActiveItemTitle(): string {
        return this.activeItem?.cdRef.context.item.label || "";
    }
}
