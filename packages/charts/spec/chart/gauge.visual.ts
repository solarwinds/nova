import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { GaugeUtil } from "../../src/gauge/gauge-util";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { TestPage } from "./test.po";

describe("Visual Tests: Charts - Gauge", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let gauge: ChartAtom;
    const page = new TestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("chart-types/gauge/visual-test");
        gauge = Atom.find(ChartAtom, "visual-test-gauge-high-value");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Gauge");
        await eyes.checkWindow("Default look");

        const gaugeSeries = await gauge.getDataSeriesById(SeriesAtom, GaugeUtil.REMAINDER_SERIES_ID) as SeriesAtom;
        await gaugeSeries.hover();
        await eyes.checkWindow("Default look with gauge hovered");

        await page.enableDarkTheme();
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
