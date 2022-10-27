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

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { PaginatorAtom } from "../public_api";

describe("USERCONTROL paginator", () => {
    let basicPaginator: PaginatorAtom;
    let adjacentPaginator: PaginatorAtom;
    const adjacent = 2;
    const itemCount = 1012;
    const expectedItemsPerPage = "25";
    const pageTwenty = 20;

    const getDisplayingText = (
        itemsPerPage: number,
        page: number,
        totalItems: number
    ): string => {
        const endItem = Math.min(itemsPerPage * page, totalItems);
        const startItem = itemsPerPage * (page - 1) + 1;
        return `${startItem}-${endItem} of ${totalItems}`;
    };

    beforeAll(async () => {
        await Helpers.prepareBrowser("paginator/paginator-test");
        basicPaginator = Atom.find(PaginatorAtom, "nui-demo-basic-paginator");
        adjacentPaginator = Atom.find(
            PaginatorAtom,
            "nui-demo-adjacent-paginator"
        );
    });

    it("should be " + itemCount + " items in paginator component", async () => {
        expect(await basicPaginator.getStatusText()).toContain(
            itemCount.toString()
        );
    });

    it("should correctly report items per page", async () => {
        expect(await basicPaginator.getItemsRange()).toBe(expectedItemsPerPage);
    });

    it("should activate the page clicked", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.isActivePage(3)).toBe(false);
        await basicPaginator.pageLinkClick(3);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(3)).toBe(true);
        await basicPaginator.pageLinkClick(4);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(3)).toBe(false);
        expect(await basicPaginator.isActivePage(4)).toBe(true);
        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.isActivePage(1)).toBe(true);
    });

    it("should honor 'Items per Page'", async () => {
        await basicPaginator.setItemsPerPage(10);
        expect(await basicPaginator.pageCount()).toEqual(102);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(10, 1, itemCount)
        );

        await basicPaginator.popup.open();
        await basicPaginator.pageLinkClick(5);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(10, 5, itemCount)
        );

        await basicPaginator.popup.open();
        await basicPaginator.pageLinkClick(6);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(10, 6, itemCount)
        );

        await basicPaginator.setItemsPerPage(25);
        expect(await basicPaginator.pageCount()).toEqual(41);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(25, 1, itemCount)
        );

        await basicPaginator.popup.open();
        await basicPaginator.pageLinkClick(5);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(25, 5, itemCount)
        );

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(25, 1, itemCount)
        );
    });

    it("should display ellipsed page links on ellipsis click", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(false);
        await basicPaginator.ellipsisLinkClick(0);
        await basicPaginator.ellipsedPageLinkClick(pageTwenty);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(true);

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.activePage()).toBe(1);
    });

    it("should display 2 ellipsis links when active page is not an endpoint link", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(1)).toBe(false);
        await basicPaginator.ellipsisLinkClick(0);
        await basicPaginator.ellipsedPageLinkClick(pageTwenty);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(1)).toBe(true);

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.activePage()).toBe(1);
    });

    it(
        "should display 'adjacent' page links on each side of the active page, " +
            "when the active page is not an endpoint link in adjacent paginator",
        async () => {
            const pageCountAdjacent = await adjacentPaginator.pageCount();

            expect(await adjacentPaginator.activePage()).toEqual(10);
            await adjacentPaginator.ellipsisLink(1).click();
            await adjacentPaginator.ellipsedPageLinkClick(pageTwenty);

            expect(await adjacentPaginator.isActivePage(pageTwenty)).toBe(true);
            expect(await adjacentPaginator.pageLinkVisible(pageTwenty)).toBe(
                true
            );

            // left adjacent
            expect(
                await adjacentPaginator.pageLinkVisible(pageTwenty - adjacent)
            ).toBe(true);
            expect(await adjacentPaginator.pageLinkVisible(1)).toBe(true);
            for (let i = pageTwenty - adjacent - 1; i > 1; --i) {
                expect(await adjacentPaginator.pageLinkVisible(i)).toBe(false);
            }
            // right adjacent
            expect(
                await adjacentPaginator.pageLinkVisible(pageTwenty + adjacent)
            ).toBe(true);
            expect(
                await adjacentPaginator.pageLinkVisible(pageCountAdjacent)
            ).toBe(true);
            for (
                let i = pageTwenty + adjacent + 1;
                i < pageCountAdjacent;
                ++i
            ) {
                expect(await adjacentPaginator.pageLinkVisible(i)).toBe(false);
            }

            // Return to initial state
            await adjacentPaginator.ellipsisLink(0).click();
            await adjacentPaginator.ellipsedPageLinkClick(10);
            expect(await adjacentPaginator.isActivePage(10)).toBe(true);
        }
    );

    it(`should click page number 15 from popup dialog and pages
        ${getDisplayingText(
            10,
            15,
            itemCount
        )} should be displayed`, async () => {
        await basicPaginator.setItemsPerPage(10);
        await basicPaginator.ellipsisLink(0).click();
        await basicPaginator.ellipsedPageLinkClick(15);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(10, 15, itemCount)
        );

        // Return to initial state
        await basicPaginator.setItemsPerPage(25);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(25, 1, itemCount)
        );
    });

    it("should set the correct page on prev/next click", async () => {
        await basicPaginator.setItemsPerPage(10);
        expect(await basicPaginator.activePage()).toEqual(1);
        await basicPaginator.nextLink().click();
        expect(await basicPaginator.activePage()).toEqual(2);
        await basicPaginator.nextLink().click();
        expect(await basicPaginator.activePage()).toEqual(3);

        await basicPaginator.prevLink().click();
        expect(await basicPaginator.activePage()).toEqual(2);
        await basicPaginator.prevLink().click();
        expect(await basicPaginator.activePage()).toEqual(1);

        // Return to initial state
        await basicPaginator.setItemsPerPage(25);
        expect(await basicPaginator.getStatusText()).toBe(
            getDisplayingText(25, 1, itemCount)
        );
    });
});
