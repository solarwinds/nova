import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { TextboxNumberAtom } from "../textbox-number/textbox-number.atom";

describe("Visual tests: Textbox Number", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicTextboxNumber: TextboxNumberAtom;
    let customTextboxNumber: TextboxNumberAtom;
    let disabledTextboxNumber: TextboxNumberAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("textbox/textbox-number-visual-test");
        basicTextboxNumber = Atom.find(TextboxNumberAtom, "nui-visual-test-textbox-number");
        customTextboxNumber = Atom.find(TextboxNumberAtom, "nui-visual-test-textbox-number-min-max");
        disabledTextboxNumber = Atom.find(TextboxNumberAtom, "nui-visual-test-textbox-number-disabled");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Textbox Number");
        await disabledTextboxNumber.hover();
        await eyes.checkWindow("Default");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");
        await Helpers.switchDarkTheme("off");

        await customTextboxNumber.acceptText("");
        await basicTextboxNumber.hover();
        await eyes.checkWindow("Basic TextboxNumber is hover and Custom TextboxNumber is focused");

        await customTextboxNumber.clearText();
        await customTextboxNumber.acceptText("-3");
        await basicTextboxNumber.upButton.hover();
        await eyes.checkWindow("Validation error in Custom TextboxNumber and UpButton in Basic TextboxNumber is hovered");

        await eyes.close();
    }, 100000);
});
