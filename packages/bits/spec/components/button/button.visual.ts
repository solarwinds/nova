import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { ButtonAtom } from "./button.atom";

describe("Visual tests: Button", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        basicButton: ButtonAtom,
        primaryButton: ButtonAtom,
        actionButton: ButtonAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("button/button-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicButton = Atom.find(ButtonAtom, "basic-button");
        primaryButton = Atom.find(ButtonAtom, "primary-button");
        actionButton = Atom.find(ButtonAtom, "action-button");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Button");
        await eyes.checkWindow("Default");

        await basicButton.hover();
        await eyes.checkWindow("Hover on basic button");

        await basicButton.mouseDown();
        await eyes.checkWindow("After basic button mouse down");
        await basicButton.mouseUp();

        await primaryButton.hover();
        await eyes.checkWindow("Hover on primary button");

        await primaryButton.mouseDown();
        await eyes.checkWindow("After primary button mouse down");
        await primaryButton.mouseUp();

        await actionButton.hover();
        await eyes.checkWindow("Hover on action button");

        await actionButton.mouseDown();
        await eyes.checkWindow("After action button mouse down");

        await eyes.close();
    }, 100000);
});
