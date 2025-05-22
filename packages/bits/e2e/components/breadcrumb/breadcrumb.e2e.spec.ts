
import { BreadcrumbAtom } from "./breadcrumb.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

test.describe("USERCONTROL Breadcrumb >", () => {
    let breadcrumb: BreadcrumbAtom;
    let showCountriesButton: ButtonAtom;
    let showFirstCountryButton: ButtonAtom;

    test.beforeEach(async ({page}) => {
        await Helpers.prepareBrowser("breadcrumb", page);
        breadcrumb = Atom.find<BreadcrumbAtom>(BreadcrumbAtom, "nui-demo-breadcrumb-basic");
        showCountriesButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-breadcrumb-show-countries",
            true
        );
        showFirstCountryButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-breadcrumb-show-first-country",
            true
        );
    });

    test("shouldn't show anything when in root", async () => {
        await expect(breadcrumb.getAllItems()).toHaveCount(0);
    });

    test("should show 2 items", async () => {
        await showCountriesButton.click();
        await expect(breadcrumb.getAllItems()).toHaveCount(2);
    });

    test("first item should be link", async () => {
        await showCountriesButton.click();
        const link = breadcrumb.getLink(breadcrumb.getAllItems().first());
        await expect(link).toHaveJSProperty("tagName", "A");
    });

    test("last item should not be link", async () => {
        await showCountriesButton.click();
        const lastItem = breadcrumb.getAllItems().last();
        await expect(lastItem).toHaveJSProperty("tagName", "SPAN");
    });

    test("route should be changed when breadcrumb is clicked", async () => {
        await showCountriesButton.click();
        expect(breadcrumb.getUrlState()).toEqual("/breadcrumb/countries");
        await showFirstCountryButton.click();
        expect( breadcrumb.getUrlState()).toEqual(
            "/breadcrumb/countries/usa"
        );
        const firstItem = breadcrumb.getLink(breadcrumb.getAllItems().first());
        await firstItem.click();
        expect(breadcrumb.getUrlState()).toBe("/breadcrumb");
    });

    test("should show 3 items", async () => {
        await showCountriesButton.click();
        await showFirstCountryButton.click();
        await expect(breadcrumb.getAllItems()).toHaveCount(3);
    });
});
