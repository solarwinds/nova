import { browser } from "protractor";

import { Animations, Helpers } from "../../helpers";


fdescribe("Visual tests: Badge", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Badge");
        await eyes.checkWindow("Default");

        await eyes.close();
    }, 100000);
});
