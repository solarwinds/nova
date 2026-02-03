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

import { browser, by, ElementFinder, ExpectedConditions } from "protractor";

import { Atom } from "../atom";
import { ButtonAtom } from "./button.atom";
import { CheckboxAtom } from "./checkbox.atom";
import { MenuPopupAtom } from "./menu-popup.atom";
import { PopupAtom } from "./popup.atom";

export enum SelectionType {
    All = "Select all items on this page",
    UnselectAll = "Unselect all items on this page",
    None = "Unselect all items",
    AllPages = "Select all items on all pages",
}

export class SelectorAtom extends Atom {
    public static CSS_CLASS = "nui-selector";

    public getPopupAtom(): PopupAtom {
        return Atom.findIn(PopupAtom, this.getElement());
    }

    public async select(selectionType: SelectionType): Promise<void> {
        if (!(await this.isOpened())) {
            await this.getToggle().click();
        }
        await this.clickItemByText(selectionType);
    }

    public async selectAppendedToBodyItem(
        selectionType: SelectionType
    ): Promise<void> {
        if (!(await this.getPopupAtom().isOpenedAppendToBody())) {
            await this.getToggle().click();
        }
        const menuPopup = Atom.findIn(
            MenuPopupAtom,
            this.getElement().element(by.className("nui-menu-popup"))
        );
        await browser.wait(
            ExpectedConditions.stalenessOf(menuPopup.getElement()),
            3000 // this is mostly for table. 1000ms may be not enough
        );
        await this.clickAppendedToBodyItemByText(selectionType);
    }

    public getCheckbox(): CheckboxAtom {
        return Atom.findIn(CheckboxAtom, this.getElement());
    }

    public getSelectorButton(): ButtonAtom {
        const buttonContainer = super
            .getElement()
            .element(by.className("nui-selector__checkbox-button"));
        return Atom.findIn(ButtonAtom, buttonContainer);
    }

    public async clickItemByText(title: string): Promise<void> {
        await Atom.findIn(
            MenuPopupAtom,
            this.getElement().element(by.className("nui-menu-popup"))
        ).clickItemByText(title);
    }

    public async clickAppendedToBodyItemByText(title: string): Promise<void> {
        await Atom.findIn(
            MenuPopupAtom,
            browser.element(by.css("body .nui-overlay .nui-menu-popup"))
        ).clickItemByText(title);
    }

    private getToggle(): ElementFinder {
        return this.getElement().element(by.css(".nui-selector__toggle"));
    }

    private async isOpened(): Promise<boolean> {
        return this.getPopupAtom().isOpened();
    }
}
