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

import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { RadialSeriesAtom } from "./atoms/radial-series.atom";
import { PieChartTestPage } from "./pie-chart-test.po";

describe("Pie chart",  () => {
    const page = new PieChartTestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/pie-and-donut/pie-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
    });

    it("should be displayed", async () => {
        await expect(await page.chart.isPresent()).toBe(true);
        await expect(await page.chart.isDisplayed()).toBe(true);
    });

    it("should highlight active segments and fade inactive ones", async () => {
        const series = await page.chart.getAllVisibleDataSeries(
            RadialSeriesAtom
        );
        await series?.[0].getElement().click();
        await expect(await series?.[0].getOpacity()).toBe(1);
        await expect(await series?.[1].getOpacity()).toBe(0.1);
        await expect(await series?.[2].getOpacity()).toBe(0.1);
        await expect(await series?.[3].getOpacity()).toBe(0.1);
        // Checking that the first segment, if not active, fades as well
        await series?.[1].getElement().click();
        await expect(await series?.[0].getOpacity()).toBe(0.1);
    });
});
