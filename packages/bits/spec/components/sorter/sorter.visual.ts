import { browser, by, element } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { SwitchAtom } from "../switch/switch.atom";

import { SorterAtom } from "./sorter.atom";

describe("Visual tests: Sorter", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        sorter: SorterAtom,
        sorterLegacyStringInput: SorterAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("sorter/visual-test");

        sorter = SorterAtom.find(SorterAtom, "nui-demo-sorter");
        sorterLegacyStringInput = SorterAtom.find(SorterAtom, "nui-demo-sorter-legacy-string-input");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Sorter");

        await eyes.checkWindow("Default");

        await sorter.getSorterButton().click();
        await eyes.checkWindow("Sorting direction changed");

        await Helpers.switchDarkTheme("on");
        await sorter.click();
        await eyes.checkWindow("Sorter opened with dark theme");

        await Helpers.switchDarkTheme("off");
        await sorter.getItemByIndex(0).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(2));
        await eyes.checkWindow("Sorter: first item selected");

        await sorter.getItemByIndex(2).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(0));
        await eyes.checkWindow("Sorter: last item selected");

        await sorterLegacyStringInput.getSorterButton().click();
        await eyes.checkWindow("Legacy string input sorting direction changed");

        await sorterLegacyStringInput.click();
        await eyes.checkWindow("Legacy string input sorter opened");

        await sorterLegacyStringInput.getItemByIndex(0).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(sorterLegacyStringInput.getItemByIndex(2));
        await eyes.checkWindow("Legacy string input sorter: first item selected");

        await sorterLegacyStringInput.getItemByIndex(2).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(sorterLegacyStringInput.getItemByIndex(0));
        await eyes.checkWindow("Legacy string input sorter: last item selected");

        await eyes.close();
    }, 200000);
});
