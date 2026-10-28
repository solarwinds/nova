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

test.describe("legacy research form-field", () => {
    test("describes the native legacy focus targets and removes cleared hints", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("form-field/form-field-legacy-test", page);
        const priority = page.getByRole("button", {
            name: "Maintenance priority",
            exact: true,
        });
        const site = page.getByRole("textbox", {
            name: "Recovery site",
            exact: true,
        });

        await expect(priority).toHaveAccessibleDescription(
            "Choose Emergency only when service is unavailable."
        );
        await expect(site).toHaveAccessibleDescription(
            "Use a site code from the approved recovery plan."
        );
        await priority.focus();
        await expect(priority).toBeFocused();
        await site.focus();
        await expect(site).toBeFocused();

        await page
            .getByRole("button", {
                name: "Clear legacy field hints",
                exact: true,
            })
            .click();
        for (const control of [priority, site]) {
            await expect(control).toHaveAccessibleDescription("");
            await expect(control).not.toHaveAttribute("aria-describedby");
        }
    });

    test("keeps legacy controls and instructions usable on their own page", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("form-field/form-field-legacy-test", page);
        const priority = page.getByRole("button", {
            name: "Maintenance priority",
            exact: true,
        });
        const site = page.getByRole("textbox", {
            name: "Recovery site",
            exact: true,
        });

        await expect(page.locator("nui-form-field")).toHaveCount(2);
        await expect(priority).toBeVisible();
        await expect(site).toBeVisible();
        await expect(
            page.getByText(
                "Choose Emergency only when service is unavailable.",
                { exact: true }
            )
        ).toBeVisible();
        await expect(
            page.getByText("Use a site code from the approved recovery plan.", {
                exact: true,
            })
        ).toBeVisible();
        await priority.click();
        await page.getByText("Emergency", { exact: true }).click();
        await expect(priority).toHaveText("Emergency");
        await site.fill("PRG-01");
        await site.press("Tab");
        await expect(site).toHaveValue("PRG-01");
    });
});

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
        textbox = Atom.find<TextboxAtom>(
            TextboxAtom,
            "nui-form-field-test-textbox"
        );
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
        radioGroup = Atom.find<RadioGroupAtom>(
            RadioGroupAtom,
            "nui-form-field-test-radio"
        );
        select = Atom.find<SelectV2Atom>(
            SelectV2Atom,
            "nui-form-field-test-select"
        );
        combobox = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "nui-form-field-test-combobox"
        );
        switchElement = Atom.find<SwitchAtom>(
            SwitchAtom,
            "nui-form-field-test-switch"
        );
        timepicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-form-field-test-timepicker"
        );
        checkbox = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-form-field-test-checkbox"
        );
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

    test("should distinguish caption-only freetype editors on their native targets", async ({
        page,
    }) => {
        const primary = page.locator(
            "#nui-form-field-research-query-caption-primary textarea"
        );
        const backup = page.locator(
            "#nui-form-field-research-query-caption-secondary textarea"
        );

        await expect(primary).toHaveAccessibleName("Primary device query");
        await expect(backup).toHaveAccessibleName("Backup device query");
        await primary.fill("select");
        await backup.fill("backup");
        await primary.focus();
        await expect(primary).toBeFocused();
        await expect(primary).toHaveValue("select");
        await backup.focus();
        await expect(backup).toBeFocused();
        await expect(backup).toHaveValue("backup");
    });

    test("should preserve freetype descriptions with their configured names", async ({
        page,
    }) => {
        const primary = page.locator(
            "#nui-form-field-research-query-primary textarea"
        );
        const backup = page.locator(
            "#nui-form-field-research-query-secondary textarea"
        );

        await expect(primary).toHaveAccessibleName("Primary device query");
        await expect(primary).toHaveAccessibleDescription(
            "Enter the query for primary devices."
        );
        await expect(backup).toHaveAccessibleName("Backup device query");
        await expect(backup).toHaveAccessibleDescription(
            "Enter the query for backup devices."
        );
    });

    test("should distinguish inline calendar purposes and preserve help during selection", async ({
        page,
    }) => {
        const maintenance = page
            .locator("#nui-form-field-research-inline-date")
            .getByRole("application", {
                name: "Maintenance date",
                exact: true,
            });
        const recovery = page
            .locator("#nui-form-field-research-inline-recovery-date")
            .getByRole("application", { name: "Recovery date", exact: true });

        await expect(maintenance).toHaveAccessibleDescription(
            "Choose the maintenance date in local time."
        );
        await expect(recovery).toHaveAccessibleDescription(
            "Choose the date when recovery completes."
        );
        const recoverySelection = await recovery
            .locator("button.selected")
            .allTextContents();
        await maintenance.locator("nui-day-picker").focus();
        await expect(maintenance.locator("nui-day-picker")).toBeFocused();
        await maintenance
            .getByRole("button", { name: "15", exact: true })
            .click();
        await expect(maintenance.locator("button.selected")).toHaveText("15");
        expect(
            await recovery.locator("button.selected").allTextContents()
        ).toEqual(recoverySelection);
        await maintenance
            .getByRole("button", { name: "Next month", exact: true })
            .click();
        await expect(maintenance).toHaveAccessibleName("Maintenance date");
        await expect(maintenance).toHaveAccessibleDescription(
            "Choose the maintenance date in local time."
        );
        await expect(recovery).toHaveAccessibleName("Recovery date");
    });

    test("should display info from template", async () => {
        const iconAtom = atomWithTemplate.getInfoIcon();
        await expect(iconAtom.getLocator()).toHaveAttribute(
            "icon",
            "severity_info"
        );

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
                "Textbox Number"
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

    test("preserves explicit names in captionless fields after creation and reload", async ({
        page,
    }) => {
        const dashboardName = page.locator(
            "#nui-form-field-test-captionless input"
        );
        const dashboardDescription = page.locator(
            "#nui-form-field-test-empty-caption textarea"
        );

        await expect(dashboardName).toHaveAccessibleName("Dashboard name");
        await expect(dashboardDescription).toHaveAccessibleName(
            "Dashboard description"
        );
        await dashboardName.fill("Monitoring overview");
        await expect(dashboardName).toHaveValue("Monitoring overview");
        await expect(dashboardName).toHaveAccessibleName("Dashboard name");

        await page.reload();

        await expect(dashboardName).toHaveAccessibleName("Dashboard name");
        await expect(dashboardDescription).toHaveAccessibleName(
            "Dashboard description"
        );
        await expect(textbox.input).toHaveAccessibleName("Textbox");
    });

    test("describes supported controls from visible field help and removes cleared hints", async ({
        page,
    }) => {
        const targets = [
            "#nui-form-field-test-textbox input",
            "#nui-form-field-test-textbox-number input",
            "#nui-form-field-test-switch [role=checkbox]",
            "#nui-form-field-test-radio",
            "#nui-form-field-test-checkbox input[type=checkbox]",
            "#nui-form-field-test-checkbox-group",
            "nui-color-picker [role=combobox]",
            "#nui-form-field-test-datepicker input",
            "#nui-form-field-test-timepicker input",
            "#nui-form-field-test-datetimepicker nui-date-picker input",
            "#nui-form-field-test-datetimepicker nui-time-picker input",
            "#nui-form-field-test-select [role=combobox]",
            "#nui-form-field-test-combobox input",
        ];

        for (const clearHints of [false, true]) {
            if (clearHints) {
                await page
                    .getByRole("button", {
                        name: "Clear field hints",
                        exact: true,
                    })
                    .click();
            }
            for (const selector of targets) {
                const target = page.locator(selector);
                const help = target
                    .locator("xpath=ancestor::nui-form-field[1]")
                    .locator(".nui-form-field__help");
                if (clearHints) {
                    await expect(help).not.toContainText("Provide a value.");
                }
                const text = (await help.innerText())
                    .replace(/\s+/g, " ")
                    .trim();
                const helpId = await help.getAttribute("id");
                await expect(target).toHaveAccessibleDescription(text);
                if (text) {
                    await expect(target).toHaveAttribute(
                        "aria-describedby",
                        helpId!
                    );
                    await expect(page.locator(`[id="${helpId}"]`)).toHaveCount(
                        1
                    );
                } else {
                    await expect(target).not.toHaveAttribute(
                        "aria-describedby"
                    );
                }
            }
        }
    });

    test("updates, clears and restores the caption name and names a recreated control", async ({
        page,
    }) => {
        const field = page.locator("#nui-form-field-test-dynamic-caption");
        const input = field.locator("input");
        await expect(input).toHaveAccessibleName("Primary email");
        await input.fill("person@example.com");
        await page
            .getByRole("button", { name: "Update caption", exact: true })
            .click();
        await expect(input).toHaveAccessibleName("Recovery email");
        await expect(field.locator("label")).toHaveText("Recovery email");
        await expect(input).toHaveValue("person@example.com");
        await page
            .getByRole("button", { name: "Clear caption", exact: true })
            .click();
        await expect(input).toHaveAccessibleName("Notification email");
        await expect(field.locator("label")).toHaveCount(0);
        await page
            .getByRole("button", { name: "Restore caption", exact: true })
            .click();
        await expect(input).toHaveAccessibleName("Primary email");
        await page
            .getByRole("button", {
                name: "Toggle captioned control",
                exact: true,
            })
            .click();
        await expect(input).toHaveCount(0);
        await page
            .getByRole("button", { name: "Update caption", exact: true })
            .click();
        await page
            .getByRole("button", {
                name: "Toggle captioned control",
                exact: true,
            })
            .click();
        await expect(input).toHaveAccessibleName("Recovery email");
        await expect(input).toHaveAttribute(
            "id",
            (await field.locator("label").getAttribute("for"))!
        );
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
            await expect(
                checkboxGroup.getCheckboxByIndex(0).getInputElement
            ).toBeEnabled();
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
