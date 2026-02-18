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

import { LegendAtom } from "../legend/legend.atom";
import { ChartAtom } from "./atoms/chart.atom";
import { TestPage } from "./test.po";

const name: string = "Thresholds on Line Chart with Summary Section";

test.describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let singleSeriesChart: ChartAtom;
    let multiSeriesChart1Legend: LegendAtom;
    let multiSeriesChart2Legend: LegendAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("thresholds/summary-visual-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        // Construct atoms directly from locators to avoid mixed Atom typing across installs
        singleSeriesChart = new ChartAtom(
            page.locator(".nui-thresholds-summary-single-1 .nui-chart").first()
        );
        multiSeriesChart1Legend = new LegendAtom(
            page.locator(".nui-thresholds-summary-multiple-1 .nui-legend")
        );
        multiSeriesChart2Legend = new LegendAtom(
            page.locator(".nui-thresholds-summary-multiple-2 .nui-legend")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
        const testPage = new TestPage(page);

        await camera.turn.on();

        await multiSeriesChart1Legend
            .getSeriesByIndex(0)
            .clickTile();
        await multiSeriesChart2Legend.getSeriesByIndex(0).hoverTile();
        await camera.say.cheese(`${name} - Default`);

        await multiSeriesChart1Legend
            .getSeriesByIndex(1)
            .clickTile();
        await multiSeriesChart2Legend
            .getSeriesByIndex(0)
            .clickTile();
        await camera.say.cheese(`${name} - Hover over unselected legend`);

        await singleSeriesChart.hover();
        await camera.say.cheese(`${name} - Hover over main chart`);

        await testPage.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark theme`);

        await camera.turn.off();
    });
});
