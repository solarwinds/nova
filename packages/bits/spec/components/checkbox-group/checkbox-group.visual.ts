import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { CheckboxGroupAtom } from "./checkbox-group.atom";

describe("Visual tests: Checkbox Group", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let checkboxJustified: CheckboxGroupAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-visual-test");
        checkboxJustified = Atom.find(CheckboxGroupAtom, "nui-demo-checkbox-group-justified");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Checkbox Group");
        await eyes.checkWindow("Default");

        await checkboxJustified.getFirst().hover();
        await eyes.checkWindow("First Checkbox in Justified Checkbox-Group is hovered");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
