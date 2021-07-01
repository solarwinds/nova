import { browser, by, protractor } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, SearchAtom } from "../public_api";

describe("USERCONTROL search", () => {
    const expectedFocusedDelay = 2000;
    let searchField: SearchAtom;
    let searchBtnAtom: ButtonAtom;
    let cancelBtnAtom: ButtonAtom;
    let setFocusBtnAtom: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("search/search-test");
        searchField = Atom.find(SearchAtom, "nui-demo-search");
        searchBtnAtom = searchField.getSearchButton();
        cancelBtnAtom = searchField.getCancelButton();
        setFocusBtnAtom = Atom.find(ButtonAtom, "nui-demo-search-set-focus-btn");
    });

    // cleanup
    afterEach(async () => {
        // enable and deactivate the component if necessary
        // cancel any on-going search, then clear out the input
        if (await cancelBtnAtom.isIconShown()) { await cancelBtnAtom.click(); }
    });

    it("buttons should be disabled when 'disabled' prop is true", async () => {
        expect(await searchBtnAtom.isDisabled()).toBe(true);
        const input = "foo";
        await searchField.acceptInput(input);
        expect(await cancelBtnAtom.isDisabled()).toBe(false);
        expect(await searchBtnAtom.isDisabled()).toBe(false);
    });

    it("should search on enter key", async () => {
        await searchField.acceptInput("Lorem");
        await searchField.acceptInput(protractor.Key.ENTER);
        expect(await browser.element(by.cssContainingText(".nui-highlighted", "Lorem")).isPresent()).toBe(true);
    });

    it("should have focus depending on 'captureFocus' prop", async () => {
        await setFocusBtnAtom.click();
        expect(await searchField.isFocused()).toEqual(true);
        await browser.driver.switchTo().defaultContent();
        await browser.sleep(expectedFocusedDelay);
        expect(await searchField.isFocused()).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    });

    it("should get focus on cancel", async () => {
        const input = "foo";
        await searchField.acceptInput(input);
        await cancelBtnAtom.click();
        expect(await searchField.isFocused()).toEqual(true);
        await browser.driver.switchTo().defaultContent();
    });

    it("should lose focus on search", async () => {
        const input = "foo";
        await searchField.acceptInput(input);
        await searchBtnAtom.click();
        expect(await searchField.isFocused()).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    });
});
