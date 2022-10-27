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

import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { DateTimepickerAtom } from "./datetimepicker.atom";

describe("USERCONTROL date-time-picker", () => {
    let dateTimePicker: DateTimepickerAtom;

    const getModelValue = async (): Promise<string> =>
        browser.element(by.id("model-value")).getText();

    beforeEach(async () => {
        await Helpers.prepareBrowser("date-time-picker/date-time-picker-test");
        dateTimePicker = Atom.find(
            DateTimepickerAtom,
            "nui-demo-date-time-picker"
        );
    });

    describe("when the datetime picker is displayed, it", () => {
        it("contains initial value", async () => {
            expect(
                await dateTimePicker
                    .getDatePicker()
                    .getInput()
                    .getAttribute("value")
            ).toEqual("15 Mar 1970");
            expect(
                await dateTimePicker.getTimePicker().textbox.getValue()
            ).toEqual("3:30 PM");
        });
    });

    describe("when a valid date is entered and ESC is pressed, it", () => {
        it("propagates the value to model", async () => {
            await dateTimePicker.getDatePicker().clearText();
            await dateTimePicker.getDatePicker().acceptText("5/28/1984");
            expect(await getModelValue()).toBe("1984-05-28 15:30");
        });
    });
    // TODO: enable in scope of NUI-1935
    describe("when a valid time is entered, it", () => {
        xit("propagates the value to model", async () => {
            await dateTimePicker.getTimePicker().textbox.clearText();
            await dateTimePicker.getTimePicker().textbox.acceptText("9:00 am");
            expect(await getModelValue()).toBe("1970-03-15 09:00");
        });
    });
    // TODO: enable in scope of NUI-1934
    describe("when a invalid date is entered and ESC is pressed, it", () => {
        xit("clears the model", async () => {
            await dateTimePicker.getDatePicker().clearText();
            await dateTimePicker.getDatePicker().acceptText("bs bs bs");
            expect(await getModelValue()).toBe("");
        });
    });
    // TODO: enable after NUI-1934 is closed
    describe("when a invalid time is entered, it", () => {
        xit("clears the model", async () => {
            await dateTimePicker.getTimePicker().textbox.clearText();
            await dateTimePicker.getTimePicker().textbox.acceptText("bs bs bs");
            expect(await getModelValue()).toBe("");
        });
    });
});
