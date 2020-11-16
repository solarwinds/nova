import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { BarDataPointAtom } from "./atoms/bar-data-point.atom";
import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Charts - Bucketed Bar Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let horizontalStackedBarChart: ChartAtom;
    let verticalStackedBarChart: ChartAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.CSS);
        await Helpers.prepareBrowser("chart-types/bucketed-bar/test");
        horizontalStackedBarChart = Atom.find(ChartAtom, "nui-demo-horizontal-stacked-bat-chart");
        verticalStackedBarChart = Atom.find(ChartAtom, "nui-demo-vertical-stacked-bar-chart");
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.Scroll);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Bucketed Bar Chart");

        const stackedBarHorizontalSeries: SeriesAtom | undefined = await horizontalStackedBarChart.getDataSeriesById(SeriesAtom, "Brno");
        if (stackedBarHorizontalSeries) {
            await Atom.findIn(BarDataPointAtom, stackedBarHorizontalSeries.getElement(), 0).hover();
        }
        await eyes.checkWindow("Default look with first series highlighted for horizontal stacked bar chart");

        const stackedBarVerticalSeries: SeriesAtom | undefined = await verticalStackedBarChart.getDataSeriesById(SeriesAtom, "Brno");
        if (stackedBarVerticalSeries) {
            await Atom.findIn(BarDataPointAtom, stackedBarVerticalSeries.getElement(), 3).hover();
        }
        await eyes.checkWindow("Default look with last series highlighted for vertical stacked bar chart");

        await eyes.close();
    }, 100000);
});
