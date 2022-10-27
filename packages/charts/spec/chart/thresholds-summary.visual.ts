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

import { browser, by, element } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { LegendAtom } from "../legend/legend.atom";
import { ChartAtom } from "./atoms/chart.atom";
import { TestPage } from "./test.po";

const name: string = "Thresholds on Line Chart with Summary Section";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let singleSeriesChart: ChartAtom;
    let multiSeriesChart1Legend: LegendAtom;
    let multiSeriesChart2Legend: LegendAtom;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("thresholds/summary-visual-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        singleSeriesChart = Atom.findIn(
            ChartAtom,
            element(by.css(".nui-thresholds-summary-single-1")),
            0
        );
        multiSeriesChart1Legend = Atom.findIn(
            LegendAtom,
            element(by.css(".nui-thresholds-summary-multiple-1"))
        );
        multiSeriesChart2Legend = Atom.findIn(
            LegendAtom,
            element(by.css(".nui-thresholds-summary-multiple-2"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await multiSeriesChart1Legend
            .getSeriesByIndex(0)
            .richTile.getElement()
            .click();
        await multiSeriesChart2Legend.getSeriesByIndex(0).richTile.hover();
        await camera.say.cheese(`${name} - Default`);

        await multiSeriesChart1Legend
            .getSeriesByIndex(1)
            .richTile.getElement()
            .click();
        await multiSeriesChart2Legend
            .getSeriesByIndex(0)
            .richTile.getElement()
            .click();
        await camera.say.cheese(`${name} - Hover over unselected legend`);

        await singleSeriesChart.hover();
        await camera.say.cheese(`${name} - Hover over main chart`);

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);

        await camera.turn.off();
    }, 100000);
});
