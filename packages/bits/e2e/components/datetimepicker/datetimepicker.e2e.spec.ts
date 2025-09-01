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
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL date-time-picker", () => {
    let dateTimePicker: DateTimepickerAtom;

    let getModelValue: Locator;

    test.beforeEach(async ({page}) => {
        await Helpers.prepareBrowser("date-time-picker/date-time-picker-test", page);
        dateTimePicker = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-demo-date-time-picker"
        );
        getModelValue = Helpers.page.locator("#model-value");
    });

    test.describe("when the datetime picker is displayed, it", () => {
        test("contains initial value", async () => {
            await expect(dateTimePicker.datePicker.textbox.input).toHaveValue("15 Mar 1970");
            await expect(dateTimePicker.timePicker.textbox.input).toHaveValue("3:30 PM");
        });
    });

    test.describe("when a valid date is entered and ESC is pressed, it", () => {
        test("propagates the value to model", async () => {
            await dateTimePicker.datePicker.clearText();
            await dateTimePicker.datePicker.acceptText("5/28/1984");
            await expect(getModelValue).toContainText("1984-05-28 15:30");
        });
    });

    test.describe("when a valid time is entered, it", () => {
        test("propagates the value to model", async () => {
            await dateTimePicker.timePicker.textbox.clearText();
            await dateTimePicker.timePicker.textbox.acceptText("9:00 AM");
            await expect(getModelValue).toContainText("1970-03-15 09:00");
        });
    });
    test.describe("when a invalid date is entered and ESC is pressed, it", () => {
        test("clears the model", async () => {
            await dateTimePicker.datePicker.clearText();
            await dateTimePicker.datePicker.acceptText("bs bs bs");
            await expect(getModelValue).toContainText("Invalid date");
        });
    });
    test.describe("when a invalid time is entered, it", () => {
        test("clears the model", async () => {
            await dateTimePicker.timePicker.textbox.clearText();
            await dateTimePicker.timePicker.textbox.acceptText("bs bs bs");
            await expect(getModelValue).toContainText("Invalid date");
        });
    });
});
