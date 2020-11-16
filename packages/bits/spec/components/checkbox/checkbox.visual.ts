import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

describe("Visual tests: Checkbox", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        checkboxBasic: CheckboxAtom,
        checkboxSpecial: CheckboxAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        checkboxBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        checkboxSpecial = Atom.find(CheckboxAtom, "nui-demo-checkbox-special");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Checkbox");
        await eyes.checkWindow("Default");

        await checkboxBasic.hover(checkboxBasic.getLabel());
        await eyes.checkWindow("Basic checkbox hovered");

        await checkboxSpecial.hoverLink();
        await eyes.checkWindow("Special template of checkbox");

        await eyes.close();
    }, 100000);
});
