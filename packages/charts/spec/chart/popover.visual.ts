import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

describe("Visual Tests: Charts - Popovers", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let bottomPositionChart: ChartAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("plugins/popovers/visual-test");
        barChart = Atom.find(ChartAtom, "visual-test-bar-chart-popover");
        donutChart = Atom.find(ChartAtom, "visual-test-donut-chart-popover");
        lineChart = Atom.find(ChartAtom, "visual-test-line-chart-popover");
        bottomPositionChart = Atom.find(ChartAtom, "visual-test-bottom-position-popover");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Popovers");

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

        await bottomPositionChart.hover();
        await eyes.checkWindow("Default look with bottom position popover");

        await eyes.close();
    }, 100000);
});
