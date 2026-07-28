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

import { fakeAsync, tick } from "@angular/core/testing";
import moment from "moment/moment";

import { DatePickerKeyboardService } from "./date-picker-keyboard.service";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";

const keyBoardEventFactory = (
    code: KEYBOARD_CODE,
    target?: Partial<HTMLElement>
): KeyboardEvent =>
    ({
        preventDefault: () => {},
        code,
        target,
    }) as KeyboardEvent;

describe("Services >", () => {
    describe("DatePickerKeyboardService", () => {
        const service = new DatePickerKeyboardService();
        let datePickerInnerMock: any;
        let dayPickerMock: any;
        let monthPickerMock: any;
        let yearPickerMock: any;
        let overlayMock: any;
        let toggleButtonMock: any;

        beforeEach(() => {
            datePickerInnerMock = {
                value: moment("2022-06-15"),
                datepickerMode: "day",
                yearRange: 20,
                refreshView: () => {},
                calendarMoved: { next: () => {} },
                isDisabled: () => false,
            };
            dayPickerMock = { focusActiveCell: () => {} };
            monthPickerMock = { focusActiveCell: () => {} };
            yearPickerMock = { focusActiveCell: () => {} };
            overlayMock = { showing: false, show: () => {}, hide: () => {} };
            toggleButtonMock = { focus: () => {} };

            service.initService(
                datePickerInnerMock,
                dayPickerMock,
                overlayMock,
                toggleButtonMock,
                monthPickerMock,
                yearPickerMock
            );
        });

        describe("onKeyDown", () => {
            it("should call 'handleClosedCalendar' when the overlay is not showing", () => {
                const spy = spyOn(service as any, "handleClosedCalendar");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);

                service.onKeyDown(event);
                expect(spy).toHaveBeenCalledWith(event);
            });

            it("should call 'handleOpenedCalendar' when the overlay is showing", () => {
                overlayMock.showing = true;
                const spy = spyOn(service as any, "handleOpenedCalendar");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);

                service.onKeyDown(event);
                expect(spy).toHaveBeenCalledWith(event);
            });

            it("should treat the calendar as always open when there is no overlay (inline mode)", () => {
                service.initService(datePickerInnerMock, dayPickerMock);
                const spy = spyOn(service as any, "handleOpenedCalendar");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service.onKeyDown(event);
                expect(spy).toHaveBeenCalledWith(event);
            });
        });

        describe("handleClosedCalendar", () => {
            it("should show the overlay and call preventDefault on ArrowDown", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);
                const preventDefaultSpy = spyOn(event, "preventDefault");
                const showSpy = spyOn(overlayMock, "show");

                service["handleClosedCalendar"](event);

                expect(preventDefaultSpy).toHaveBeenCalled();
                expect(showSpy).toHaveBeenCalled();
            });

            it("should do nothing for other keys", () => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);
                const showSpy = spyOn(overlayMock, "show");

                service["handleClosedCalendar"](event);

                expect(showSpy).not.toHaveBeenCalled();
            });
        });

        describe("handleOpenedCalendar", () => {
            beforeEach(() => {
                overlayMock.showing = true;
            });

            it("should hide the overlay and restore focus to the toggle button on Escape", () => {
                const hideSpy = spyOn(overlayMock, "hide");
                const focusSpy = spyOn(toggleButtonMock, "focus");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ESCAPE);

                service["handleOpenedCalendar"](event);

                expect(hideSpy).toHaveBeenCalled();
                expect(focusSpy).toHaveBeenCalled();
            });

            it("should not attempt to hide when there is no overlay (inline mode)", () => {
                service.initService(datePickerInnerMock, dayPickerMock);
                const event = keyBoardEventFactory(KEYBOARD_CODE.ESCAPE);

                expect(() =>
                    service["handleOpenedCalendar"](event)
                ).not.toThrow();
            });

            it("should ignore navigation keys for an unrecognized mode", () => {
                datePickerInnerMock.datepickerMode = "decade";
                const refreshSpy = spyOn(datePickerInnerMock, "refreshView");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);

                expect(refreshSpy).not.toHaveBeenCalled();
            });

            it("should not navigate the grid when an arrow key comes from the text input", fakeAsync(() => {
                const startValue = datePickerInnerMock.value.clone();
                const refreshSpy = spyOn(datePickerInnerMock, "refreshView");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT, {
                    tagName: "INPUT",
                });

                service["handleOpenedCalendar"](event);
                tick();

                expect(refreshSpy).not.toHaveBeenCalled();
                expect(
                    datePickerInnerMock.value.isSame(startValue, "day")
                ).toBeTruthy();
            }));

            it("should still close on Escape when the event comes from the text input", () => {
                const hideSpy = spyOn(overlayMock, "hide");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ESCAPE, {
                    tagName: "INPUT",
                });

                service["handleOpenedCalendar"](event);

                expect(hideSpy).toHaveBeenCalled();
            });

            it("should move to the first day of the month on Home", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.HOME);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-06-01"), "day")
                ).toBeTruthy();
            }));

            it("should move to the last day of the month on End", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.END);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-06-30"), "day")
                ).toBeTruthy();
            }));

            it("should move one day forward on ArrowRight", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-06-16"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should move one day back on ArrowLeft", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_LEFT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-06-14"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should move one week forward on ArrowDown", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-06-22"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should move one week back on ArrowUp", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_UP);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-06-08"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should move to the next month on PageDown, preserving the day", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.PAGE_DOWN);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-07-15"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should move to the previous month on PageUp, preserving the day", fakeAsync(() => {
                const event = keyBoardEventFactory(KEYBOARD_CODE.PAGE_UP);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-05-15"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should clamp to the last valid day of the month when paging into a shorter month", fakeAsync(() => {
                datePickerInnerMock.value = moment("2022-01-31");
                const event = keyBoardEventFactory(KEYBOARD_CODE.PAGE_DOWN);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-02-28"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should skip disabled dates when moving by day", fakeAsync(() => {
                datePickerInnerMock.isDisabled = (date: moment.Moment) =>
                    date.isSame(moment("2022-06-16"), "day");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(
                    datePickerInnerMock.value.isSame(
                        moment("2022-06-17"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should refresh the view and focus the active cell after navigating", fakeAsync(() => {
                const refreshSpy = spyOn(datePickerInnerMock, "refreshView");
                const focusSpy = spyOn(dayPickerMock, "focusActiveCell");
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(refreshSpy).toHaveBeenCalled();
                expect(focusSpy).toHaveBeenCalled();
            }));

            it("should notify calendarMoved only when the displayed month changes", fakeAsync(() => {
                const calendarMovedSpy = spyOn(
                    datePickerInnerMock.calendarMoved,
                    "next"
                );
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(calendarMovedSpy).not.toHaveBeenCalled();
            }));

            it("should notify calendarMoved when navigation crosses into a new month", fakeAsync(() => {
                datePickerInnerMock.value = moment("2022-06-30");
                const calendarMovedSpy = spyOn(
                    datePickerInnerMock.calendarMoved,
                    "next"
                );
                const event = keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT);

                service["handleOpenedCalendar"](event);
                tick();

                expect(calendarMovedSpy).toHaveBeenCalled();
            }));
        });

        describe("month mode navigation", () => {
            beforeEach(() => {
                overlayMock.showing = true;
                datePickerInnerMock.datepickerMode = "month";
            });

            it("should move one month forward on ArrowRight", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-07-15"), "month")
                ).toBeTruthy();
            }));

            it("should move one month back on ArrowLeft", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_LEFT)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-05-15"), "month")
                ).toBeTruthy();
            }));

            it("should move one row (3 months) forward on ArrowDown", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-09-15"), "month")
                ).toBeTruthy();
            }));

            it("should move one row (3 months) back on ArrowUp", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_UP)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-03-15"), "month")
                ).toBeTruthy();
            }));

            it("should move one year forward on PageDown", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.PAGE_DOWN)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2023-06-15"), "month")
                ).toBeTruthy();
            }));

            it("should move one year back on PageUp", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.PAGE_UP)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2021-06-15"), "month")
                ).toBeTruthy();
            }));

            it("should move to January on Home", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.HOME)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-01-15"), "month")
                ).toBeTruthy();
            }));

            it("should move to December on End", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.END)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2022-12-15"), "month")
                ).toBeTruthy();
            }));

            it("should focus the active cell of the month grid after navigating", fakeAsync(() => {
                const focusSpy = spyOn(monthPickerMock, "focusActiveCell");

                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(focusSpy).toHaveBeenCalled();
            }));

            it("should notify calendarMoved only when the displayed year changes", fakeAsync(() => {
                const calendarMovedSpy = spyOn(
                    datePickerInnerMock.calendarMoved,
                    "next"
                );

                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(calendarMovedSpy).not.toHaveBeenCalled();
            }));

            it("should notify calendarMoved when navigation crosses into a new year", fakeAsync(() => {
                datePickerInnerMock.value = moment("2022-12-15");
                const calendarMovedSpy = spyOn(
                    datePickerInnerMock.calendarMoved,
                    "next"
                );

                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(calendarMovedSpy).toHaveBeenCalled();
            }));
        });

        describe("year mode navigation", () => {
            beforeEach(() => {
                overlayMock.showing = true;
                datePickerInnerMock.datepickerMode = "year";
            });

            it("should move one year forward on ArrowRight", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2023-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should move one year back on ArrowLeft", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_LEFT)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2021-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should move one row (5 years) forward on ArrowDown", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_DOWN)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2027-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should move one row (5 years) back on ArrowUp", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_UP)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2017-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should page by yearRange (20 years) forward on PageDown", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.PAGE_DOWN)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2042-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should page by yearRange (20 years) back on PageUp", fakeAsync(() => {
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.PAGE_UP)
                );
                tick();

                expect(
                    datePickerInnerMock.value.isSame(moment("2002-06-15"), "year")
                ).toBeTruthy();
            }));

            it("should focus the active cell of the year grid after navigating", fakeAsync(() => {
                const focusSpy = spyOn(yearPickerMock, "focusActiveCell");

                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.ARROW_RIGHT)
                );
                tick();

                expect(focusSpy).toHaveBeenCalled();
            }));

            it("should not respond to Home/End in the year view", fakeAsync(() => {
                const startValue = datePickerInnerMock.value.clone();
                const refreshSpy = spyOn(datePickerInnerMock, "refreshView");

                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.HOME)
                );
                service["handleOpenedCalendar"](
                    keyBoardEventFactory(KEYBOARD_CODE.END)
                );
                tick();

                expect(refreshSpy).not.toHaveBeenCalled();
                expect(
                    datePickerInnerMock.value.isSame(startValue, "year")
                ).toBeTruthy();
            }));
        });
    });
});
