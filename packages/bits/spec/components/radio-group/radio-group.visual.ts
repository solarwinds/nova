import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { RadioGroupAtom } from "./radio-group.atom";

describe("Visual tests: Radio Group", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
    fruitGroup: RadioGroupAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("radio-group/radio-group-visual-test");
        fruitGroup = Atom.find(RadioGroupAtom, "fruit-radio-group");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Radio Group");
        await eyes.checkWindow("Default");

        await fruitGroup.getRadioByValue("Banana").click();
        await fruitGroup.hover(fruitGroup.getRadioByValue("Papaya"));
        await eyes.checkWindow("Click Banana and Hover on Papaya");

        await eyes.close();
    }, 100000);
});
