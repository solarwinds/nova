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

import { browser, Key } from "protractor";

import { Atom } from "../../atom";
import { Animations, assertA11y, Helpers } from "../../helpers";
import { SelectV2Atom } from "../public_api";

describe("a11y: select-v2", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
        "nested-interactive",
    ];
    let selectBasic: SelectV2Atom;
    let selectErrorState: SelectV2Atom;
    let selectDisplayValueSmall: SelectV2Atom;
    let selectDisplayValue: SelectV2Atom;
    let selectGrouped: SelectV2Atom;
    let selectInForm: SelectV2Atom;
    let selectOverlayStyles: SelectV2Atom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("select-v2/test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        selectBasic = Atom.find(SelectV2Atom, "basic");
        selectErrorState = Atom.find(SelectV2Atom, "error-state");
        selectDisplayValueSmall = Atom.find(
            SelectV2Atom,
            "display-value-mw200"
        );
        selectDisplayValue = Atom.find(SelectV2Atom, "display-value");
        selectGrouped = Atom.find(SelectV2Atom, "grouped");
        selectInForm = Atom.find(SelectV2Atom, "reactive-form");
        selectOverlayStyles = Atom.find(SelectV2Atom, "overlay-styles");
    });

    it("should check a11y of select-v2", async () => {
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.pressKey(Key.TAB, 3);
        await (await selectBasic.getOption(3)).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.switchDarkTheme("on");
        await selectErrorState.toggle();
        await (await selectErrorState.getFirstOption()).click();
        await (await selectInForm.getLastOption()).click();
        await (await selectDisplayValue.getFirstOption()).click();
        await (await selectGrouped.getLastOption()).click();
        await (await selectDisplayValueSmall.getOption(6)).click();
        await (await selectDisplayValueSmall.getOption(3)).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await Helpers.switchDarkTheme("off");
        await selectGrouped.toggle();
        await (await selectGrouped.getLastOption()).hover();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of select-v2", async () => {
        await selectOverlayStyles.toggle();
        await assertA11y(browser, SelectV2Atom.CSS_CLASS, rulesToDisable);
    });
});
