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

import { StatusChartAtom } from "./status-chart.atom";

const name: string = "Status Chart";

test.describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let statusChartWithIcons: StatusChartAtom;
    const firstStatusChartSeriesID = "1";

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/status/test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        statusChartWithIcons = new StatusChartAtom(
            page.locator("#nui-status-chart-with-icons")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();
        await camera.say.cheese(`${name} - Default`);

        await (
            await statusChartWithIcons.getStatusBarDataPointByIndex(
                firstStatusChartSeriesID,
                5
            )
        ).hover();
        await camera.say.cheese(`${name} - Middle status bar hovered`);

        const originalViewport = page.viewportSize() ?? { width: 1280, height: 720 };
        await page.setViewportSize({ width: 340, height: 800 });
        await camera.say.cheese(
            `${name} - Layout is not affected by resize + icons are not be displayed if bar size is too low`
        );

        await page.setViewportSize(originalViewport);

        await camera.turn.off();
    });
});
