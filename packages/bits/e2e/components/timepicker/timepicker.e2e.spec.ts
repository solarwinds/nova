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

import { TimepickerAtom } from "./timepicker.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL timepicker", () => {
    let basicTimePicker: TimepickerAtom;
    let disabledTimePicker: TimepickerAtom;
    let customFormatTimePicker: TimepickerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("time-picker", page);

        basicTimePicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-demo-timepicker-basic"
        );
        disabledTimePicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-demo-timepicker-disabled"
        );
        customFormatTimePicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-demo-timepicker-custom-format"
        );
    });

    test.describe(" basic >", () => {
        test("should display menu after toggling timepicker", async () => {
            await basicTimePicker.toggle();
            await basicTimePicker.overlay.toBeOpened();
            await basicTimePicker.toggle();
            await basicTimePicker.overlay.toNotBeOpened();
        });

        test("should not have disabled styling", async () => {
            await basicTimePicker.textbox.toNotBeDisabled();
        });

        test("should contain 'clock' icon", async () => {
            expect(await basicTimePicker.icon.getName()).toBe("clock");
        });

        test.describe("select time in menu >", () => {
            test("should select last item", async () => {
                await basicTimePicker.toggle();
                const lastItem =
                    (await basicTimePicker.menuPopup.items
                        .last()
                        .textContent()) || "";

                await basicTimePicker.menuPopup.clickItemByText(lastItem);
                await basicTimePicker.textbox.toHaveValue(lastItem.trim());
            });

            test("should select first item", async () => {
                await basicTimePicker.toggle();
                const firstItem =
                    (await basicTimePicker.menuPopup.items
                        .first()
                        .textContent()) || "";
                await basicTimePicker.menuPopup.clickItemByText(firstItem);
                await basicTimePicker.textbox.toHaveValue(firstItem.trim());
            });

            test("should select item in the middle", async () => {
                const timeToSelect = TimepickerAtom.createTimeString(7, 0);
                await basicTimePicker.selectTime(timeToSelect);
                await basicTimePicker.textbox.toHaveValue(timeToSelect);
            });

            test("should highlight correct time in menu when selecting time", async () => {
                const timeToSelect = TimepickerAtom.createTimeString(7, 0);
                await basicTimePicker.selectTime(timeToSelect);
                const highlightedValue =
                    await basicTimePicker.getHighlightedMenuValue();
                await expect(highlightedValue).toContainText(timeToSelect);
            });
        });

        test.describe("select time when typing into textbox >", () => {
            test.beforeEach(async () => {
                await basicTimePicker.textbox.clearText();
            });

            test("should apply correct time when typing time into textbox", async () => {
                const timeToType = TimepickerAtom.createTimeString(3, 33);
                await basicTimePicker.textbox.acceptText(timeToType);
                await basicTimePicker.textbox.toHaveValue(timeToType);
            });

            test("should highlight time in menu in correct time range when typing time into textbox", async () => {
                const timeToType = TimepickerAtom.createTimeString(3, 33);
                const expectedTime = TimepickerAtom.createTimeString(3, 30);
                await basicTimePicker.textbox.acceptText(timeToType);
                const highlightedValue =
                    await basicTimePicker.getHighlightedMenuValue();
                await expect(highlightedValue).toContainText(expectedTime);
            });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            // test("should correctly apply AM time", async () => {
            //     const stringToType = "3";
            //     const expectedTime = TimepickerAtom.createTimeString(3, 0);
            //     await basicTimePicker.textbox.acceptText(stringToType);
            //     expect(await basicTimePicker.textbox.getValue()).toEqual(
            //         expectedTime
            //     );
            // });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            // xtest("should correctly apply PM time", async () => {
            //     const stringToType = "17";
            //     const expectedTime = TimepickerAtom.createTimeString(17, 0);
            //     await basicTimePicker.textbox.acceptText(stringToType);
            //     expect(await basicTimePicker.textbox.getValue()).toEqual(
            //         expectedTime
            //     );
            // });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            // xtest("should correctly apply time with adding 'PM'", async () => {
            //     const stringToType = "5PM";
            //     const expectedTime = TimepickerAtom.createTimeString(17, 0);
            //     await basicTimePicker.textbox.acceptText(stringToType);
            //     expect(await basicTimePicker.textbox.getValue()).toEqual(
            //         expectedTime
            //     );
            // });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            // xtest("should correctly apply time with adding 'AM'", async () => {
            //     const stringToType = "5AM";
            //     const expectedTime = TimepickerAtom.createTimeString(5, 0);
            //     await basicTimePicker.textbox.acceptText(stringToType);
            //     expect(await basicTimePicker.textbox.getValue()).toEqual(
            //         expectedTime
            //     );
            // });
        });
    });

    test.describe(" disabled >", () => {
        test("input should have disabled attribute", async () => {
            await disabledTimePicker.textbox.toBeDisabled();
        });

        test("should not display menu after timepicker toggle", async () => {
            await disabledTimePicker.toggle();
            await disabledTimePicker.overlay.toNotBeOpened();
        });
    });

    test.describe(" custom date format >", () => {
        test("time picker should have 'h:mm:ss' format on init", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.input.inputValue();
            expect(
                TimepickerAtom.isCorrectTimeFormat(timepickerValue, "h:mm:ss")
            ).toBeTruthy();
        });

        test("time picker should have 'h:mm:ss' format after selecting item in menu", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.input.inputValue();
            const timeToSelect = TimepickerAtom.createTimeString(
                7,
                0,
                "h:mm:ss"
            );
            await customFormatTimePicker.selectTime(timeToSelect);
            expect(
                TimepickerAtom.isCorrectTimeFormat(timepickerValue, "h:mm:ss")
            ).toBeTruthy();
        });

        test("time picker should have 'h:mm:ss' format after typing in textbox", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.input.inputValue();
            const timeToType = TimepickerAtom.createTimeString(7, 0, "h:mm:ss");
            await customFormatTimePicker.textbox.clearText();
            await customFormatTimePicker.textbox.acceptText(timeToType);
            expect(
                TimepickerAtom.isCorrectTimeFormat(timepickerValue, "h:mm:ss")
            ).toBeTruthy();
        });
    });
});
