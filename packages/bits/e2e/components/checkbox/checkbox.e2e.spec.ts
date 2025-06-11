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

import { Locator } from "@playwright/test";

import { CheckboxAtom } from "./checkbox.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL Checkbox", () => {
    let atomBasic: CheckboxAtom;
    let atomDisabled: CheckboxAtom;
    let atomIndeterminate: CheckboxAtom;
    let atomWithHint: CheckboxAtom;
    let columnBasic: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        columnBasic = Helpers.page.locator("#nui-demo-checkbox-basic");
        atomWithHint = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-demo-checkbox"
        );
        atomBasic = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-demo-checkbox-basic"
        );
        atomDisabled = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-demo-checkbox-disabled"
        );
        atomIndeterminate = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-demo-checkbox-indeterminate"
        );
    });

    test.describe("Value section:", () => {
        test("should check and uncheck when clicked", async () => {
            await expect(atomWithHint.getInputElement).not.toBeChecked();

            await atomWithHint.toggle();
            await expect(atomWithHint.getInputElement).toBeChecked();

            await atomWithHint.toggle();
            await expect(atomWithHint.getInputElement).not.toBeChecked();
        });

        test("should not check on disabled items", async () => {
            await expect(atomDisabled.getInputElement).toBeChecked();
            await atomDisabled.toggle();
            await expect(atomDisabled.getInputElement).toBeChecked();
        });
    });

    test.describe("Attribute section:", () => {
        test("should be required", async () => {
            await expect(atomWithHint.getInputElement).toHaveAttribute(
                "required"
            );
        });

        test("should set indeterminate value on script object from 'is-indeterminate' attribute", async () => {
            // can't observe the HTML with auto retries
            // await expect(atomIndeterminate.getInputElement).toHaveAttribute(
            //     "indeterminate"
            // );
            expect(await atomIndeterminate.getInputElement.evaluate((e: HTMLInputElement) => e.indeterminate)).toBeTruthy();
        });
    });

    test.describe("Keyboard navigation", () => {
        test("should focus checkbox and toggle with space and enter, propagating TAB", async () => {
            await expect(atomBasic.getInputElement).toBeChecked();
            await columnBasic.click();

            await Helpers.page.keyboard.press("Tab");

            await Helpers.page.keyboard.press("Space");
            await expect(atomBasic.getInputElement).not.toBeChecked();

            await Helpers.page.keyboard.press("Enter");
            await expect(atomBasic.getInputElement).toBeChecked();

            await Helpers.page.keyboard.press("Tab");
            const active = await Helpers.getActiveElement();
            const id = await active?.evaluate((el) => el.id);
            const checkboxId = await atomIndeterminate.getLabel.evaluate((el) => el.id);
            expect(id).toBeDefined();
            expect(checkboxId).toBeDefined();
            expect(checkboxId).toEqual(id);
        });
    });
});
