import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { PaginatorAtom } from "../paginator/paginator.atom";
import { SelectAtom } from "../select/select.atom";

describe("Visual tests: Paginator", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicPaginator: PaginatorAtom;
    let adjacentPaginator: PaginatorAtom;
    let customPaginator: PaginatorAtom;
    let customStylingPaginator: PaginatorAtom;
    let selectBasicPaginator: SelectAtom;
    let selectCustomPaginator: SelectAtom;
    let dotsBasicButton: ButtonAtom;
    let dotsCustomStylingButton: ButtonAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("paginator/paginator-visual-test");
        basicPaginator = Atom.find(PaginatorAtom, "nui-visual-test-basic-paginator");
        adjacentPaginator = Atom.find(PaginatorAtom, "nui-visual-test-adjacent-paginator");
        customPaginator = Atom.find(PaginatorAtom, "nui-visual-test-custom-page-set-paginator");
        customStylingPaginator = Atom.find(PaginatorAtom, "nui-visual-test-paginator-styling");
        selectBasicPaginator = Atom.findIn(SelectAtom, basicPaginator.getElement());
        selectCustomPaginator = Atom.findIn(SelectAtom, customPaginator.getElement());
        dotsBasicButton = Atom.findIn(ButtonAtom, customPaginator.ellipsisLink(0));
        dotsCustomStylingButton = Atom.findIn(ButtonAtom, customStylingPaginator.ellipsisLink(1));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Paginator");
        await eyes.checkWindow("Default");

        await adjacentPaginator.ellipsisLink(0).click();
        await adjacentPaginator.ellipsedPageLinkClick(35);
        await selectBasicPaginator.toggleMenu();
        await dotsBasicButton.hover();
        await eyes.checkWindow("Menu is toggled and button is hovered");
        await selectBasicPaginator.toggleMenu();

        await selectCustomPaginator.toggleMenu();
        await dotsCustomStylingButton.hover();
        await eyes.checkWindow("Menu with custom pageSizeSet is toggled and button is hovered");
        await selectBasicPaginator.toggleMenu();

        await customStylingPaginator.ellipsisLink(1).click();
        await eyes.checkWindow("Paginator's ellipsis-pages are shown");
        await selectBasicPaginator.toggleMenu();

        await eyes.close();
    }, 100000);
});
