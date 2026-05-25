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

import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { RangeFilterAtom } from "./range-filter.atom";

test.describe("USERCONTROL range-filter >", () => {
    test("updates the basic range summary when the high handle moves by keyboard", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("range-filter/basic", page);

        const demo = Helpers.page.getByTestId("test-range-filter-basic");
        const rangeFilter = Atom.findIn<RangeFilterAtom>(RangeFilterAtom, demo);

        await rangeFilter.toBeVisible();
        await rangeFilter.expectHandleCount(2);
        await rangeFilter.expectInputCount(2);
        await rangeFilter.expectLowValue(18);
        await rangeFilter.expectHighValue(72);
        await rangeFilter.expectMinimumInputValue(18);
        await rangeFilter.expectMaximumInputValue(72);

        await rangeFilter.pressHighHandle("ArrowRight");

        await rangeFilter.expectHighValue(73);
        await rangeFilter.expectMaximumInputValue(73);
        await expect(demo).toContainText("18% - 73%");
    });

    test("keeps the stepped guides demo summary in sync without exposing number inputs", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("range-filter/guides", page);

        const demo = Helpers.page.getByTestId("test-range-filter-guides");
        const rangeFilter = Atom.findIn<RangeFilterAtom>(RangeFilterAtom, demo);

        await rangeFilter.toBeVisible();
        await rangeFilter.expectHandleCount(2);
        await rangeFilter.expectInputCount(0);
        await rangeFilter.expectLowValue(125);
        await rangeFilter.expectHighValue(350);

        await rangeFilter.pressLowHandle("ArrowLeft");

        await rangeFilter.expectLowValue(100);
        await expect(demo).toContainText("100 ms to 350 ms");
    });

    test("updates the vertical single-value status and label when the threshold changes", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("range-filter/vertical", page);

        const demo = Helpers.page.getByTestId("test-range-filter-vertical");
        const rangeFilter = Atom.findIn<RangeFilterAtom>(RangeFilterAtom, demo);

        await rangeFilter.toBeVisible();
        await rangeFilter.expectHandleCount(1);
        await rangeFilter.expectInputCount(1);
        await rangeFilter.expectHighValue(7);
        await rangeFilter.expectMaximumInputValue(7);
        await expect(demo).toContainText("Level 7 / 10");
        await expect(demo).toContainText("Warning");

        await rangeFilter.pressHighHandle("ArrowUp");

        await rangeFilter.expectHighValue(8);
        await rangeFilter.expectMaximumInputValue(8);
        await expect(demo).toContainText("Level 8 / 10");
        await expect(demo).toContainText("Critical");
    });
});
