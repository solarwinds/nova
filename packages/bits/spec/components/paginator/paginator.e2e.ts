import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { PaginatorAtom } from "../public_api";

describe("USERCONTROL paginator", () => {
    let atom: PaginatorAtom;
    const adjacent = 1;
    const itemCount = 1012;
    const expectedItemsPerPage = "25";
    const pageTwenty = 20;

    beforeEach(async () => {
        atom = Atom.find(PaginatorAtom, "nui-demo-basic-paginator");
        await Helpers.prepareBrowser("paginator");
    });

    const getDisplayingText = (itemsPerPage: number, page: number, totalItems: number): string => {
        const endItem = Math.min(itemsPerPage * page, totalItems);
        const startItem = itemsPerPage * (page - 1) + 1;
        return `${startItem}-${endItem} of ${totalItems}`;
    };

    it("should be " + itemCount + " items in paginator component", async () => {
        expect(await atom.getStatusText()).toContain(itemCount.toString());
    });

    it("should correctly report items per page", async () => {
        expect(await atom.getItemsRange()).toBe(expectedItemsPerPage);
    });

    it("should display first page by default", async () => {
        expect(await atom.activePage()).toEqual(1);
    });

    it("should activate the page clicked", async () => {
        expect(await atom.activePage()).toBe(1);
        expect(await atom.isActivePage(3)).toBe(false);
        await atom.pageLinkClick(3);
        expect(await atom.isActivePage(1)).toBe(false);
        expect(await atom.isActivePage(3)).toBe(true);
        await atom.pageLinkClick(4);
        expect(await atom.isActivePage(1)).toBe(false);
        expect(await atom.isActivePage(3)).toBe(false);
        expect(await atom.isActivePage(4)).toBe(true);
    });

    it("should honor 'Items per Page'", async () => {
        await atom.setItemsPerPage(10);
        expect(await atom.pageCount()).toEqual(102);
        expect(await atom.getStatusText()).toBe(getDisplayingText(10, 1, itemCount));

        await atom.popup.open();
        await atom.pageLinkClick(5);
        expect(await atom.getStatusText()).toBe(getDisplayingText(10, 5, itemCount));

        await atom.popup.open();
        await atom.pageLinkClick(6);
        expect(await atom.getStatusText()).toBe(getDisplayingText(10, 6, itemCount));

        await atom.setItemsPerPage(25);
        expect(await atom.pageCount()).toEqual(41);
        expect(await atom.getStatusText()).toBe(getDisplayingText(25, 1, itemCount));

        await atom.popup.open();
        await atom.pageLinkClick(5);
        expect(await atom.getStatusText()).toBe(getDisplayingText(25, 5, itemCount));
    });

    it("should display ellipsed page links on ellipsis click", async () => {
        expect(await atom.activePage()).toBe(1);
        expect(await atom.isActivePage(pageTwenty)).toBe(false);
        await atom.ellipsisLinkClick(0);
        await atom.ellipsedPageLinkClick(pageTwenty);
        expect(await atom.isActivePage(1)).toBe(false);
        expect(await atom.isActivePage(pageTwenty)).toBe(true);
    });

    it("should display 2 ellipsis links when active page is not an endpoint link", async () => {
        expect(await atom.activePage()).toBe(1);
        expect(await atom.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await atom.ellipsisLinkDisplayed(1)).toBe(false);
        await atom.ellipsisLinkClick(0);
        await atom.ellipsedPageLinkClick(pageTwenty);
        expect(await atom.isActivePage(pageTwenty)).toBe(true);
        expect(await atom.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await atom.ellipsisLinkDisplayed(1)).toBe(true);
    });

    it("should display 'adjacent' page links on each side of the active page, " +
        "when the active page is not an endpoint link", async () => {

        expect(await atom.activePage()).toEqual(1);
        await atom.ellipsisLink(0).click();
        await atom.ellipsedPageLinkClick(pageTwenty);

        expect(await atom.isActivePage(pageTwenty)).toBe(true);
        expect(await atom.pageLinkVisible(pageTwenty)).toBe(true);

        // left adjacent
        expect(await atom.pageLinkVisible(pageTwenty - adjacent - 1)).toBe(false);
        for (let i = pageTwenty - adjacent; i < adjacent; ++i) {
            expect(await atom.pageLinkVisible(i)).toBe(true);
        }
        // right adjacent
        expect(await atom.pageLinkVisible(pageTwenty + adjacent + 1)).toBe(false);
        for (let i = pageTwenty + 1; i <= pageTwenty + adjacent; ++i) {
            expect(await atom.pageLinkVisible(i)).toBe(true);
        }
    });

    it(`should click page number 15 from popup dialog and pages
        ${getDisplayingText(10, 15, itemCount)} should be displayed`, async () => {
        await atom.setItemsPerPage(10);
        await atom.ellipsisLink(0).click();
        await atom.ellipsedPageLinkClick(15);
        expect(await atom.getStatusText()).toBe(getDisplayingText(10, 15, itemCount));
    });

    it("should honor 'show-prev-next' and provide default", async () => {
        expect(await atom.arePrevNextLinksDisplayed()).toBe(true);

        const atom2 = Atom.findIn(PaginatorAtom, element(by.id("nui-demo-hide-prev-next")));
        expect(await atom2.arePrevNextLinksDisplayed()).toBe(false);
    });

    it("should set the correct page on prev/next click", async () => {
        await atom.setItemsPerPage(10);
        expect(await atom.activePage()).toEqual(1);
        await atom.nextLink().click();
        expect(await atom.activePage()).toEqual(2);
        await atom.nextLink().click();
        expect(await atom.activePage()).toEqual(3);

        await atom.prevLink().click();
        expect(await atom.activePage()).toEqual(2);
        await atom.prevLink().click();
        expect(await atom.activePage()).toEqual(1);
    });

    it("should honor 'dots' and provide default", async () => {
        expect(await atom.ellipsisLink(0).getText()).toBe("...");
        const atom1 = Atom.find(PaginatorAtom, "nui-demo-paginator-styling");
        expect(await atom1.ellipsisLink(0).getText()).toBe("°°°");
    });
});
