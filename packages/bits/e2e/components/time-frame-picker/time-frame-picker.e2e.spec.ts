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

import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { PopoverAtom } from "../popover/popover.atom";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

test.describe("USERCONTROL time-frame-picker", () => {
    test.beforeEach(async ({ page }) => {
        // page.clock.setSystemTime
        await page.clock.setSystemTime(new Date(2018, 3, 9, 6, 0, 0, 0));
        await Helpers.prepareBrowser(
            "time-frame-picker/time-frame-picker-test",
            page
        );
        await Helpers.disableCSSAnimations(0); // Animations.ALL
    });

    test.describe("basic with date limitations", () => {
        test.beforeEach(async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            await basicTimeFramePickerPopover.open();
        });

        test("should not have Use button before any control value is changed", async () => {
            const useButton = Atom.find(
                ButtonAtom,
                "nui-demo-basic-time-frame-picker-use",
                true
            );

            await expect(useButton.getLocator()).toHaveCount(0);
        });

        test("should have an ability to change all control values", async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            const basicTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            );
            const useButton = Atom.find(
                ButtonAtom,
                "nui-demo-basic-time-frame-picker-use",
                true
            );

            const startTFP = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker1 = startTFP.datePicker;
            await datePicker1.clearText();
            await datePicker1.acceptText("04/08/2018");
            const timePicker1 = startTFP.timePicker;
            await timePicker1.textbox.clearText();
            await timePicker1.textbox.acceptText(
                TimepickerAtom.createTimeString(6, 0)
            );

            const endTFP = basicTimeFramePicker.getEndDatetimePicker();
            const datePicker2 = endTFP.datePicker;
            await datePicker2.clearText();
            await datePicker2.acceptText("04/09/2018");
            const timePicker2 = endTFP.timePicker;
            await timePicker2.textbox.clearText();
            await timePicker2.textbox.acceptText(
                TimepickerAtom.createTimeString(6, 0)
            );

            await useButton.click();

            await expect(basicTimeFramePickerPopover.getLocator()).toContainText(
                "April 8, 2018 6:00 AM - April 9, 2018 6:00 AM"
            );
        });

        test("should not change all control values after Cancel is clicked", async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            const basicTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            );

            const cancelButton = Atom.find(
                ButtonAtom,
                "nui-demo-basic-time-frame-picker-cancel",
                true
            );

            const startTFP = basicTimeFramePicker.getStartDatetimePicker();
            const datePicker1 = startTFP.datePicker;
            await datePicker1.clearText();
            await datePicker1.acceptText("04/09/2018");
            const timePicker1 = startTFP.timePicker;
            await timePicker1.textbox.clearText();
            await timePicker1.textbox.acceptText(
                TimepickerAtom.createTimeString(6, 0)
            );

            const endTFP = basicTimeFramePicker.getEndDatetimePicker();
            const datePicker2 = endTFP.datePicker;
            await datePicker2.clearText();
            await datePicker2.acceptText("04/10/2018");
            const timePicker2 = endTFP.timePicker;
            await timePicker2.textbox.clearText();
            await timePicker2.textbox.acceptText(
                TimepickerAtom.createTimeString(6, 0)
            );

            await cancelButton.click();

            await expect(basicTimeFramePickerPopover.getLocator()).toContainText(
                "Last hour"
            );
        });

        test("should select quick pick and detect selected quick pick", async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            const basicQuickPicker = Atom.findIn<QuickPickerAtom>(
                QuickPickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            ) as QuickPickerAtom;

            expect(await basicQuickPicker.getSelectedPreset()).toEqual(
                "Last hour"
            );

            await basicQuickPicker.selectPresetByTitle("Last 12 hours");
            await expect(basicTimeFramePickerPopover.getLocator()).toContainText(
                "Last 12 hours"
            );
        });

        test("should not be able to select time before min time", async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            const basicTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            ) as TimeFramePickerAtom;

            const startDateTimePicker =
                basicTimeFramePicker.getStartDatetimePicker();
            const datePicker = startDateTimePicker.datePicker;

            await datePicker.clearText();
            await datePicker.acceptText("04/11/2018");
            await datePicker.toggle();
            await datePicker.goBack();

            // Date should be disabled/non-clickable
            await expect(
                datePicker
                    .getLocator()
                    .locator("tbody button")
                    .filter({ hasText: /^1$/ })
                    .first()
            ).toBeDisabled();

            // The input value should remain unchanged
            await datePicker.toHaveValue("11 Apr 2018");
        });

        test("should not be able to select any date in the next month if MaxDate is now", async () => {
            const basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-demo-basic-time-frame-picker"
            );
            const basicTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            ) as TimeFramePickerAtom;

            const startDateTimePicker =
                basicTimeFramePicker.getStartDatetimePicker();
            const datePicker = startDateTimePicker.datePicker;

            await datePicker.toggle();
            await datePicker.clickTodayButton();
            const expected = await datePicker.getInput.inputValue();
            await datePicker.toggle();
            await datePicker.goNext();

            // Date should be disabled/non-clickable
            await expect(
                datePicker
                    .getLocator()
                    .locator("tbody button")
                    .filter({ hasText: /^1$/ })
                    .first()
            ).toBeDisabled();

            await expect(datePicker.getInput).toHaveValue(expected);
        });
    });
});
