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

import { assertA11y, Helpers } from "../../helpers";
import { TabHeadingAtom, TabHeadingGroupAtom } from "../public_api";

describe("a11y: tab-heading-group", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
    });

    it("should check a11y of tab-heading-group", async () => {
        await assertA11y(browser, TabHeadingAtom, rulesToDisable);
    });

    it("should check a11y of tab-heading-group", async () => {
        await assertA11y(browser, TabHeadingGroupAtom, rulesToDisable);
    });
});
