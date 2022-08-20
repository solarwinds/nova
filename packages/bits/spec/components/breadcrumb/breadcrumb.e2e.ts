import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";

import { BreadcrumbAtom } from "./breadcrumb.atom";

describe("USERCONTROL Breadcrumb", () => {
    let breadcrumb: BreadcrumbAtom;
    let showCountriesButton: ButtonAtom;
    let showFirstCountryButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("breadcrumb");
        breadcrumb = Atom.find(BreadcrumbAtom, "nui-demo-breadcrumb-basic");
        showCountriesButton = Atom.find(
            ButtonAtom,
            "nui-demo-breadcrumb-show-countries"
        );
        showFirstCountryButton = Atom.find(
            ButtonAtom,
            "nui-demo-breadcrumb-show-first-country"
        );
    });

    it("shouldn't show anything when in root", async () => {
        expect(await breadcrumb.getItemsCount()).toBe(0);
    });

    it("should show 2 items", async () => {
        await showCountriesButton.click();
        expect(await breadcrumb.getItemsCount()).toBe(2);
    });

    it("first item should be link", async () => {
        await showCountriesButton.click();
        const link = breadcrumb.getLink(breadcrumb.getFirstItem());
        expect(await link.getTagName()).toBe("a");
    });

    it("last item should not be link", async () => {
        await showCountriesButton.click();
        const lastItem = breadcrumb.getLastItem();
        expect(await lastItem.getTagName()).toBe("span");
    });

    it("route should be changed when breadcrumb is clicked", async () => {
        await showCountriesButton.click();
        expect(await breadcrumb.getUrlState()).toEqual("/breadcrumb/countries");
        await showFirstCountryButton.click();
        expect(await breadcrumb.getUrlState()).toEqual(
            "/breadcrumb/countries/usa"
        );
        const firstItem = breadcrumb.getLink(breadcrumb.getFirstItem());
        await firstItem.click();
        expect(await breadcrumb.getUrlState()).toBe("/breadcrumb");
    });

    it("should show 3 items", async () => {
        await showCountriesButton.click();
        await showFirstCountryButton.click();
        expect(await breadcrumb.getItemsCount()).toBe(3);
    });
});
