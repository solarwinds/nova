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

import {
    browser,
    by,
    element,
    ElementArrayFinder,
    ElementFinder,
} from "protractor";

import { MenuItemAtom } from "./menu-item.atom";
import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { PopupAtom } from "../popup/popup.atom";

export class MenuAtom extends Atom {
    public static CSS_CLASS = "nui-menu";

    public static getAllMenuItems = (): ElementArrayFinder =>
        element.all(by.css(".nui-menu-item:not(.nui-menu-item--header"));

    public menuContentId: string;

    private getPopupBox = (): PopupAtom =>
        Atom.findIn(PopupAtom, this.getElement());

    public getMenuButton = (): ButtonAtom =>
        Atom.findIn(ButtonAtom, this.getElement());

    public getMenuButtonIconName = async (): Promise<string> =>
        await this.getMenuButton().getIcon().getName();

    public toggleMenu = async (): Promise<void> => this.getMenuButton().click();

    public getMenuItemByContainingText = (text: string): MenuItemAtom =>
        Atom.findIn(
            MenuItemAtom,
            this.getElementByCssContainingText(".nui-menu-item", text)
        );

    public itemCount = async (): Promise<number> =>
        this.getItemElements().count();

    public isMenuOpened = async (): Promise<boolean> =>
        this.getPopupBox().isOpened();

    public mouseDownOnMenuButton = async (): Promise<void> =>
        this.getMenuButton().mouseDown();

    public mouseUp = async (): Promise<void> =>
        browser.actions().mouseUp().perform();

    public getMenuItemByIndex = (idx: number): MenuItemAtom =>
        Atom.findIn(MenuItemAtom, this.getItemElements().get(idx));

    // DO NOT USE. The following method is broken and will be fixed in the scope of NUI-6105
    public getMenuItems = async (): Promise<MenuItemAtom[]> =>
        this.getItemElements().map<MenuItemAtom>(
            (elementFinder?: ElementFinder) => {
                if (!elementFinder) {
                    throw new Error("elementFinder is not defined");
                }
                return new MenuItemAtom(elementFinder);
            }
        );

    public getItemTextArray = async (): Promise<string[]> =>
        await this.getItemElements().map<string>(
            (elementFinder: ElementFinder | undefined) =>
                elementFinder?.getText()
        );

    public getHeaderTextArray = async (): Promise<string[]> =>
        await this.getHeaderElements().map<string>(
            (elementFinder: ElementFinder | undefined) =>
                elementFinder?.getText()
        );

    public clickHeaderByIndex = async (idx: number): Promise<void> => {
        const headers = this.getHeaderElements();
        await browser.wait(async () => headers.get(idx).isDisplayed());
        await headers.get(idx).click();
    };

    public clickDividerByIndex = async (idx: number): Promise<void> => {
        const dividers = this.getElement().all(by.className("nui-divider"));
        await browser.wait(async () => dividers.get(idx).isDisplayed());
        await dividers.get(idx).element(by.xpath("..")).click();
    };

    /**
     * Returns array of checked checkboxes
     * @returns {Promise<MenuItemAtom[]>}
     */
    public async getSelectedMenuCheckboxes(): Promise<MenuItemAtom[]> {
        const menuItems = this.getSelectedCheckboxElements();
        const menuItemsCount = await menuItems.count();
        const menuItemsSelected: MenuItemAtom[] = [];

        for (let i = 0; i < menuItemsCount; i++) {
            menuItemsSelected.push(new MenuItemAtom(menuItems.get(i)));
        }

        return menuItemsSelected;
    }

    /**
     * Returns array of checked switches
     * @returns {Promise<MenuItemAtom[]>}
     */
    public async getSelectedMenuSwitches(): Promise<MenuItemAtom[]> {
        const menuItems = this.getSelectedSwitchElements();
        const menuItemsCount = await menuItems.count();
        const menuItemsSelected: MenuItemAtom[] = [];

        for (let i = 0; i < menuItemsCount; i++) {
            menuItemsSelected.push(new MenuItemAtom(menuItems.get(i)));
        }

        return menuItemsSelected;
    }

    public getSelectedCheckboxesCount = async (): Promise<number> =>
        (await this.getSelectedMenuCheckboxes()).length;

    public getSelectedSwitchesCount = async (): Promise<number> =>
        (await this.getSelectedMenuSwitches()).length;

    public getAppendToBodyMenu = (): ElementFinder =>
        browser.element(by.id(this.menuContentId));

    public getAppendToBodyMenuDividers = (): ElementArrayFinder =>
        this.getAppendToBodyMenu().all(
            by.className("nui-menu-group-divider--container")
        );

    private getItemElements(): ElementArrayFinder {
        const parentElement = this.menuContentId
            ? this.getAppendToBodyMenu()
            : super.getElement();
        return parentElement.all(
            by.css(".nui-menu-item:not(.nui-menu-item--header)")
        );
    }

    private getHeaderElements = (): ElementArrayFinder =>
        super.getElement().all(by.css(".nui-menu-item--header"));

    private getSelectedCheckboxElements = (): ElementArrayFinder =>
        super.getElement().all(by.css(".nui-checkbox--checked"));

    private getSelectedSwitchElements = (): ElementArrayFinder =>
        super.getElement().all(by.css(".nui-switched"));

    private getElementByCssContainingText = (
        selector: string,
        text: string
    ): ElementFinder =>
        this.getElement().all(by.cssContainingText(selector, text)).first();
}
