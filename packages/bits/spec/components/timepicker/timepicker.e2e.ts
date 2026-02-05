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
import { Helpers } from "../../helpers";

describe("USERCONTROL timepicker", () => {
    let basicTimePicker: TimepickerAtom;
    let disabledTimePicker: TimepickerAtom;
    let customFormatTimePicker: TimepickerAtom;

    beforeAll(() => {
        basicTimePicker = Atom.find(
            TimepickerAtom,
            "nui-demo-timepicker-basic"
        );
        disabledTimePicker = Atom.find(
            TimepickerAtom,
            "nui-demo-timepicker-disabled"
        );
        customFormatTimePicker = Atom.find(
            TimepickerAtom,
            "nui-demo-timepicker-custom-format"
        );
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("time-picker");
    });

    describe(" basic >", () => {
        it("should display menu after toggling timepicker", async () => {
            await basicTimePicker.toggle();
            const firstCheckOfMenu = await basicTimePicker.overlay.isOpened();
            expect(firstCheckOfMenu).toBeTruthy();

            await basicTimePicker.toggle();
            const secondCheckOfMenu = await basicTimePicker.overlay.isOpened();
            expect(secondCheckOfMenu).toBeFalsy();
        });

        it("should not have disabled styling", async () => {
            expect(await basicTimePicker.textbox.disabled()).toBe(false);
        });

        it("should contain 'clock' icon", async () => {
            expect(await basicTimePicker.icon.getName()).toBe("clock");
        });

        describe("select time in menu >", () => {
            it("should select last item", async () => {
                await basicTimePicker.toggle();
                const lastItem = await basicTimePicker.menuPopup
                    .getItems()
                    .last()
                    .getText();
                await basicTimePicker.menuPopup.clickItemByText(lastItem);
                const selectedValue = await basicTimePicker.textbox.getValue();
                expect(selectedValue).toBe(lastItem);
            });

            it("should select first item", async () => {
                await basicTimePicker.toggle();
                const firstItem = await basicTimePicker.menuPopup
                    .getItems()
                    .first()
                    .getText();
                await basicTimePicker.menuPopup.clickItemByText(firstItem);
                const selectedValue = await basicTimePicker.textbox.getValue();
                expect(selectedValue).toBe(firstItem);
            });

            it("should select item in the middle", async () => {
                const timeToSelect = TimepickerAtom.createTimeString(7, 0);
                await basicTimePicker.selectTime(timeToSelect);
                const selectedItem = await basicTimePicker.textbox.getValue();
                expect(selectedItem).toBe(timeToSelect);
            });

            it("should highlight correct time in menu when selecting time", async () => {
                const timeToSelect = TimepickerAtom.createTimeString(7, 0);
                await basicTimePicker.selectTime(timeToSelect);
                const highlightedValue =
                    await basicTimePicker.getHighlightedMenuValue();
                expect(highlightedValue).toBe(timeToSelect);
            });
        });

        describe("select time when typing into textbox >", () => {
            beforeEach(async () => {
                await basicTimePicker.waitElementVisible();
                await basicTimePicker.textbox.clearText();
            });

            it("should apply correct time when typing time into textbox", async () => {
                const timeToType = TimepickerAtom.createTimeString(3, 33);
                await basicTimePicker.textbox.acceptText(timeToType);
                expect(await basicTimePicker.textbox.getValue()).toEqual(
                    timeToType
                );
            });

            it("should highlight time in menu in correct time range when typing time into textbox", async () => {
                const timeToType = TimepickerAtom.createTimeString(3, 33);
                const expectedTime = TimepickerAtom.createTimeString(3, 30);
                await basicTimePicker.textbox.acceptText(timeToType);
                const highlightedValue =
                    await basicTimePicker.getHighlightedMenuValue();
                expect(highlightedValue).toEqual(expectedTime);
            });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            xit("should correctly apply AM time", async () => {
                const stringToType = "3";
                const expectedTime = TimepickerAtom.createTimeString(3, 0);
                await basicTimePicker.textbox.acceptText(stringToType);
                expect(await basicTimePicker.textbox.getValue()).toEqual(
                    expectedTime
                );
            });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            xit("should correctly apply PM time", async () => {
                const stringToType = "17";
                const expectedTime = TimepickerAtom.createTimeString(17, 0);
                await basicTimePicker.textbox.acceptText(stringToType);
                expect(await basicTimePicker.textbox.getValue()).toEqual(
                    expectedTime
                );
            });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            xit("should correctly apply time with adding 'PM'", async () => {
                const stringToType = "5PM";
                const expectedTime = TimepickerAtom.createTimeString(17, 0);
                await basicTimePicker.textbox.acceptText(stringToType);
                expect(await basicTimePicker.textbox.getValue()).toEqual(
                    expectedTime
                );
            });

            /**
             * Disabling the test since the autocorrection was disabled in scope of NUI-2866
             */
            xit("should correctly apply time with adding 'AM'", async () => {
                const stringToType = "5AM";
                const expectedTime = TimepickerAtom.createTimeString(5, 0);
                await basicTimePicker.textbox.acceptText(stringToType);
                expect(await basicTimePicker.textbox.getValue()).toEqual(
                    expectedTime
                );
            });
        });
    });

    describe(" disabled >", () => {
        it("input should have disabled attribute", async () => {
            expect(await disabledTimePicker.textbox.disabled()).toBe(true);
        });

        it("should not display menu after timepicker toggle", async () => {
            await disabledTimePicker.toggle();
            const firstCheckOfMenu =
                await disabledTimePicker.overlay.isOpened();
            expect(firstCheckOfMenu).toBeFalsy();
        });
    });

    describe(" custom date format >", () => {
        it("time picker should have 'h:mm:ss' format on init", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.getValue();
            expect(
                TimepickerAtom.isCorrectTimeFormat(timepickerValue, "h:mm:ss")
            ).toBeTruthy();
        });

        it("time picker should have 'h:mm:ss' format after selecting item in menu", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.getValue();
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

        it("time picker should have 'h:mm:ss' format after typing in textbox", async () => {
            const timepickerValue =
                await customFormatTimePicker.textbox.getValue();
            const timeToType = TimepickerAtom.createTimeString(7, 0, "h:mm:ss");
            await customFormatTimePicker.textbox.clearText();
            await customFormatTimePicker.textbox.acceptText(timeToType);
            expect(
                TimepickerAtom.isCorrectTimeFormat(timepickerValue, "h:mm:ss")
            ).toBeTruthy();
        });
    });
});
