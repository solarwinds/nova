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
import { SelectV2Atom } from "./select-v2.atom";
import { test, Helpers, Animations } from "../../setup";

test.describe("a11y: select-v2", () => {
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

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("select-v2/test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);
        selectBasic = Atom.find<SelectV2Atom>(SelectV2Atom, "basic");
        selectErrorState = Atom.find<SelectV2Atom>(SelectV2Atom, "error-state");
        selectDisplayValueSmall = Atom.find<SelectV2Atom>(
            SelectV2Atom,
            "display-value-mw200"
        );
        selectDisplayValue = Atom.find<SelectV2Atom>(SelectV2Atom, "display-value");
        selectGrouped = Atom.find<SelectV2Atom>(SelectV2Atom, "grouped");
        selectInForm = Atom.find<SelectV2Atom>(SelectV2Atom, "reactive-form");
        selectOverlayStyles = Atom.find<SelectV2Atom>(SelectV2Atom, "overlay-styles");
    });

    test("should check a11y of select-v2", async ({ runA11yScan }) => {
        await runA11yScan(SelectV2Atom, rulesToDisable);
    });

    test("should check a11y of select-v2 after keyboard and hover", async ({ runA11yScan }) => {
        await Helpers.pressKey("Tab", 3);
        const option = await selectBasic.getOption(3);
        await option.hover();
        await runA11yScan(SelectV2Atom, rulesToDisable);
    });

    test("should check a11y of select-v2 in dark theme and with interactions", async ({ runA11yScan }) => {
        await Helpers.switchDarkTheme("on");
        await selectErrorState.toggle();
        await (await selectErrorState.getFirstOption()).click();
        await (await selectInForm.getLastOption()).click();
        await (await selectDisplayValue.getFirstOption()).click();
        await (await selectGrouped.getLastOption()).click();
        await (await selectDisplayValueSmall.getOption(6)).click();
        const hoverOption = await selectDisplayValueSmall.getOption(3);
        await hoverOption.hover();
        await runA11yScan(SelectV2Atom, rulesToDisable);
        await Helpers.switchDarkTheme("off");
    });

    test("should check a11y of select-v2 after grouped hover", async ({ runA11yScan }) => {
        await Helpers.switchDarkTheme("off");
        await selectGrouped.toggle();
        const lastOption = await selectGrouped.getLastOption();
        await lastOption.hover();
        await runA11yScan(SelectV2Atom, rulesToDisable);
    });

    test("should check a11y of select-v2 overlay styles", async ({ runA11yScan }) => {
        await selectOverlayStyles.toggle();
        await runA11yScan(SelectV2Atom, rulesToDisable);
    });
});
