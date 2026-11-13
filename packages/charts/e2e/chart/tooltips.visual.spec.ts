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
    expect,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { waitForChartLayout } from "./visual-test-helpers";

const name: string = "Tooltips";

test.describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let lineChartInScrollContainer: ChartAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("plugins/tooltips/visual-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        barChart = new ChartAtom(
            page.locator("#visual-test-bar-chart-tooltips")
        );
        donutChart = new ChartAtom(
            page.locator("#visual-test-donut-chart-tooltips")
        );
        lineChart = new ChartAtom(
            page.locator("#visual-test-line-chart-tooltips")
        );
        lineChartInScrollContainer = new ChartAtom(
            page.locator("#visual-test-line-chart-tooltips-with-scroll")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();
        await waitForChartLayout(page);
        const tooltips = page.locator(".nui-chart-tooltip-pane:visible");

        const barSeries: SeriesAtom | undefined =
            await barChart.getDataSeriesById(SeriesAtom, "safari");
        if (!barSeries) {
            throw new Error(
                "Safari series is missing from the tooltip fixture"
            );
        }
        await barSeries.hover();
        await expect(tooltips).toHaveCount(1);
        await expect(tooltips).toContainText("14");
        await camera.say.cheese(`${name} - Default look with bar hovered`);

        const donutSeries: SeriesAtom | undefined =
            await donutChart.getDataSeriesById(SeriesAtom, "down");
        if (!donutSeries) {
            throw new Error("Down series is missing from the tooltip fixture");
        }
        await donutSeries.hover();
        await expect(tooltips).toHaveCount(1);
        await expect(tooltips).toContainText("7");
        await camera.say.cheese(
            `${name} - Default look with donut series hovered`
        );

        await lineChart.getLocator().locator(".mouse-interactive-area").hover();
        await expect(tooltips).toHaveCount(2);
        await waitForChartLayout(page);
        await expect(tooltips).toHaveText([/Series 1:\s*15/, /Series 2:\s*70/]);
        await camera.say.cheese(
            `${name} - Default look with line chart hovered`
        );

        await lineChartInScrollContainer.getLocator().scrollIntoViewIfNeeded();
        await waitForChartLayout(page);
        await lineChartInScrollContainer
            .getLocator()
            .locator(".mouse-interactive-area")
            .hover();
        await expect(tooltips).toHaveCount(2);
        await waitForChartLayout(page);
        await expect(tooltips).toHaveText([/Series 1:\s*15/, /Series 2:\s*70/]);
        await camera.say.cheese(
            `${name} - Default look with line chart in scroll container hovered`
        );

        await camera.turn.off();
    });
});
