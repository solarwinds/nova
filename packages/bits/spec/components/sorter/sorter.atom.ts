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

import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { MenuPopupAtom } from "../menu-popup/menu-popup.atom";
import { OverlayAtom } from "../overlay/overlay.atom";

export class SorterAtom extends Atom {
    public static CSS_CLASS = "nui-sorter";

    public menuPopup: MenuPopupAtom = Atom.findIn(
        MenuPopupAtom,
        this.getElement().element(by.className("nui-menu-popup"))
    );
    public click = async (): Promise<void> => this.getToggleElement().click();

    /**
     * Toggle sorter and select a new item from the options.
     */
    public async select(title: string): Promise<void> {
        // Have to click (toggle the repeat) first because
        // you can't interact with hidden elements.
        await this.click();
        return this.getItemByText(title);
    }

    public getItemByIndex = (index: number): ElementFinder =>
        this.getItems().get(index);

    public getNumberOfItems = async (): Promise<number> =>
        this.getItems().count();

    public async getItemText(idx: number): Promise<string> {
        const item = this.getItemByIndex(idx);
        return item
            .getAttribute("innerText")
            .then((text: string) => text.trim());
    }

    public getItemByText = async (title: string): Promise<void> =>
        this.menuPopup.clickItemByText(title);

    public async getCaptionText(): Promise<string> {
        const item = this.getLabelElement();
        return item.getAttribute("innerText");
    }

    /**
     * To manipulate with sorter button.
     */
    public getSorterButton(): ButtonAtom {
        return Atom.findIn(
            ButtonAtom,
            this.getElement().element(by.className("nui-sorter__toggle-button"))
        );
    }

    /**
     * @returns {string} The value displayed in sorter.
     */
    public getCurrentValue = async (): Promise<string> =>
        await this.getMainTitleElement().getText();

    public getLabelElement(): ElementFinder {
        return super.getElement().element(by.className("nui-sorter__label"));
    }

    public getItems = (): ElementArrayFinder => this.menuPopup.getItems();

    public getSelectedItems = (): ElementArrayFinder =>
        this.menuPopup.getSelectedItems();

    public isPopupDisplayed = async () =>
        Atom.findIn(OverlayAtom, this.getElement()).isOpened();

    // private helpers
    private getToggleElement(): ElementFinder {
        return super.getElement().element(by.className("nui-selector__toggle"));
    }

    private getMainTitleElement(): ElementFinder {
        return super
            .getElement()
            .element(by.className("nui-sorter__display-value"));
    }
}
