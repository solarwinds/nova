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

import { assertA11y, Helpers } from "../../helpers";
import { PopoverAtom } from "../public_api";

describe("a11y: popover", () => {
    const rulesToDisable: string[] = [];
    const popoverModal: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-modal"))
    );
    const popoverBasic: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-basic"))
    );

    beforeAll(async () => {
        await Helpers.prepareBrowser("popover/popover-visual-test");
    });

    it("should check a11y of popover hover", async () => {
        await popoverBasic.openByHover();
        await assertA11y(browser, PopoverAtom.CSS_CLASS, rulesToDisable);
        await Helpers.clickOnEmptySpace();
    });

    it("should check a11y of popover modal", async () => {
        await popoverModal.open();
        await assertA11y(browser, PopoverAtom.CSS_CLASS, rulesToDisable);
    });
});
