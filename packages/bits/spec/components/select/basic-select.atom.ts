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
import { MenuItemAtom } from "../menu/menu-item.atom";
import { MenuAtom } from "../menu/menu.atom";

export class BasicSelectAtom extends Atom {
    public toggleMenu = async (): Promise<void> => this.getMenu().toggleMenu();

    /**
     * Toggle select and select a new item from the options.
     */
    public select = async (title: string): Promise<void> => {
        // Have to click (toggle the repeat) first because you can't interact with hidden elements
        await this.toggleMenu();
        await this.getMenu().getMenuItemByContainingText(title).clickItem();
    };

    public getSelectedItem = (): ElementFinder =>
        this.getElement().element(by.className("item-selected"));

    public getSelectedItems = (): ElementArrayFinder =>
        this.getElement().all(by.css(".item-selected"));

    public elementHasClass = async (
        selector: string,
        className: string
    ): Promise<boolean> => {
        const elementClassList = await this.getElementByClass(
            selector
        ).getAttribute("class");
        return elementClassList.includes(className);
    };

    public getItemsCount = async (): Promise<number> =>
        this.getMenu().itemCount();

    public getItemText = async (idx: number): Promise<string> =>
        this.getMenuItem(idx).getTitle();

    public getMenu = (): MenuAtom => Atom.findIn(MenuAtom, this.getElement());

    public getElementByClass = (className: string): ElementFinder =>
        this.getElement().element(by.className(className));

    protected getElementByTagName = (tagName: string): ElementFinder =>
        this.getElement().element(by.tagName(tagName));

    protected getElementByCss = (selector: string): ElementFinder =>
        this.getElement().element(by.css(selector));

    protected getElementsByCss = (selector: string): ElementArrayFinder =>
        this.getElement().all(by.css(selector));

    private getMenuItem = (idx: number): MenuItemAtom =>
        this.getMenu().getMenuItemByIndex(idx);
}
