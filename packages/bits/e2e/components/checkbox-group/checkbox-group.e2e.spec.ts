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

import { CheckboxGroupAtom } from "./checkbox-group.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

test.describe("USERCONTROL Checkbox Group", () => {
    let checkboxGroup: CheckboxGroupAtom;
    let checkboxGroupJustified: CheckboxGroupAtom;
    let checkbox1: CheckboxAtom | undefined;
    let checkbox2: CheckboxAtom | undefined;
    let checkbox3: CheckboxAtom | undefined;
    let checkbox4: CheckboxAtom | undefined;
    let checkboxGroupCheckboxDisabled: CheckboxAtom;
    let checkboxGroupPartOfForm: CheckboxGroupAtom;
    let submitBtn: ButtonAtom;

    test.beforeEach(async ({page}) => {
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-test", page);
        checkboxGroup = Atom.find<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-basic"
        );
        checkboxGroupJustified = Atom.find<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-justified"
        );
        checkboxGroupCheckboxDisabled = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-demo-checkbox-group-1-disabled-checkbox"
        );
        checkboxGroupPartOfForm = Atom.find<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            "nui-demo-checkbox-group-part-of-form"
        );
        submitBtn = Atom.findIn<ButtonAtom>(ButtonAtom).filter<ButtonAtom>(ButtonAtom, {hasText: "Submit"});

        checkbox1 = checkboxGroup.getCheckbox("Cabbage");
        checkbox2 =  checkboxGroup.getCheckbox("Potato");
        checkbox3 =  checkboxGroup.getCheckbox("Tomato");
        checkbox4 = checkboxGroup.getCheckbox("Carrot");
    });

    test("checking works in a pre-checked group", async () => {
        await checkbox1?.toNotBeChecked();
        await checkbox2?.toBeChecked();
        await checkbox3?.toBeChecked();
        await checkbox4?.toNotBeChecked();

        await checkbox3?.toggle();
        await checkbox3?.toNotBeChecked();
    });

    test("nui-checkbox should have width value, equal to the width of the checkbox-group", async () => {
        const component = checkboxGroupJustified.getFirst();
        const parentElement = checkboxGroupJustified.getLocator();
        const componentBox = await component.boundingBox();
        // Get the computed width from CSS
        const cssWidth = await parentElement.evaluate((el) => window.getComputedStyle(el).width);
        const widthValue = parseFloat(cssWidth);
        expect(widthValue).toBeGreaterThanOrEqual(componentBox!.width - 5);
        expect(widthValue).toBeLessThanOrEqual(componentBox!.width + 5);
    });

    test("should not change the value if clicked on disabled checkbox inside the checkbox group", async () => {
        await checkboxGroupCheckboxDisabled.toggle();
        await checkboxGroupCheckboxDisabled.toBeChecked();
    });

    test("should activate submit button when 3 checkboxes selected", async () => {
        await checkboxGroupPartOfForm.getCheckboxByIndex(0).toBeChecked();
        await checkboxGroupPartOfForm.getCheckboxByIndex(1).toBeChecked();
        await checkboxGroupPartOfForm.getCheckboxByIndex(2).toNotBeChecked();
        await submitBtn.toBeDisabled();
        await checkboxGroupPartOfForm.getCheckboxByIndex(2).toggle();
        await submitBtn.toBeVisible();
    });
});
