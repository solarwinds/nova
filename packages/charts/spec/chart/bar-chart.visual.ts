import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const { StitchMode } = require("@applitools/eyes-protractor");

describe("Visual tests: Charts - Bar Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let barChartVertical: ChartAtom;
    let barChartHorizontalWithLegend: ChartAtom;
    let legendOfVerticalBarChart: LegendAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.CSS);
        await Helpers.prepareBrowser("chart-types/bar/test");
        barChartVertical = Atom.find(ChartAtom, "nui-demo-bar-chart-vertical");
        barChartHorizontalWithLegend = Atom.find(ChartAtom, "nui-demo-bar-chart-horizontal-with-legend");
        legendOfVerticalBarChart = Atom.findIn(LegendAtom, element(by.id("nui-demo-bar-chart-vertical-with-legend")));
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.Scroll);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Bar Chart");

        let dataSeries = await barChartVertical.getDataSeriesById(SeriesAtom, "chrome");
        if (dataSeries) {
            await (dataSeries).hover();
        }
        await eyes.checkWindow("Default look with first series highlighted for vertical bar chart");

        dataSeries = await barChartHorizontalWithLegend.getDataSeriesById(SeriesAtom, "other");
        if (dataSeries) {
            await (dataSeries).hover();
        }
        await eyes.checkWindow("Default look with last series highlighted for horizontal bar chart");

        await legendOfVerticalBarChart.getSeriesByIndex(3).hover();
        await eyes.checkWindow("Default look with middle legend tile hovered");

        await eyes.close();
    }, 100000);
});
