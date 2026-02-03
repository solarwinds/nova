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

import { Locator, Page } from "@playwright/test";

import { MenuItemAtom } from "./menu-item.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { PopupAtom } from "../popup/popup.atom";

export class MenuAtom extends Atom {
    public static CSS_CLASS = "nui-menu";
    public menuContentId?: string;

    // Returns all menu items (excluding headers)
    public getAllMenuItems(): Locator {
        return this.getLocator().locator(
            ".nui-menu-item:not(.nui-menu-item--header)"
        );
    }

    public getPopupBox(): PopupAtom {
        return Atom.findIn<PopupAtom>(PopupAtom, this.getLocator());
    }

    public getMenuButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(ButtonAtom, this.getLocator());
    }

    public async getMenuButtonIconName(): Promise<string | null> {
        const button = this.getMenuButton();
        const icon = button.getIcon();
        return icon.getName();
    }

    public async toggleMenu(): Promise<void> {
        await this.getMenuButton().click();
    }

    public getMenuItemByContainingText(text: string): MenuItemAtom {
        const itemLocator = this.getLocator().locator(".nui-menu-item", {
            hasText: text,
        });
        return Atom.findIn<MenuItemAtom>(MenuItemAtom, itemLocator, true);
    }

    public async itemCount(): Promise<number> {
        return await this.getAllMenuItems().count();
    }

    public async isMenuOpened(): Promise<void> {
        return await this.getPopupBox().isOpened();
    }
    public async isMenuClosed(): Promise<void> {
        return await this.getPopupBox().isNotOpened();
    }

    public async mouseDownOnMenuButton(): Promise<void> {
        await this.getMenuButton().getLocator().dispatchEvent("mousedown");
    }

    public async mouseUp(): Promise<void> {
        await Helpers.page.mouse.up();
    }

    public getMenuItemByIndex(idx: number): MenuItemAtom {
        const itemLocator = this.getAllMenuItems().nth(idx);
        return Atom.findIn<MenuItemAtom>(MenuItemAtom, itemLocator);
    }

    public async getMenuItems(): Promise<MenuItemAtom[]> {
        const count = await this.getAllMenuItems().count();
        const items: MenuItemAtom[] = [];
        for (let i = 0; i < count; i++) {
            items.push(this.getMenuItemByIndex(i));
        }
        return items;
    }

    public async getItemTextArray(): Promise<string[]> {
        const items = this.getAllMenuItems();
        const count = await items.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            texts.push(await items.nth(i).innerText());
        }
        return texts;
    }

    public getHeaderElements(): Locator {
        return this.getLocator().locator(".nui-menu-item--header");
    }

    public async getHeaderTextArray(): Promise<string[]> {
        const headers = this.getHeaderElements();
        const count = await headers.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            texts.push(await headers.nth(i).innerText());
        }
        return texts;
    }

    public async clickHeaderByIndex(idx: number): Promise<void> {
        const headers = this.getHeaderElements();
        await headers.nth(idx).click();
    }

    public getDividerElements(): Locator {
        return this.getLocator().locator(".nui-divider");
    }

    public async clickDividerByIndex(idx: number): Promise<void> {
        const dividers = this.getDividerElements();
        await dividers.nth(idx).click();
    }

    public getSelectedCheckboxElements(): Locator {
        return this.getLocator().locator(".nui-checkbox--checked");
    }

    public async getSelectedMenuCheckboxes(): Promise<MenuItemAtom[]> {
        const items = this.getSelectedCheckboxElements();
        const count = await items.count();
        const selected: MenuItemAtom[] = [];
        for (let i = 0; i < count; i++) {
            selected.push(
                Atom.findIn<MenuItemAtom>(MenuItemAtom, items.nth(i))
            );
        }
        return selected;
    }

    public getSelectedSwitchElements(): Locator {
        return this.getLocator().locator(".nui-switched");
    }

    public async getSelectedMenuSwitches(): Promise<MenuItemAtom[]> {
        const items = this.getSelectedSwitchElements();
        const count = await items.count();
        const selected: MenuItemAtom[] = [];
        for (let i = 0; i < count; i++) {
            selected.push(
                Atom.findIn<MenuItemAtom>(MenuItemAtom, items.nth(i))
            );
        }
        return selected;
    }

    public async getSelectedCheckboxesCount(): Promise<number> {
        return (await this.getSelectedMenuCheckboxes()).length;
    }

    public async getSelectedSwitchesCount(): Promise<number> {
        return (await this.getSelectedMenuSwitches()).length;
    }

    public getAppendToBodyMenu(): Locator {
        if (!this.menuContentId) {
            throw new Error("menuContentId is not set");
        }
        return Helpers.page.locator(`#${this.menuContentId}`);
    }

    public getAppendToBodyMenuDividers(): Locator {
        return this.getAppendToBodyMenu().locator(
            ".nui-menu-group-divider--container"
        );
    }
}
