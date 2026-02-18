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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import { OverlayAtom } from "../overlay/overlay.atom";

export class SorterAtom extends Atom {
    public static CSS_SELECTOR = ".nui-sorter";

    public get menuPopup(): MenuPopupAtom {
        return Atom.findIn<MenuPopupAtom>(MenuPopupAtom, this.getLocator());
    }

    public get overlay(): OverlayAtom {
        return Atom.findIn<OverlayAtom>(OverlayAtom, this.getLocator());
    }

    /** Click the sorter toggle to open/close the dropdown. */
    public async toggle(): Promise<void> {
        await this.toggleElement.click();
    }

    /** Toggle sorter and select a new item from the options. */
    public async select(title: string): Promise<void> {
        await this.toggle();
        await this.menuPopup.clickItemByText(title);
        await this.toBeCollapsed();
    }

    /** Get a menu item locator by its index. */
    public itemByIndex(index: number): Locator {
        return this.items.nth(index);
    }

    /** Get the locator for all menu items. */
    public get items(): Locator {
        return this.menuPopup.items;
    }

    /** Get the locator for selected menu items. */
    public get selectedItems(): Locator {
        return this.menuPopup.selectedItems;
    }

    /** Click a menu item by its visible text. */
    public async clickItemByText(title: string): Promise<void> {
        await this.menuPopup.clickItemByText(title);
    }

    /** Get the sorter button atom. */
    public get sorterButton(): ButtonAtom {
        const buttonContainer = this.getLocator().locator(
            ".nui-sorter__toggle-button"
        );
        return Atom.findIn<ButtonAtom>(ButtonAtom, buttonContainer, true);
    }

    /** Get the label element locator. */
    public get label(): Locator {
        return this.getLocator().locator(".nui-sorter__label");
    }

    /** Get the display-value element locator. */
    public get displayValue(): Locator {
        return this.getLocator().locator(".nui-sorter__display-value");
    }

    // --- Retryable assertions (preferred over boolean checks) ---

    /** Assert the popup is visible. */
    public async toBeExpanded(): Promise<void> {
        await this.overlay.toBeOpened();
    }

    /** Assert the popup is hidden. */
    public async toBeCollapsed(): Promise<void> {
        await expect(
            this.overlay.cdkContainerPane
        ).toBeHidden();
    }

    /** Assert the current display value text. */
    public async toHaveValue(expected: string | RegExp): Promise<void> {
        await expect(this.displayValue).toHaveText(expected);
    }

    /** Assert the label text. */
    public async toHaveLabel(expected: string | RegExp): Promise<void> {
        await expect(this.label).toHaveText(expected);
    }

    /** Assert the number of items in the dropdown. */
    public async toHaveItemCount(count: number): Promise<void> {
        await expect(this.items).toHaveCount(count);
    }

    // --- Private helpers ---

    private get toggleElement(): Locator {
        return this.getLocator().locator(".nui-selector__toggle");
    }
}
