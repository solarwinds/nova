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

export class MenuPopupAtom extends Atom {
    public static CSS_CLASS = "nui-menu-popup";

    public click = async (idx: number): Promise<void> =>
        this.getItemByIndex(idx).click();

    public getItemByIndex = (idx: number): Locator => this.getItems.nth(idx);

    public get getItems(): Locator {
        return super.getLocator().locator(".nui-menu-item");
    }

    public get getSelectedItems(): Locator {
        return super.getLocator().locator(".nui-menu-item--selected");
    }

    public get getSelectedItem(): Locator {
        return super.getLocator().locator(".nui-menu-item--selected").first();
    }

    public async clickItemByText(title: string): Promise<void> {
        const items = this.getItems;
        if ((await items.count()) === 0) {
            return;
        }
        await items.filter({hasText: title}).click();
    }
    public itemByText(title: string): Locator {
        const items = this.getItems;
        return items.filter({hasText: title});
    }
}
