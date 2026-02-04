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
import { Locator } from "playwright-core";

import { DateTimepickerAtom } from "./datetimepicker.atom";
import { Atom } from "../../atom";
import { Helpers, expect, test } from "../../setup";
import { DialogAtom } from "../dialog/dialog.atom";

test.describe("a11y: date time picker", () => {
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dialogButtonElem: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "date-time-picker/date-time-picker-visual-test",
            page
        );

        dateTimePickerBasic = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-basic-date-time-picker"
        );
        dateTimePickerRanged = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-date-time-picker-ranged"
        );
        dialogButtonElem = Helpers.page.locator("#nui-visual-test-dialog-btn");
    });

    // Enable once NUI-6031 is fixed
    test.skip("should verify a11y of date time picker", async ({ runA11yScan }) => {
        await runA11yScan(DateTimepickerAtom);
    });

    // Enable once NUI-6031 is fixed
    test.skip("should verify a11y with opened time picker", async ({
        runA11yScan,
    }) => {
        await dateTimePickerBasic.timePicker.toggle();
        await runA11yScan(DateTimepickerAtom);
    });

    // Enable once NUI-6031 is fixed
    test.skip("should verify a11y with opened date picker", async ({
        runA11yScan,
    }) => {
        await dateTimePickerBasic.datePicker.toggle();
        await runA11yScan(DateTimepickerAtom);
    });

    test.describe("inside the dialog > ", () => {
        test.beforeEach(async () => {
            await dialogButtonElem.click();
            dateTimePickerDialog = Atom.find<DateTimepickerAtom>(
                DateTimepickerAtom,
                "nui-date-time-picker-dialog"
            );
        });

        test("should verify a11y of the timepicker in modal dialog", async ({
            runA11yScan,
        }) => {
            await dateTimePickerDialog.timePicker.toggle();
            await runA11yScan(DateTimepickerAtom);
        });

        test("should verify a11y of the datepicker in modal dialog", async ({
            runA11yScan,
        }) => {
            await dateTimePickerDialog.datePicker.toggle();
            await runA11yScan(DateTimepickerAtom);
        });
    });
});
