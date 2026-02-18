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

const name: string = "Line Chart";

test.describe(`Visual Tests: Charts - ${name}`, () => {
    let camera: Camera;
    let legend: LegendAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/line/visual-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        legend = new LegendAtom(
            page.locator("line-chart-with-axis-labels-example")
        );

        camera = new Camera().loadFilm(page, name, "Charts");
    });

    test(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default look`);

        await legend.getSeriesByIndex(1).hover();
        await camera.say.cheese(`${name} - Legend tile hovered`);

        await camera.turn.off();
    });
});
