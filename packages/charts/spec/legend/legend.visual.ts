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

import { LegendAtom } from "./legend.atom";

const name: string = "Legend";

xdescribe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let seriesRenderStatesLegend: LegendAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("advanced-usage/legend/visual-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        seriesRenderStatesLegend = Atom.findIn(
            LegendAtom,
            element(by.className("legend-series-render-states"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese("Default");

        const unselectedLegendSeries =
            seriesRenderStatesLegend.getSeriesByIndex(0);
        await seriesRenderStatesLegend.hover(
            unselectedLegendSeries.getElement()
        );
        await camera.say.cheese(
            `${name} - Check unselected/hidden series on hover`
        );

        const selectedLegendSeries =
            seriesRenderStatesLegend.getSeriesByIndex(3);
        await seriesRenderStatesLegend.hover(selectedLegendSeries.getElement());
        await camera.say.cheese(`${name} - Check selected series on hover`);

        await seriesRenderStatesLegend.hover(
            selectedLegendSeries.richTile.getElement()
        );
        await camera.say.cheese(
            `${name} - Check selected series on tile hover`
        );

        await camera.turn.off();
    }, 100000);
});
