import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { TestPage } from "./test.po";

describe("Visual Tests: Charts - Gauge", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    const page = new TestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("chart-types/gauge/visual-test");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Gauge");
        await eyes.checkWindow("Default look");

        await page.enableDarkTheme();
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
