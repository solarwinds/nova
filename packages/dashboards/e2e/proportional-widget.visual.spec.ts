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
    Helpers,
    test,
} from "@nova-ui/bits/sdk/atoms-playwright";

const name: string = "Proportional Widget";

test.describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/proportional", page);
        camera = new Camera().loadFilm(page, name, "Dashboards");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        // Hover on the last legend series inside the 3rd nui-widget
        // (mirrors old Protractor: .all(nui-widget).get(2).all(nui-legend-series).last())
        const thirdWidget = page
            .locator("#proportional-widget nui-widget")
            .nth(2);
        const lastLegendSeries = thirdWidget
            .locator("nui-legend-series")
            .last();
        await lastLegendSeries.hover();

        await camera.say.cheese(`${name} - Hover on legend`);

        await camera.turn.off();
    });
});
