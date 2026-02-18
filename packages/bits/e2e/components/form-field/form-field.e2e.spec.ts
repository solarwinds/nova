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

import { FormFieldAtom } from "./form-field.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ComboboxV2Atom } from "../combobox-v2/combobox-v2.atom";
import {
    ButtonAtom,
    CheckboxAtom,
    CheckboxGroupAtom,
    DatepickerAtom,
    DateTimepickerAtom,
    SelectV2Atom,
    SwitchAtom,
    TextboxAtom,
    TextboxNumberAtom,
    TimepickerAtom,
} from "../public_api";
import { RadioGroupAtom } from "../radio-group/radio-group.atom";

test.describe("USERCONTROL form-field >", () => {
    let hintWithTemplate: FormFieldAtom;
    let atomWithTemplate: FormFieldAtom;
    let textbox: TextboxAtom;
    let textboxNumber: TextboxNumberAtom;
    let datepicker: DatepickerAtom;
    let toggleButton: ButtonAtom;
    let radioGroup: RadioGroupAtom;
    let select: SelectV2Atom;
    let combobox: ComboboxV2Atom;
    let switchElement: SwitchAtom;
    let timepicker: TimepickerAtom;
    let checkbox: CheckboxAtom;
    let checkboxGroup: CheckboxGroupAtom;
    let dateTimepicker: DateTimepickerAtom;
    let dateTimepickerModelElement: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("form-field/form-field-test", page);
        Atom.find<FormFieldAtom>(FormFieldAtom, "nui-demo-form-field");
        hintWithTemplate = Atom.find<FormFieldAtom>(
            FormFieldAtom,
            "nui-demo-form-field-hint-with-template"
        );
        atomWithTemplate = Atom.find<FormFieldAtom>(
            FormFieldAtom,
            "nui-demo-form-field-with-template"
        );
        textbox = Atom.find<TextboxAtom>(TextboxAtom, "nui-form-field-test-textbox");
        textboxNumber = Atom.find<TextboxNumberAtom>(
            TextboxNumberAtom,
            "nui-form-field-test-textbox-number"
        );
        datepicker = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-form-field-test-datepicker"
        );
        toggleButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-form-field-test-toggle-disable-state-button",
            true
        );
        radioGroup = Atom.find<RadioGroupAtom>(RadioGroupAtom, "nui-form-field-test-radio");
        select = Atom.find<SelectV2Atom>(SelectV2Atom, "nui-form-field-test-select");
        combobox = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "nui-form-field-test-combobox");
        switchElement = Atom.find<SwitchAtom>(SwitchAtom, "nui-form-field-test-switch");
        timepicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-form-field-test-timepicker"
        );
        checkbox = Atom.find<CheckboxAtom>(CheckboxAtom, "nui-form-field-test-checkbox");
        checkboxGroup = Atom.find<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            "nui-form-field-test-checkbox-group"
        );
        dateTimepicker = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-form-field-test-datetimepicker"
        );
        dateTimepickerModelElement = page.locator(
            "#nui-form-field-test-datetimepicker-model"
        );
    });

    test("should display hint template", async () => {
        await hintWithTemplate.toHaveHintText("Hint template");
    });

    test("should display info from template", async () => {
        const iconAtom = atomWithTemplate.getInfoIcon();
        await expect(iconAtom.getLocator()).toHaveAttribute("icon", "severity_info");

        const iconPopover = atomWithTemplate.getInfoPopover();
        await iconPopover.openByHover();
        const popoverAppendedToBody = iconPopover.getPopoverBody();
        await expect(popoverAppendedToBody).toHaveText("Template with link");

        await Helpers.clickOnEmptySpace();
        await iconPopover.waitForClosed();
    });

    test.describe("aria-label attribute >", () => {
        const getAriaLabel = (atom: Atom): Locator =>
            atom.getLocator().locator("*[aria-label]").first();

        test("should be set for textbox", async () => {
            await expect(getAriaLabel(textbox)).toHaveAttribute(
                "aria-label",
                "Textbox"
            );
        });

        test("should be set for textbox-number", async () => {
            await expect(getAriaLabel(textboxNumber)).toHaveAttribute(
                "aria-label",
                "Textbox number input"
            );
        });

        test("should be set for switch", async () => {
            await expect(getAriaLabel(switchElement)).toHaveAttribute(
                "aria-label",
                "Switch"
            );
        });

        test("should be set for radio-group", async () => {
            await expect(getAriaLabel(radioGroup)).toHaveAttribute(
                "aria-label",
                "Radio"
            );
        });

        test("should be set for checkbox", async () => {
            await expect(getAriaLabel(checkbox)).toHaveAttribute(
                "aria-label",
                "Checkbox"
            );
        });

        test("should be set for date-picker", async () => {
            await expect(getAriaLabel(datepicker)).toHaveAttribute(
                "aria-label",
                "Datepicker"
            );
        });

        test("should be set for time-picker", async () => {
            await expect(getAriaLabel(timepicker)).toHaveAttribute(
                "aria-label",
                "Timepicker"
            );
        });

        test("should be set for date-time-picker", async () => {
            await expect(getAriaLabel(dateTimepicker)).toHaveAttribute(
                "aria-label",
                "Date Time Picker date"
            );
        });

        test("should be set for select-v2", async () => {
            await expect(getAriaLabel(select)).toHaveAttribute(
                "aria-label",
                "SelectV2"
            );
        });

        test("should be set for combobox-v2", async () => {
            await expect(getAriaLabel(combobox)).toHaveAttribute(
                "aria-label",
                "ComboboxV2"
            );
        });
    });

    test("should set initial disabled state to the fields of form", async () => {
        await textbox.toBeDisabled();
        await textboxNumber.toBeDisabled();
        await datepicker.toBeDisabled();
        await datepicker.toggle();
        await datepicker.getOverlay.toNotBeOpened();
        await radioGroup.toHaveDisabledItemsCount(1);
        await checkbox.toBeDisabled();
        await checkboxGroup.toBeDisabled();
        await select.toBeDisabled();
        await combobox.toBeDisabled();
        await switchElement.isDisabled();
        await timepicker.textbox.toBeDisabled();
        await timepicker.toggle();
        await timepicker.overlay.toNotBeOpened();
        await dateTimepicker.isDisabled();
    });

    test.describe("disable state change", () => {
        test.beforeEach(async () => {
            await toggleButton.click();
        });

        test("should dynamically enable texbox", async () => {
            await expect(textbox.input).toBeEnabled();
        });

        test("should dynamically enable texbox-number", async () => {
            await expect(textboxNumber.input).toBeEnabled();
        });

        test("should dynamically enable datepicker", async () => {
            await expect(datepicker.getInput).toBeEnabled();
            await datepicker.toggle();
            await datepicker.getOverlay.toBeOpened();
            await datepicker.toggle();
        });

        test("should dynamically enable radioGroup", async () => {
            await radioGroup.toHaveDisabledItemsCount(0);
        });

        test("should dynamically enable checkbox", async () => {
            await expect(checkbox.getInputElement).toBeEnabled();
        });

        test("should dynamically enable checkbox-group", async () => {
            await expect(checkboxGroup.getCheckboxByIndex(0).getInputElement).toBeEnabled();
        });

        test("should dynamically enable select", async () => {
            await expect(select.input).toBeEnabled();
        });

        // BUG: This test is currently failing due to an application code issue where the combobox input is not properly disabled/enabled based on the form field state. This needs to be fixed in the application code for the test to pass.
        test.skip("should dynamically enable combobox", async () => {
            await expect(combobox.input).toBeEnabled();
        });

        test("should dynamically enable switch", async () => {
            await switchElement.isNotDisabled();
        });

        test("should dynamically enable timepicker", async () => {
            await expect(timepicker.textbox.input).toBeEnabled();
            await timepicker.toggle();
            await timepicker.overlay.toBeOpened();
        });

        test("should dynamically enable checkbox again", async () => {
            await expect(checkbox.getInputElement).toBeEnabled();
        });

        test("should switch focus to textbox on icon click", async () => {
            await timepicker.icon.click();
            await expect(timepicker.textbox.input).toBeFocused();
            await timepicker.icon.click();
        });

        test("should change model for dateTimePicker", async () => {
            await Helpers.clickOnEmptySpace();
            await dateTimepicker.datePicker.deleteTextManually();
            await dateTimepicker.datePicker.acceptText("01 Jan 2020");
            const timeToSelect = TimepickerAtom.createTimeString(2, 0);
            await dateTimepicker.timePicker.textbox.acceptText(timeToSelect);
            await dateTimepicker.timePicker.selectTime("2:00 AM");
            await expect(dateTimepickerModelElement).toHaveText(
                "Wednesday, January 1, 2020 2:00 AM"
            );
        });

        test("should disable all components back", async () => {
            await toggleButton.click();
            await textbox.toBeDisabled();
            await textboxNumber.toBeDisabled();
            await datepicker.toBeDisabled();
            await datepicker.toggle();
            await datepicker.getOverlay.toNotBeOpened();
            await radioGroup.toHaveDisabledItemsCount(1);
            await select.toBeDisabled();
            await switchElement.isDisabled();
            await timepicker.textbox.toBeDisabled();
            await timepicker.toggle();
            await timepicker.overlay.toNotBeOpened();
            await checkbox.toBeDisabled();
            await dateTimepicker.isDisabled();
        });
    });
});
