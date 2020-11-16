import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { TestPage } from "./test.po";

describe("Visual tests: Dashboards - Overview", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    const page = new TestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("test/overview");
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dashboards - Overview");
        await page.dashboard.getWidgetByIndex(0).hover();
        await eyes.checkWindow("Default");

        await page.enableEditMode();
        await eyes.checkWindow("Edit Mode Default");

        const widget = page.dashboard.getWidgetByIndex(2);
        await widget.hover();
        await eyes.checkWindow("Widget Hovered in Edit Mode");

        await page.disableEditMode();
        await page.resetMousePosition();

        await page.enableDarkTheme();
        await eyes.checkWindow("Dark Theme");

        await page.disableDarkTheme();

        await eyes.close();
    }, 100000);
});
