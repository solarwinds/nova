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

export class MenuPopupAtom extends Atom {
    public static CSS_CLASS = "nui-menu-popup";

    public click = async (idx: number): Promise<void> =>
        this.getItemByIndex(idx).click();

    public getItemByIndex = (idx: number): ElementFinder =>
        this.getItems().get(idx);

    public getItems(): ElementArrayFinder {
        return super.getElement().all(by.className("nui-menu-item"));
    }

    public getSelectedItems(): ElementArrayFinder {
        return super.getElement().all(by.className("nui-menu-item--selected"));
    }

    public getSelectedItem(): ElementFinder {
        return super
            .getElement()
            .element(by.className("nui-menu-item--selected"));
    }

    public async clickItemByText(title: string): Promise<void> {
        const allItems: any = await this.getItems().getText();
        const itemIndex: number = allItems.findIndex(
            (itemText: string) => itemText === title
        );
        return this.click(itemIndex);
    }
}
