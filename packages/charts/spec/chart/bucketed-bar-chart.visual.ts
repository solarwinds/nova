import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { BarDataPointAtom } from "./atoms/bar-data-point.atom";
import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const name: string = "Bucketed Bar Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let horizontalStackedBarChart: ChartAtom;
    let verticalStackedBarChart: ChartAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/bucketed-bar/test");
        horizontalStackedBarChart = Atom.find(ChartAtom, "nui-demo-horizontal-stacked-bat-chart");
        verticalStackedBarChart = Atom.find(ChartAtom, "nui-demo-vertical-stacked-bar-chart");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        const stackedBarHorizontalSeries: SeriesAtom | undefined = await horizontalStackedBarChart.getDataSeriesById(SeriesAtom, "Brno");
        if (stackedBarHorizontalSeries) {
            await Atom.findIn(BarDataPointAtom, stackedBarHorizontalSeries.getElement(), 0).hover();
        }
        await camera.say.cheese(`${name} - Default look with first series highlighted for horizontal stacked bar chart`);

        const stackedBarVerticalSeries: SeriesAtom | undefined = await verticalStackedBarChart.getDataSeriesById(SeriesAtom, "Brno");
        if (stackedBarVerticalSeries) {
            await Atom.findIn(BarDataPointAtom, stackedBarVerticalSeries.getElement(), 3).hover();
        }
        await camera.say.cheese(`${name} - Default look with last series highlighted for vertical stacked bar chart`);

        await camera.turn.off();
    }, 100000);
});
