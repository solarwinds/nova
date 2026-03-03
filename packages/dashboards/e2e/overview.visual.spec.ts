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

import { Atom, Camera, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

import { DashboardAtom } from "./dashboard.atom";

const name: string = "Dashboards - Overview";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let dashboard: DashboardAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/overview", page);

        dashboard = Atom.findIn<DashboardAtom>(DashboardAtom);

        camera = new Camera().loadFilm(page, name, "Dashboards");
    });

    test(`${name} - Default look`, async ({ page }) => {
        await camera.turn.on();

        await dashboard.getWidgetByIndex(0).hover();
        await camera.say.cheese(`${name} - Default`);

        // Enable edit mode
        await page.locator("#edit-mode").click();
        await camera.say.cheese(`${name} - Edit Mode Default`);

        const widget = dashboard.getWidgetByIndex(2);
        await widget.hover();
        await camera.say.cheese(`${name} - Widget Hovered in Edit Mode`);

        // Disable edit mode
        await page.locator("#edit-mode").click();
        // Reset mouse position
        await page.mouse.move(0, 0);

        // Enable dark theme
        await page.locator("#dark-theme").click();
        await camera.say.cheese(`${name} - Dark Theme`);

        // Disable dark theme
        await page.locator("#dark-theme").click();

        await camera.turn.off();
    });
});
