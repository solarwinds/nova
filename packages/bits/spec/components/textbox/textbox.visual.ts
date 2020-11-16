import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { TextboxAtom } from "../textbox/textbox.atom";

describe("Visual tests: Textbox", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicTextbox: TextboxAtom;
    let placeholderTextbox: TextboxAtom;
    let readonlyTextbox: TextboxAtom;
    let requiredTextbox: TextboxAtom;
    let areaTextbox: TextboxAtom;
    let placeholderAreaTextbox: TextboxAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("textbox/textbox-visual-test");
        basicTextbox = Atom.find(TextboxAtom, "nui-visual-test-textbox-item");
        placeholderTextbox = Atom.find(TextboxAtom, "nui-visual-test-placeholder-textbox-item");
        readonlyTextbox = Atom.find(TextboxAtom, "nui-visual-test-readonly-textbox-item");
        requiredTextbox = Atom.find(TextboxAtom, "nui-visual-test-required-textbox-item");
        areaTextbox = Atom.find(TextboxAtom, "nui-visual-test-area-textbox-item");
        placeholderAreaTextbox = Atom.find(TextboxAtom, "nui-visual-test-placeholder-area-textbox-item");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Textbox");
        await eyes.checkWindow("Default");

        await basicTextbox.input.click();
        await placeholderTextbox.hover();
        await eyes.checkWindow("Basic Textbox is focused and Textbox with placeholder is hovered");

        await requiredTextbox.acceptText("a");
        await readonlyTextbox.hover();
        await eyes.checkWindow("'a' was entered in required Textbox and readonly Textbox is hovered");

        await areaTextbox.input.click();
        await placeholderAreaTextbox.hover();
        await eyes.checkWindow("Area Textbox is focused and Area Textbox with placeholder is hovered");

        await eyes.close();
    }, 100000);
});
