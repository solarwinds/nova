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

import { browser, ElementFinder } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { ChartAtom } from "@nova-ui/charts/sdk/atoms/chart/atoms/chart.atom";

import { TestPage } from "./test.po";

const name: string = "Time Series Widget";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    const page = new TestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/timeseries");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        const barWidget = await page.dashboard.getWidgetByHeaderTitleText(
            "Bar Chart with Time Interval Scale"
        );
        await barWidget?.scrollTo();
        const barChart = Atom.findIn(
            ChartAtom,
            barWidget?.getElement() as ElementFinder
        );
        await barChart?.hover();

        await camera.say.cheese(`${name} - Chart hovered in right hand column`);

        await camera.turn.off();
    }, 100000);
});
