import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const name: string = "Bar Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let barChartVertical: ChartAtom;
    let barChartHorizontalWithLegend: ChartAtom;
    let legendOfVerticalBarChart: LegendAtom;
    let camera: Camera;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/bar/test");
        barChartVertical = Atom.find(ChartAtom, "nui-demo-bar-chart-vertical");
        barChartHorizontalWithLegend = Atom.find(
            ChartAtom,
            "nui-demo-bar-chart-horizontal-with-legend"
        );
        legendOfVerticalBarChart = Atom.findIn(
            LegendAtom,
            element(by.id("nui-demo-bar-chart-vertical-with-legend"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        let dataSeries = await barChartVertical.getDataSeriesById(
            SeriesAtom,
            "chrome"
        );
        if (dataSeries) {
            await dataSeries.hover();
        }
        await camera.say.cheese(
            `${name} - Default look with first series highlighted for vertical bar chart`
        );

        dataSeries = await barChartHorizontalWithLegend.getDataSeriesById(
            SeriesAtom,
            "other"
        );
        if (dataSeries) {
            await dataSeries.hover();
        }
        await camera.say.cheese(
            `${name} - Default look with last series highlighted for horizontal bar chart`
        );

        await legendOfVerticalBarChart.getSeriesByIndex(3).hover();
        await camera.say.cheese(
            `${name} - Default look with middle legend tile hovered`
        );

        await Helpers.prepareBrowser("chart-types/bar/dst-time-interval-test");
        await camera.say.cheese(
            `${name} - Time Interval Daylight Saving Time Scenarios`
        );

        await camera.turn.off();
    }, 100000);
});
