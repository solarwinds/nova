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

import { browser, by, element } from "protractor";

import { Atom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ChartAtom } from "./atoms/chart.atom";

const name: string = "Spark Chart";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    let firstChart: ChartAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/spark/test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        firstChart = Atom.findIn(
            ChartAtom,
            element(by.tagName("nui-spark-chart-multiple-example")),
            0
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it("Default look", async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await firstChart.hover();
        await camera.say.cheese(`${name} - After hover`);

        await camera.turn.off();
    }, 100000);
});
