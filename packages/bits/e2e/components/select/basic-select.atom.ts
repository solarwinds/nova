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

import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { MenuItemAtom } from "../menu/menu-item.atom";
import { MenuAtom } from "../menu/menu.atom";

export class BasicSelectAtom extends Atom {
    public async toggleMenu(): Promise<void> {
        await this.getMenu().toggleMenu();
    }

    public get input(): Locator {
        return this.getLocator().locator("input");
    }
    /**
     * Toggle select and select a new item from the options.
     */
    public async select(title: string): Promise<void> {
        await this.toggleMenu();
        await this.getMenu().getMenuItemByContainingText(title).clickItem();
    }

    public getSelectedItem(): Locator {
        return this.getLocator().locator(".item-selected");
    }

    public getSelectedItems(): Locator {
        return this.getLocator().locator(".item-selected");
    }

    public async elementHasClass(
        selector: string,
        className: string
    ): Promise<boolean> {
        const element = this.getElementByClass(selector);
        const classList = await element.getAttribute("class");
        return classList?.includes(className) ?? false;
    }

    public async getItemsCount(): Promise<number> {
        return this.getMenu().itemCount();
    }

    public async getItemText(idx: number): Promise<string> {
        return this.getMenuItem(idx).getTitle();
    }

    public getMenu(): MenuAtom {
        return Atom.findIn<MenuAtom>(MenuAtom, this.getLocator());
    }

    public getElementByClass(className: string): Locator {
        return this.getLocator().locator(`.${className}`);
    }

    protected getElementByTagName(tagName: string): Locator {
        return this.getLocator().locator(tagName);
    }

    protected getElementByCss(selector: string): Locator {
        return this.getLocator().locator(selector);
    }

    protected getElementsByCss(selector: string): Locator {
        return this.getLocator().locator(selector);
    }

    private getMenuItem(idx: number): MenuItemAtom {
        return this.getMenu().getMenuItemByIndex(idx);
    }
}
