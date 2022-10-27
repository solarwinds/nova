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

import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { CheckboxAtom, CheckboxGroupAtom } from "../public_api";
import { ButtonAtom } from "../public_api";

describe("USERCONTROL Checkbox Group", () => {
    let checkboxGroup: CheckboxGroupAtom;
    let checkboxGroupJustified: CheckboxGroupAtom;
    let checkbox1: CheckboxAtom | undefined;
    let checkbox2: CheckboxAtom | undefined;
    let checkbox3: CheckboxAtom | undefined;
    let checkbox4: CheckboxAtom | undefined;
    let checkboxGroupCheckboxDisabled: CheckboxAtom;
    let checkboxGroupPartOfForm: CheckboxGroupAtom;
    let submitBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-test");
        checkboxGroup = Atom.find(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-basic"
        );
        checkboxGroupJustified = Atom.find(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-justified"
        );
        checkboxGroupCheckboxDisabled = Atom.find(
            CheckboxAtom,
            "nui-demo-checkbox-group-1-disabled-checkbox"
        );
        checkboxGroupPartOfForm = Atom.find(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-part-of-form"
        );
        submitBtn = Atom.findIn(ButtonAtom, element(by.buttonText("Submit")));
        checkbox1 = await checkboxGroup.getCheckbox("Cabbage");
        checkbox2 = await checkboxGroup.getCheckbox("Potato");
        checkbox3 = await checkboxGroup.getCheckbox("Tomato");
        checkbox4 = await checkboxGroup.getCheckbox("Carrot");
    });

    it("checking works in a pre-checked group", async () => {
        expect(await checkbox1?.isChecked()).toBe(false);
        expect(await checkbox2?.isChecked()).toBe(true);

        expect(await checkbox3?.isChecked()).toBe(true);
        expect(await checkbox4?.isChecked()).toBe(false);
        await checkbox3?.toggle();
        expect(await checkbox3?.isChecked()).toBe(false);
    });

    it("nui-checkbox should have width value, equal to the width of the checkbox-group", async () => {
        const component = checkboxGroupJustified.getFirst().getElement();
        const parentElement = checkboxGroupJustified.getElement();
        const componentWidth = (await component.getSize()).width;
        const containerWidth = (await parentElement.getSize()).width;
        expect(componentWidth).toEqual(containerWidth);
    });

    it("should not change the value if clicked on disabled checkbox inside the checkbox group", async () => {
        await checkboxGroupCheckboxDisabled.toggle();
        expect(await checkboxGroupCheckboxDisabled.isChecked()).toBe(true);
    });

    it("should activate submit button when 3 checkboxes selected", async () => {
        expect(
            await checkboxGroupPartOfForm.getCheckboxByIndex(0).isChecked()
        ).toBe(true);
        expect(
            await checkboxGroupPartOfForm.getCheckboxByIndex(1).isChecked()
        ).toBe(true);
        expect(
            await checkboxGroupPartOfForm.getCheckboxByIndex(2).isChecked()
        ).toBe(false);
        expect(await submitBtn.isDisabled()).toBe(true);
        await checkboxGroupPartOfForm.getCheckboxByIndex(2).toggle();
        expect(await submitBtn.isDisabled()).toBe(false);
    });
});
