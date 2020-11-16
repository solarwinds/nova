import { browser, by, element } from "protractor";

import { Animations, Helpers } from "../../helpers";

import { SpinnerAtom } from "./spinner.atom";

describe("Visual tests: Spinner", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        spinnerLargeWithCancel: SpinnerAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("spinner/spinner-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        spinnerLargeWithCancel = new SpinnerAtom(element(by.id("nui-spinner-large-cancel")));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Spinner");
        await eyes.checkWindow("Default");

        await spinnerLargeWithCancel.waitForDisplayed();
        await spinnerLargeWithCancel.cancel();
        await eyes.checkWindow("Spinners with cance buttons are cancelled");
        await eyes.close();
    });
});
