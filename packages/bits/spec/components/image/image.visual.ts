import { browser } from "protractor";

import { Helpers } from "../../helpers";

describe("Visual tests: Image", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("image/image-visual-test");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Image");
        await eyes.checkWindow("Default");
        await eyes.close();
    }, 100000);
});
