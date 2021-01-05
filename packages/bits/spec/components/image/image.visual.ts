import { browser } from "protractor";

import { Helpers } from "../../helpers";

xdescribe("Visual tests: Image", () => {
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

        // Uncomment the code below after NUI-5674 is fixed
        // await Helpers.switchDarkTheme("on");
        // await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 200000);
});
