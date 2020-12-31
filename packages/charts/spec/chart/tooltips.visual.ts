import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

describe("Visual Tests: Charts - Tooltips", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let lineChartInScrollContainer: ChartAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("plugins/tooltips/visual-test");
        barChart = Atom.find(ChartAtom, "visual-test-bar-chart-tooltips");
        donutChart = Atom.find(ChartAtom, "visual-test-donut-chart-tooltips");
        lineChart = Atom.find(ChartAtom, "visual-test-line-chart-tooltips");
        lineChartInScrollContainer = Atom.find(ChartAtom, "visual-test-line-chart-tooltips-with-scroll");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Tooltips");

        const barSeries: SeriesAtom | undefined = await barChart.getDataSeriesById(SeriesAtom, "safari");
        if (barSeries) {
            await barSeries.hover();
        }
        await eyes.checkWindow("Default look with bar hovered");

        const donutSeries: SeriesAtom | undefined = await donutChart.getDataSeriesById(SeriesAtom, "down");
        if (donutSeries) {
            await donutSeries.hover();
        }
        await eyes.checkWindow("Default look with donut series hovered");

        await lineChart.hover();
        await eyes.checkWindow("Default look with line chart hovered");

        await lineChartInScrollContainer.scrollTo();
        await lineChartInScrollContainer.hover();
        await eyes.checkWindow("Default look with line chart in scroll container hovered");

        await eyes.close();
    }, 100000);
});
