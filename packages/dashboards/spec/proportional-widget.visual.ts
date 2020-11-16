import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser } from "protractor";

describe("Visual tests: Dashboards - Proportional Widget", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/proportional");
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Proportional Widget");
        await eyes.checkWindow("Default");

        await eyes.close();
    }, 100000);
});
