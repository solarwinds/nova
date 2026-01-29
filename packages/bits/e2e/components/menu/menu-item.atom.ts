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

const MENU_ACTION_SELECTOR = ".nui-menu-item__action";
const MENU_LINK_SELECTOR = ".nui-menu-item__link";
const MENU_OPTION_SELECTOR = ".nui-menu-item__option";
const MENU_SWITCH_SELECTOR = ".nui-menu-item__switch";
const MENU_ITEM_DISABLED = "nui-menu-item--disabled";
const MENU_ITEM_HEADER = "nui-menu-item--header";
const MENU_ITEM_ACTIVE = "nui-menu-item--active";

export class MenuItemAtom extends Atom {
    public static CSS_CLASS = "nui-menu-item";

    public async getTitle(): Promise<string> {
        return this.getLocator().innerText();
    }

    public async clickItem(): Promise<void> {
        await this.getLocator().click();
    }

    public async isDisabledItem(): Promise<boolean> {
        const classList = await this.getLocator().getAttribute("class");
        return classList?.includes(MENU_ITEM_DISABLED) ?? false;
    }

    public async isActiveItem(): Promise<boolean> {
        const classList = await this.getLocator().getAttribute("class");
        return classList?.includes(MENU_ITEM_ACTIVE) ?? false;
    }

    public async isHeaderItem(): Promise<boolean> {
        const classList = await this.getLocator().getAttribute("class");
        return classList?.includes(MENU_ITEM_HEADER) ?? false;
    }

    public async isActionItem(): Promise<boolean> {
        return (
            (await this.getLocator().locator(MENU_ACTION_SELECTOR).count()) > 0
        );
    }

    public async isLinkItem(): Promise<boolean> {
        return (
            (await this.getLocator().locator(MENU_LINK_SELECTOR).count()) > 0
        );
    }

    public async isOptionItem(): Promise<boolean> {
        return (
            (await this.getLocator().locator(MENU_OPTION_SELECTOR).count()) > 0
        );
    }

    public async isSwitchItem(): Promise<boolean> {
        return (
            (await this.getLocator().locator(MENU_SWITCH_SELECTOR).count()) > 0
        );
    }
}
