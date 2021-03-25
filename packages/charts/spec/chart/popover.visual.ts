import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const name: string = "Popovers";

describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let bottomPositionChart: ChartAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("plugins/popovers/visual-test");
        barChart = Atom.find(ChartAtom, "visual-test-bar-chart-popover");
        donutChart = Atom.find(ChartAtom, "visual-test-donut-chart-popover");
        lineChart = Atom.find(ChartAtom, "visual-test-line-chart-popover");
        bottomPositionChart = Atom.find(ChartAtom, "visual-test-bottom-position-popover");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        const barSeries: SeriesAtom | undefined = await barChart.getDataSeriesById(SeriesAtom, "safari");
        if (barSeries) {
            await barSeries.hover();
        }
        await camera.say.cheese(`${name} - Default look with bar hovered`);

        const donutSeries: SeriesAtom | undefined = await donutChart.getDataSeriesById(SeriesAtom, "down");
        if (donutSeries) {
            await donutSeries.hover();
        }
        await camera.say.cheese(`${name} - Default look with donut series hovered`);

        await lineChart.hover();
        await camera.say.cheese(`${name} - Default look with line chart hovered`);

        await bottomPositionChart.hover();
        await camera.say.cheese(`${name} - Default look with bottom position popover`);

        await camera.turn.off();
    }, 100000);
});
