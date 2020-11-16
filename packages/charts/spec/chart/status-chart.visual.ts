import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { StatusChartAtom } from "./status-chart.atom";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Charts - Status Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let statusChartWithIcons: StatusChartAtom;
    const firstStatusChartSeriesID = "1";

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setForceFullPageScreenshot(false);
        await Helpers.prepareBrowser("chart-types/status/test");
        statusChartWithIcons = Atom.find(StatusChartAtom, "nui-status-chart-with-icons");
    });

    afterAll(async () => {
        eyes.setForceFullPageScreenshot(true);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Status Chart");
        await eyes.checkWindow("Default");

        await (await statusChartWithIcons.getStatusBarDataPointByIndex(firstStatusChartSeriesID, 5)).hover();
        await eyes.checkWindow("Middle status bar hovered");

        const originalSize = await browser.manage().window().getSize();
        await browser.manage().window().setSize(340, 800);
        await eyes.checkWindow("Layout is not affected by resize + icons are not be displayed if bar size is too low");

        await browser.manage().window().setSize(originalSize.width, originalSize.height);

        await eyes.close();
    }, 100000);
});
