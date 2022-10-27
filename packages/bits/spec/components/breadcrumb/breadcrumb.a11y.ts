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

import { browser, by, element, ElementFinder } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { BreadcrumbAtom } from "../public_api";

describe("a11y: breadcrumb", () => {
    let showSecondViewButton: ElementFinder;
    let showThirdViewButton: ElementFinder;

    beforeAll(async () => {
        showSecondViewButton = element(
            by.id("nui-demo-breadcrumb-show-second-view")
        );
        showThirdViewButton = element(
            by.id("nui-demo-breadcrumb-show-third-view")
        );
        await Helpers.prepareBrowser("breadcrumb/breadcrumb-visual-test");

        await showSecondViewButton.click();
        await showThirdViewButton.click();
    });

    it("should check a11y of breadcrumb", async () => {
        await assertA11y(browser, BreadcrumbAtom.CSS_CLASS);
    });
});
