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

const name: string = "Popovers";

test.describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let barChart: ChartAtom;
    let donutChart: ChartAtom;
    let lineChart: ChartAtom;
    let bottomPositionChart: ChartAtom;

    // Host elements that contain the chart + popover
    const linePopoverHostId = "visual-test-line-chart-popover";
    const barPopoverHostId = "visual-test-bar-chart-popover";
    const donutPopoverHostId = "visual-test-donut-chart-popover";

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("plugins/popovers/visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ANIMATIONS);

        // Construct atoms directly to avoid mixed-Atom typing issues across installs.
        barChart = new ChartAtom(
            page.locator(`#${barPopoverHostId} .${ChartAtom.CSS_CLASS}`)
        );
        donutChart = new ChartAtom(
            page.locator(`#${donutPopoverHostId} .${ChartAtom.CSS_CLASS}`)
        );
        lineChart = new ChartAtom(
            page.locator(`#${linePopoverHostId} .${ChartAtom.CSS_CLASS}`)
        );
        bottomPositionChart = new ChartAtom(
            page.locator("#visual-test-bottom-position-popover .nui-chart")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();

        const barSeries = await barChart.getDataSeriesById(SeriesAtom, "safari");
        if (barSeries) {
            await barSeries.hover();
        }
        await camera.say.cheese(`${name} - Default look with bar hovered`);

        const donutSeries = await donutChart.getDataSeriesById(SeriesAtom, "down");
        if (donutSeries) {
            await donutSeries.hover();
        }
        // Wait for previous popover to be gone before capturing.
        await expect(
            page.locator(`#${barPopoverHostId} nui-popover-modal`)
        ).toHaveCount(0);
        await camera.say.cheese(`${name} - Default look with donut series hovered`);

        await lineChart.hover();
        await expect(
            page.locator(`#${donutPopoverHostId} nui-popover-modal`)
        ).toHaveCount(0);
        await camera.say.cheese(`${name} - Default look with line chart hovered`);

        await bottomPositionChart.hover();
        await expect(
            page.locator(`#${linePopoverHostId} nui-popover-modal`)
        ).toHaveCount(0);
        await camera.say.cheese(`${name} - Default look with bottom position popover`);

        await camera.turn.off();
    });
});
