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
    Camera,
    test,
    Helpers,
    Animations,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { TestPage } from "./test.po";
import { GAUGE_REMAINDER_SERIES_ID } from "../../src/gauge/constants";

const name: string = "Gauge";

test.describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let donutGauge: ChartAtom;
    let horizontalGauge: ChartAtom;
    let verticalGauge: ChartAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/gauge/visual-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        donutGauge = new ChartAtom(
            page.locator("#visual-test-gauge-donut-high-value")
        );
        horizontalGauge = new ChartAtom(
            page.locator("#visual-test-gauge-horizontal-medium-value")
        );
        verticalGauge = new ChartAtom(
            page.locator("#visual-test-gauge-vertical-low-value")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
        const testPage = new TestPage(page);
        const enableWarningCb = page.locator("#enable-warning");

        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        const donutSeries = await donutGauge.getDataSeriesById(
            SeriesAtom,
            GAUGE_REMAINDER_SERIES_ID
        );
        if (donutSeries) {
            await donutSeries.hover();
            await camera.say.cheese(`${name} - Donut hovered`);
        }

        const horizontalSeries = await horizontalGauge.getDataSeriesById(
            SeriesAtom,
            GAUGE_REMAINDER_SERIES_ID
        );
        if (horizontalSeries) {
            await horizontalSeries.hover();
            await camera.say.cheese(`${name} - Horizontal hovered`);
        }

        const verticalSeries = await verticalGauge.getDataSeriesById(
            SeriesAtom,
            GAUGE_REMAINDER_SERIES_ID
        );
        if (verticalSeries) {
            await verticalSeries.hover();
            await camera.say.cheese(`${name} - Vertical hovered`);
        }

        await testPage.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);
        await testPage.disableDarkTheme();

        await enableWarningCb.click();
        await camera.say.cheese(`${name} - Warning thresholds disabled`);

        await camera.turn.off();
    });
});
