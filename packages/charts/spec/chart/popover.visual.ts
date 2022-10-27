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
    browser,
    by,
    element,
    ElementFinder,
    ExpectedConditions,
} from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";

const name: string = "Popovers";

describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let bottomPositionChart: ChartAtom;
    let linePopover: ElementFinder;
    let barPopover: ElementFinder;
    let donutPopover: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("plugins/popovers/visual-test");
        await Helpers.disableCSSAnimations(Animations.ANIMATIONS);
        barChart = Atom.find(ChartAtom, "visual-test-bar-chart-popover");
        donutChart = Atom.find(ChartAtom, "visual-test-donut-chart-popover");
        lineChart = Atom.find(ChartAtom, "visual-test-line-chart-popover");
        bottomPositionChart = Atom.find(
            ChartAtom,
            "visual-test-bottom-position-popover"
        );

        linePopover = element(by.id("visual-test-line-chart-popover"));
        barPopover = element(by.id("visual-test-bar-chart-popover"));
        donutPopover = element(by.id("visual-test-donut-chart-popover"));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        const barSeries: SeriesAtom | undefined =
            await barChart.getDataSeriesById(SeriesAtom, "safari");
        if (barSeries) {
            await barSeries.hover();
        }
        await camera.say.cheese(`${name} - Default look with bar hovered`);

        const donutSeries: SeriesAtom | undefined =
            await donutChart.getDataSeriesById(SeriesAtom, "down");
        if (donutSeries) {
            await donutSeries.hover();
        }
        await browser.wait(
            ExpectedConditions.stalenessOf(
                barPopover.element(by.tagName("nui-popover-modal"))
            )
        );
        await camera.say.cheese(
            `${name} - Default look with donut series hovered`
        );

        await lineChart.hover();
        await browser.wait(
            ExpectedConditions.stalenessOf(
                donutPopover.element(by.tagName("nui-popover-modal"))
            )
        );
        await camera.say.cheese(
            `${name} - Default look with line chart hovered`
        );

        await bottomPositionChart.hover();
        await browser.wait(
            ExpectedConditions.stalenessOf(
                linePopover.element(by.tagName("nui-popover-modal"))
            )
        );
        await camera.say.cheese(
            `${name} - Default look with bottom position popover`
        );

        await camera.turn.off();
    }, 100000);
});
