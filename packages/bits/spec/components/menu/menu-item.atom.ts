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

import { by } from "protractor";

import { Atom } from "../../atom";

const MENU_ACTION_SELECTOR = "nui-menu-item__action";
const MENU_LINK_SELECTOR = "nui-menu-item__link";
const MENU_OPTION_SELECTOR = "nui-menu-item__option";
const MENU_SWITCH_SELECTOR = "nui-menu-item__switch";
const MENU_ITEM_DISABLED = "nui-menu-item--disabled";
const MENU_ITEM_HEADER = "nui-menu-item--header";
const MENU_ITEM_ACTIVE = "nui-menu-item--active";

export class MenuItemAtom extends Atom {
    public static CSS_CLASS = "nui-menu-item";

    public async getTitle(): Promise<string> {
        return super.getElement().getText();
    }

    public async clickItem(): Promise<void> {
        return super.getElement().click();
    }

    public async isDisabledItem(): Promise<boolean> {
        return Atom.hasClass(super.getElement(), MENU_ITEM_DISABLED);
    }

    public async isActiveItem(): Promise<boolean> {
        return Atom.hasClass(super.getElement(), MENU_ITEM_ACTIVE);
    }

    public async isHeaderItem(): Promise<boolean> {
        return Atom.hasClass(super.getElement(), MENU_ITEM_HEADER);
    }

    public async isActionItem(): Promise<boolean> {
        return super
            .getElement()
            .element(by.className(MENU_ACTION_SELECTOR))
            .isPresent();
    }

    public async isLinkItem(): Promise<boolean> {
        return super
            .getElement()
            .element(by.className(MENU_LINK_SELECTOR))
            .isPresent();
    }

    public async isOptionItem(): Promise<boolean> {
        return super
            .getElement()
            .element(by.className(MENU_OPTION_SELECTOR))
            .isPresent();
    }

    public async isSwitchItem(): Promise<boolean> {
        return super
            .getElement()
            .element(by.className(MENU_SWITCH_SELECTOR))
            .isPresent();
    }
}
