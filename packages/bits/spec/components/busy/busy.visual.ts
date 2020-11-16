import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";

describe("Visual tests: Busy", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let switchBusyState: ElementFinder;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("busy/busy-visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        switchBusyState = element(by.id("nui-busy-test-button"));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Busy");

        await switchBusyState.click();
        await eyes.checkWindow("States of Busy component");

        await eyes.close();
    }, 100000);
});
