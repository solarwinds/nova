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

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { ButtonAtom, FormFieldAtom } from "../public_api";

describe("a11y: form-field", () => {
    let toggleButton: ButtonAtom;
    const rulesToDisable: string[] = [
        "aria-allowed-role", // disabling because checkboxes are on the page
        "bypass", // because we're not on a real app's page
        "color-contrast",
        "landmark-one-main", // not applicable in the test context
        "region", // not applicable in the test context
        "page-has-heading-one", // not applicable for the tests
        "nested-interactive",
        "aria-required-attr",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("form-field/form-field-test");
        toggleButton = Atom.find(
            ButtonAtom,
            "nui-form-field-test-toggle-disable-state-button"
        );
    });

    it("button", async () => {
        await assertA11y(browser, FormFieldAtom, rulesToDisable);
    });

    it("textbox", async () => {
        await toggleButton.click();
        await assertA11y(browser, FormFieldAtom, rulesToDisable);
    });
});
