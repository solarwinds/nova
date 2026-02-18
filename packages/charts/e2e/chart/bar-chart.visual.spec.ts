// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    Atom,
    Camera,
    test,
    Helpers,
    Animations,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { LegendAtom } from "../legend/legend.atom";
import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const name: string = "Bar Chart";

test.describe(`Visual tests: Charts - ${name}`, () => {
    let barChartVertical: ChartAtom;
    let barChartHorizontalWithLegend: ChartAtom;
    let legendOfVerticalBarChart: LegendAtom;
    let camera: Camera;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/bar/test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        barChartVertical = Atom.find<ChartAtom>(
            ChartAtom,
            "nui-demo-bar-chart-vertical"
        );
        barChartHorizontalWithLegend = Atom.find<ChartAtom>(
            ChartAtom,
            "nui-demo-bar-chart-horizontal-with-legend"
        );

        legendOfVerticalBarChart = Atom.find<LegendAtom>(
            LegendAtom,
            "nui-demo-bar-chart-vertical-with-legend"
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
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

        await Helpers.prepareBrowser("chart-types/bar/dst-time-interval-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        await camera.say.cheese(
            `${name} - Time Interval Daylight Saving Time Scenarios`
        );

        await camera.turn.off();
    });
});
