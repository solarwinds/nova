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

import { FormFieldAtom } from "./form-field.atom";
import { Atom } from "../../atom";
import { Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

const rulesToDisable: string[] = [
    "aria-allowed-role",
    "bypass",
    "color-contrast",
    "landmark-one-main",
    "region",
    "page-has-heading-one",
    "nested-interactive",
    "aria-required-attr",
    "target-size",
];

test.describe("a11y: form-field", () => {
    let toggleButton: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("form-field/form-field-test", page);
        toggleButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-form-field-test-toggle-disable-state-button"
        );
    });

    test("should check a11y of form-field disabled state", async ({ runA11yScan }) => {
        await runA11yScan(FormFieldAtom, rulesToDisable);
    });

    test("should check a11y of form-field enabled state", async ({ runA11yScan }) => {
        await toggleButton.click();
        await runA11yScan(FormFieldAtom, rulesToDisable);
    });
});
