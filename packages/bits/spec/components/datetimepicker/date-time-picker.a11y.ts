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

import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { DateTimepickerAtom, DialogAtom } from "../public_api";

describe("a11y: date time picker", () => {
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dialogButtonElem: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "date-time-picker/date-time-picker-visual-test"
        );

        dateTimePickerBasic = Atom.find(
            DateTimepickerAtom,
            "nui-basic-date-time-picker"
        );
        dateTimePickerRanged = Atom.find(
            DateTimepickerAtom,
            "nui-date-time-picker-ranged"
        );
        dialogButtonElem = element(by.id("nui-visual-test-dialog-btn"));
    });

    it("should verify a11y of date time picker", async () => {
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    // Enable once NUI-6031 is fixed
    xit("should verify a11y with opened time picker", async () => {
        await dateTimePickerBasic.getTimePicker().toggle();
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    // Enable once NUI-6031 is fixed
    xit("should verify a11y with opened date picker", async () => {
        await dateTimePickerBasic.getDatePicker().toggle();
        await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
    });

    describe("inside the dialog > ", () => {
        beforeEach(async () => {
            await dialogButtonElem.click();
            dateTimePickerDialog = Atom.find(
                DateTimepickerAtom,
                "nui-date-time-picker-dialog"
            );
        });

        afterEach(async () => {
            await DialogAtom.dismissDialog();
        });

        it("should verify a11y of the timepicker in modal dialog", async () => {
            await dateTimePickerDialog.getTimePicker().toggle();
            await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
        });

        it("should verify a11y of the datepicker in modal dialog", async () => {
            await dateTimePickerDialog.getDatePicker().toggle();
            await assertA11y(browser, DateTimepickerAtom.CSS_CLASS);
        });
    });
});
