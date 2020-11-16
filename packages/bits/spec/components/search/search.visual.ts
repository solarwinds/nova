import { browser, protractor } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { SearchAtom } from "./search.atom";

describe("Visual tests: Search", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicSearch: SearchAtom;
    let customPlaceholderSearch: SearchAtom;
    let searchWithInput: SearchAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("search/search-visual-test");
        basicSearch = Atom.find(SearchAtom, "nui-visual-test-basic-search" );
        customPlaceholderSearch = Atom.find(SearchAtom, "nui-visual-test-search-with-placeholder" );
        searchWithInput = Atom.find(SearchAtom, "nui-visual-test-search-with-input-text" );
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Search");
        await eyes.checkWindow("Default");

        await searchWithInput.getSearchButton().click();
        await browser.actions().sendKeys(protractor.Key.TAB).perform();
        await searchWithInput.getSearchButton().hover();
        await eyes.checkWindow("Search with input text is focused and Search button is hovered");

        await browser.actions().mouseMove({x: 50, y: 0}).perform();
        await browser.actions().click().perform();
        await searchWithInput.getCancelButton().hover();
        await eyes.checkWindow("Cancel button in Search with input text is hovered");

        await eyes.close();
    }, 100000);
});
