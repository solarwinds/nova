import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

describe("Visual tests: Charts - Waterfall Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("chart-types/waterfall/test");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Waterfall Chart");
        await eyes.checkWindow("Default");
        await eyes.close();
    }, 100000);
});
