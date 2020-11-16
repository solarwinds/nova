import * as protractor from "protractor";
import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import {
    ButtonAtom,
    IconAtom,
    SearchAtom,
} from "../public_api";

describe("USERCONTROL search", () => {
    const expectedFocusedDelay = 2000;
    let atom: SearchAtom;
    let searchBtnAtom: ButtonAtom;
    let cancelBtnAtom: ButtonAtom;
    let setFocusBtnAtom: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("search/search-test");
        atom = Atom.find(SearchAtom, "nui-demo-search");
        searchBtnAtom = atom.getSearchButton();
        cancelBtnAtom = atom.getCancelButton();
        setFocusBtnAtom = Atom.find(ButtonAtom, "nui-demo-search-set-focus-btn");
    });

    // cleanup
    beforeEach(async () => {
        // enable and deactivate the component if necessary
        // cancel any on-going search, then clear out the input
        if (await cancelBtnAtom.isIconShown()) { await cancelBtnAtom.click(); }
        if (await cancelBtnAtom.isIconShown()) { await cancelBtnAtom.click(); }
    });

    it("should have search button shown", async () => {
        expect(await searchBtnAtom.isIconShown()).toBe(true);
        const iconAtom: IconAtom | undefined = await searchBtnAtom.getIcon();
        expect(await iconAtom?.getName()).toBe("search");
    });

    it("should not have cancel button displayed if input field is empty", async () => {
        expect(await cancelBtnAtom.isIconShown()).toBe(false);
    });

    it("should have cancel button displayed if input field is not empty", async () => {
        await atom.acceptInput("foo");
        expect(await cancelBtnAtom.isIconShown()).toBe(true);
        const iconAtom: IconAtom | undefined = await cancelBtnAtom.getIcon();
        expect(await iconAtom?.getName()).toBe("close");
    });


    it("buttons should be disabled when 'disabled' prop is true", async () => {
        expect(await searchBtnAtom.isDisabled()).toBe(true);
        const input = "foo";
        await atom.acceptInput(input);
        expect(await cancelBtnAtom.isDisabled()).toBe(false);
        expect(await searchBtnAtom.isDisabled()).toBe(false);
    });

    it("should search on enter key", async () => {
        await atom.acceptInput("Lorem");
        await atom.acceptInput(protractor.Key.ENTER);
        expect(await browser.element(by.cssContainingText(".nui-highlighted", "Lorem")).isPresent()).toBe(true);
    });

    it("should get focus on initialization when 'captureFocus' prop is 'true'", async () => {
        expect(await atom.isFocused()).toEqual(true);
        await browser.driver.switchTo().defaultContent();
    });

    it("should have focus depending on 'captureFocus' prop", async () => {
        await setFocusBtnAtom.click();
        expect(await atom.isFocused()).toEqual(true);
        await browser.driver.switchTo().defaultContent();
        await browser.sleep(expectedFocusedDelay);
        expect(await atom.isFocused()).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    });

    it("should get focus on cancel", async () => {
        const input = "foo";
        await atom.acceptInput(input);
        await cancelBtnAtom.click();
        expect(await atom.isFocused()).toEqual(true);
        await browser.driver.switchTo().defaultContent();
    });

    it("should lose focus on search", async () => {
        const input = "foo";
        await atom.acceptInput(input);
        await searchBtnAtom.click();
        expect(await atom.isFocused()).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    });
});
