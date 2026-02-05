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
import { OverlayAtom } from "../overlay/overlay.atom";
import { SelectV2Atom } from "../select-v2/select-v2.atom";

export class PaginatorAtom extends Atom {
    public static CSS_CLASS = "nui-paginator";

    public get popup(): OverlayAtom {
        return Atom.findIn<OverlayAtom>(OverlayAtom);
    }

    public get select(): SelectV2Atom {
        return Atom.findIn<SelectV2Atom>(SelectV2Atom, this.getLocator());
    }

    public get total(): Locator {
        return this.getLocator().locator(".nui-paginator__total");
    }

    public get status(): Locator {
        return this.getLocator().locator(".nui-paginator__info");
    }

    public async setItemsPerPage(itemsPerPage: number): Promise<void> {
        await this.select.select(`${itemsPerPage}`);
    }

    public async getItemsRange(): Promise<string> {
        const statusText = await this.status.textContent();
        if (!statusText) {
            return "";
        }
        const match = statusText.match(/(\d+)-(\d+) of \d+/);
        if (!match) {
            return "";
        }
        const start = parseInt(match[1], 10);
        const end = parseInt(match[2], 10);
        return (end - start + 1).toString();
    }

    public async pageLinkClick(pageNumber: number): Promise<void> {
        const li = this.getLocator()
            .locator(".nui-paginator__list li")
            .nth(pageNumber);
        await li.click();
    }

    public async pageLinkVisible(pageNumber: number): Promise<boolean> {
        const li = this.getLocator().locator(
            `.nui-paginator__list li[value='${pageNumber}']:not([title*='Previous']):not([title*='Next']):not([title*='Pages'])`
        );
        return (await li.count()) > 0 && (await li.first().isVisible());
    }

    public async ellipsedPageLinkClick(pageNumber: number): Promise<void> {
        const page = this.getLocator()
            .locator(".nui-paginator__page-cell")
            .filter({ hasText: String(pageNumber) });
        await page.click();
    }

    public ellipsisLink(index: number): Locator {
        return this.getLocator().locator(".nui-paginator__dots").nth(index);
    }

    public async ellipsisLinkClick(index: number): Promise<void> {
        await this.ellipsisLink(index).click();
    }

    public async ellipsisLinkDisplayed(index: number): Promise<boolean> {
        const dots = this.getLocator().locator(".nui-paginator__dots");
        return (await dots.count()) > index;
    }

    public prevLink(): Locator {
        return this.getLocator().locator(".move-icon").first();
    }

    public nextLink(): Locator {
        return this.getLocator().locator(".move-icon").last();
    }

    public async arePrevNextLinksDisplayed(): Promise<boolean> {
        const icons = this.getLocator().locator(
            ".nui-paginator__list li .move-icon"
        );
        return (await icons.count()) === 2;
    }

    public async activePage(): Promise<number> {
        const activeLi = this.getLocator()
            .locator(".nui-paginator__list li.active")
            .first();
        const text = await activeLi.textContent();
        return text ? parseInt(text, 10) : -1;
    }

    public async isActivePage(page: number): Promise<boolean> {
        return (await this.activePage()) === page;
    }

    public async pageCount(): Promise<number> {
        const lis = this.getLocator().locator(".nui-paginator__list li");
        const count = await lis.count();
        let max = 0;
        for (let i = 0; i < count; i++) {
            const value = await lis.nth(i).getAttribute("value");
            if (value) {
                const num = parseInt(value, 10);
                if (num > max) {
                    max = num;
                }
            }
        }
        return max;
    }

    public async ellipsisHasTopClass(): Promise<boolean> {
        await this.ellipsisLinkClick(0);
        const dropdown = this.getLocator().locator(".nui-popup__area").first();
        const classList = await dropdown.getAttribute("class");
        return classList?.includes("nui-popup__area--top") ?? false;
    }

    public async itemsDispHasTopClass(): Promise<boolean> {
        const itemsShownElem = this.getLocator()
            .locator(".nui-paginator__items-shown")
            .first();
        await itemsShownElem.click();
        const dropdown = this.getLocator().locator(".nui-popup__area").first();
        const classList = await dropdown.getAttribute("class");
        return classList?.includes("nui-popup__area--top") ?? false;
    }

    public async getTotal(): Promise<number> {
        const totalText = await this.total.textContent();
        return totalText ? parseInt(totalText, 10) : 0;
    }

    public getPageNumberButton(pageNumber: string): Locator {
        return this.getLocator().locator(
            `button.nui-button:has-text('${pageNumber}')`
        );
    }
}
