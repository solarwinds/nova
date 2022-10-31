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

import { browser } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

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
        horizontalStackedBarChart = Atom.find(
            ChartAtom,
            "nui-demo-horizontal-stacked-bat-chart"
        );
        verticalStackedBarChart = Atom.find(
            ChartAtom,
            "nui-demo-vertical-stacked-bar-chart"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        const stackedBarHorizontalSeries: SeriesAtom | undefined =
            await horizontalStackedBarChart.getDataSeriesById(
                SeriesAtom,
                "Brno"
            );
        if (stackedBarHorizontalSeries) {
            await Atom.findIn(
                BarDataPointAtom,
                stackedBarHorizontalSeries.getElement(),
                0
            ).hover();
        }
        await camera.say.cheese(
            `${name} - Default look with first series highlighted for horizontal stacked bar chart`
        );

        const stackedBarVerticalSeries: SeriesAtom | undefined =
            await verticalStackedBarChart.getDataSeriesById(SeriesAtom, "Brno");
        if (stackedBarVerticalSeries) {
            await Atom.findIn(
                BarDataPointAtom,
                stackedBarVerticalSeries.getElement(),
                3
            ).hover();
        }
        await camera.say.cheese(
            `${name} - Default look with last series highlighted for vertical stacked bar chart`
        );

        await camera.turn.off();
    }, 100000);
});
