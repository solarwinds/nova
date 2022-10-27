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

import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { PopupAtom } from "../popup/popup.atom";
import { SelectV2Atom } from "../select-v2/select-v2.atom";

export class PaginatorAtom extends Atom {
    public static CSS_CLASS = "nui-paginator";

    public popup = Atom.findIn(PopupAtom, this.getElement());

    private prevNextClass = "move-icon";
    private total: ElementFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.total = rootElement.element(by.className("nui-paginator__total"));
    }

    public async getStatusText(): Promise<string> {
        return super
            .getElement()
            .all(by.className("nui-paginator__info"))
            .get(0)
            .getText();
    }

    public async setItemsPerPage(itemsPerPage: number): Promise<void> {
        const selectV2Atom: SelectV2Atom = Atom.findIn(
            SelectV2Atom,
            super.getElement()
        );
        return selectV2Atom.select(itemsPerPage.toString());
    }

    public getItemsRange = async (): Promise<string> =>
        this.getStatusText().then((test) => {
            const pages = test.split(" ")[0].split("-");
            const start = parseInt(pages[0], 10);
            const end = parseInt(pages[1], 10);
            return (end - start + 1).toString();
        });

    public async pageLinkClick(pageNumber: number): Promise<void> {
        return super
            .getElement()
            .all(by.css(".nui-paginator__list li"))
            .get(pageNumber)
            .click();
    }

    public async pageLinkVisible(pageNumber: number): Promise<boolean> {
        return super
            .getElement()
            .all(by.css(".nui-paginator__list li[value='" + pageNumber + "']"))
            .then((elements: ElementFinder[]) => elements.length === 1);
    }

    public async ellipsedPageLinkClick(pageNumber: number): Promise<void> {
        const allIttems: any = await super
            .getElement()
            .all(by.className("nui-paginator__page-cell"))
            .getText();
        const index = allIttems.findIndex(
            (itemText: string) => itemText === pageNumber.toString()
        );
        return super
            .getElement()
            .all(by.className("nui-paginator__page-cell"))
            .get(index)
            .click();
    }

    public ellipsisLink(index: number): ElementFinder {
        return super
            .getElement()
            .all(by.className("nui-paginator__dots"))
            .get(index);
    }

    public ellipsisLinkClick = async (index: number): Promise<void> =>
        this.ellipsisLink(index).click();

    public async ellipsisLinkDisplayed(index: number): Promise<boolean> {
        return super
            .getElement()
            .all(by.className("nui-paginator__dots"))
            .count()
            .then((count: number) => count > index);
    }

    public prevLink(): ElementFinder {
        return super.getElement().all(by.className(this.prevNextClass)).get(0);
    }

    public nextLink(): ElementFinder {
        return super.getElement().all(by.className(this.prevNextClass)).get(1);
    }

    public async arePrevNextLinksDisplayed(): Promise<boolean> {
        return super
            .getElement()
            .all(by.css(".nui-paginator__list li .move-icon"))
            .then((elements: ElementFinder[]) => elements.length === 2);
    }

    public async activePage(): Promise<number> {
        return super
            .getElement()
            .all(by.css(".nui-paginator__list li.active"))
            .get(0)
            .getText()
            .then((text: string) => parseInt(text, 10));
    }

    public isActivePage = async (page: number): Promise<boolean> =>
        this.activePage().then((activePage: number) => activePage === page);

    public async pageCount(): Promise<number> {
        return super
            .getElement()
            .all(by.css(".nui-paginator__list li"))
            .getAttribute("value")
            .then(async (arrVal: any) => {
                const resultArr: number[] = await arrVal.map((value: string) =>
                    parseInt(value, 10)
                );
                return Math.max(...resultArr);
            });
    }

    public async ellipsisHasTopClass(): Promise<boolean> {
        await this.ellipsisLinkClick(0);
        const dropdownElement = super
            .getElement()
            .all(by.css(".nui-popup__area"))
            .get(0);

        return await Atom.hasClass(dropdownElement, "nui-popup__area--top");
    }

    public async itemsDispHasTopClass(): Promise<boolean> {
        const itemsShownElem = super
            .getElement()
            .all(by.css(".nui-paginator__items-shown"))
            .get(0);
        await itemsShownElem.click();

        const dropdownElement = super
            .getElement()
            .all(by.css(".nui-popup__area"))
            .get(0);
        return await Atom.hasClass(dropdownElement, "nui-popup__area--top");
    }

    public async getTotal(): Promise<number> {
        const totalText = await this.total.getText();

        return Number.parseInt(totalText, 10);
    }

    public getPageNumberButton(pageNumber: string): ElementFinder {
        return this.getElement().element(
            by.cssContainingText("button.nui-button", pageNumber)
        );
    }
}
