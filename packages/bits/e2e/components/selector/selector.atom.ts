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

import { Atom, IAtomClass } from "../../atom";
import { Helpers } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import { PopupAtom } from "../popup/popup.atom";

export enum SelectionType {
    All = "Select all items on this page",
    UnselectAll = "Unselect all items on this page",
    None = "Unselect all items",
    AllPages = "Select all items on all pages",
}

export class SelectorAtom extends Atom {
    public static CSS_CLASS = "nui-selector";

    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator,
        root = true
    ): T {
        return Atom.findIn(atomClass, parentLocator, root);
    }

    public get getPopupAtom(): PopupAtom {
        return Atom.findIn<PopupAtom>(PopupAtom, this.getLocator());
    }

    public async select(selectionType: SelectionType): Promise<void> {
        if (!((await this.getPopupAtom.getPopupBox.count()) > 0)) {
            await this.getToggle.click();
        }
        await this.itemByText(selectionType).isVisible();
        // https://playwright.dev/docs/actionability#receives-events
        await this.itemByText(selectionType).click({force: true});
    }

    public async selectAppendedToBodyItem(
        selectionType: SelectionType
    ): Promise<void> {
        if (!((await this.getPopupAtom.getPopupBoxDetached.count()) > 0)) {
            await this.getToggle.click();
        }
        await this.appendedToBodyItemByText(selectionType).isVisible();
        // https://playwright.dev/docs/actionability#receives-events
        await this.appendedToBodyItemByText(selectionType).click({force: true});
    }

    public get getCheckbox(): CheckboxAtom {
        return Atom.findIn<CheckboxAtom>(CheckboxAtom, this.getLocator());
    }

    public get getSelectorButton(): ButtonAtom {
        const buttonContainer = super
            .getLocator()
            .locator(".nui-selector__checkbox-button");
        return Atom.findIn<ButtonAtom>(ButtonAtom, buttonContainer, true);
    }

    public itemByText(title: string): Locator {
        return Atom.findIn<MenuPopupAtom>(
            MenuPopupAtom,
            this.getLocator()
        ).itemByText(title);
    }

    public appendedToBodyItemByText(title: string): Locator {
        return Atom.findIn<MenuPopupAtom>(
            MenuPopupAtom,
            Helpers.page.locator("body .nui-overlay")
        ).itemByText(title);
    }

    private get getToggle(): Locator {
        return this.getLocator().locator(".nui-selector__toggle");
    }

    private async isOpened(): Promise<void> {
        await this.getPopupAtom.isOpened();
    }
}
