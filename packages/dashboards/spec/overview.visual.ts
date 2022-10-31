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

import { browser } from "protractor";

import { Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { TestPage } from "./test.po";

const name: string = "Dashboards - Overview";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/overview");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await page.dashboard.getWidgetByIndex(0).hover();
        await camera.say.cheese(`${name} - Default`);

        await page.enableEditMode();
        await camera.say.cheese(`${name} - Edit Mode Default`);

        const widget = page.dashboard.getWidgetByIndex(2);
        await widget.hover();
        await camera.say.cheese(`${name} - Widget Hovered in Edit Mode`);

        await page.disableEditMode();
        await page.resetMousePosition();

        await page.enableDarkTheme();
        await camera.say.cheese(`${name} - Dark Theme`);

        await page.disableDarkTheme();

        await camera.turn.off();
    }, 100000);
});
