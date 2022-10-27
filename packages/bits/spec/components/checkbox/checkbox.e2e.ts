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
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

describe("USERCONTROL Checkbox", () => {
    let atom: CheckboxAtom;
    let atomBasic: CheckboxAtom;
    let atomDisabled: CheckboxAtom;
    let atomIndeterminate: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-test");
        atom = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        atomBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox-basic");
        atomDisabled = Atom.find(CheckboxAtom, "nui-demo-checkbox-disabled");
        atomIndeterminate = Atom.find(
            CheckboxAtom,
            "nui-demo-checkbox-indeterminate"
        );
    });

    describe("Value section:", () => {
        it("should check and uncheck when clicked", async () => {
            expect(await atom.isChecked()).toBe(false);

            await atom.toggle();
            expect(await atom.isChecked()).toBe(true);

            await atom.toggle();
            expect(await atom.isChecked()).toBe(false);
        });
    });

    describe("Attribute section:", () => {
        it("should be required", async () => {
            expect(await atom.isRequired()).toBe(true);
        });

        it("should set indeterminate value on script object from 'is-indeterminate' attribute", async () => {
            expect(await atomIndeterminate.isIndeterminate()).toEqual(true);
        });
    });

    describe("Keyboard navigation", () => {
        it("should focus checkbox and toggle with space and enter, propagating TAB", async () => {
            expect(await atomBasic.isChecked()).toBeTruthy();

            await Helpers.pressKey(Key.TAB, 2);
            await Helpers.pressKey(Key.SPACE, 1);
            expect(await atomBasic.isChecked()).toBeFalsy();

            await Helpers.pressKey(Key.ENTER, 1);
            expect(await atomBasic.isChecked()).toBeTruthy();

            await Helpers.pressKey(Key.TAB, 1);
            expect(await atomBasic.getLabel().getId()).not.toBe(
                await (await browser.driver.switchTo().activeElement()).getId()
            );
        });
    });
});
