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

import { ElementRef, QueryList } from "@angular/core";
import _isUndefined from "lodash/isUndefined";
import _keys from "lodash/keys";
import moment from "moment/moment";

import { DayPickerComponent } from "./date-picker-day-picker.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";

describe("components >", () => {
    describe("daypicker >", () => {
        let inner: DatePickerInnerComponent;
        let dayPicker: DayPickerComponent;

        beforeEach(() => {
            inner = new DatePickerInnerComponent();
            dayPicker = new DayPickerComponent(inner);
        });

        it("should check setting year step", () => {
            expect(_keys(inner.stepDay).length).toBe(0);
            dayPicker.ngOnInit();
            expect(_keys(inner.stepDay).length).toBe(1);
            expect(inner.stepDay.months).toBe(1);
        });

        it("should check if refreshView handler for day has been set", () => {
            expect(
                _isUndefined((inner as any).refreshViewHandlerYear)
            ).toBeTruthy();
            spyOn(inner, "setRefreshViewHandler");
            spyOn(inner, "setCompareHandler");
            dayPicker.ngOnInit();
            expect(inner.setRefreshViewHandler).toHaveBeenCalled();
            expect(inner.setCompareHandler).toHaveBeenCalled();
        });

        it("should get dates", () => {
            const date = moment({ year: 2018, month: 1, date: 2 });
            const dates = (dayPicker as any).getDates(date, 10);
            const last = dates.length - 1;
            expect(moment(dates[0].date).isSame(date)).toBe(true);
            expect(
                moment(dates[last].date).isSame(
                    moment({ year: 2018, month: 1, date: 11 })
                )
            ).toBe(true);
            expect(dates.length).toBe(10);
        });

        it("should get dates (preserving insignificant)", () => {
            inner.preserveInsignificant = true;
            const date = moment({
                year: 2018,
                month: 1,
                date: 2,
                hour: 2,
                minute: 2,
                second: 2,
            });
            const dates = (dayPicker as any).getDates(date, 10);
            const last = dates.length - 1;
            expect(moment(dates[0].date).isSame(date)).toBe(true);
            expect(
                moment(dates[last].date).isSame(
                    moment({
                        year: 2018,
                        month: 1,
                        date: 11,
                        hour: 2,
                        minute: 2,
                        second: 2,
                    })
                )
            ).toBe(true);
            expect(dates.length).toBe(10);
        });

        describe("focusActiveCell >", () => {
            let container: HTMLElement;
            let otherButton: HTMLButtonElement;
            let targetButton: HTMLButtonElement;

            beforeEach(() => {
                container = document.createElement("div");
                document.body.appendChild(container);
                otherButton = document.createElement("button");
                targetButton = document.createElement("button");
                container.appendChild(otherButton);
                container.appendChild(targetButton);
            });

            afterEach(() => {
                container.remove();
            });

            it("should move DOM focus to the button representing the active (current) day cell", () => {
                dayPicker.rows = [
                    {
                        isRowVisible: true,
                        days: [
                            { isCellVisible: true, current: false },
                            { isCellVisible: true, current: true },
                        ],
                    },
                ];
                const buttons = new QueryList<ElementRef<HTMLButtonElement>>();
                buttons.reset([
                    new ElementRef(otherButton),
                    new ElementRef(targetButton),
                ]);
                (dayPicker as any).dayCellButtons = buttons;

                dayPicker.focusActiveCell();

                expect(document.activeElement).toBe(targetButton);
            });

            it("should focus the isFocusTarget cell even when it is not the current cell", () => {
                dayPicker.rows = [
                    {
                        isRowVisible: true,
                        days: [
                            { isCellVisible: true, current: true },
                            { isCellVisible: true, isFocusTarget: true },
                        ],
                    },
                ];
                const buttons = new QueryList<ElementRef<HTMLButtonElement>>();
                buttons.reset([
                    new ElementRef(otherButton),
                    new ElementRef(targetButton),
                ]);
                (dayPicker as any).dayCellButtons = buttons;

                dayPicker.focusActiveCell();

                expect(document.activeElement).toBe(targetButton);
            });

            it("should skip cells that are hidden (not visible in the current view)", () => {
                dayPicker.rows = [
                    {
                        isRowVisible: true,
                        days: [
                            { isCellVisible: false, current: true },
                            { isCellVisible: true, current: false },
                        ],
                    },
                    {
                        isRowVisible: false,
                        days: [{ isCellVisible: true, current: true }],
                    },
                ];
                const buttons = new QueryList<ElementRef<HTMLButtonElement>>();
                buttons.reset([new ElementRef(otherButton)]);
                (dayPicker as any).dayCellButtons = buttons;

                document.body.focus();
                dayPicker.focusActiveCell();

                expect(document.activeElement).toBe(document.body);
            });

            it("should do nothing when there is no active day cell", () => {
                dayPicker.rows = [
                    {
                        isRowVisible: true,
                        days: [{ isCellVisible: true, current: false }],
                    },
                ];
                const buttons = new QueryList<ElementRef<HTMLButtonElement>>();
                buttons.reset([new ElementRef(otherButton)]);
                (dayPicker as any).dayCellButtons = buttons;

                document.body.focus();
                expect(() => dayPicker.focusActiveCell()).not.toThrow();
                expect(document.activeElement).toBe(document.body);
            });
        });
    });
});
