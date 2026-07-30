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

import { DebugElement } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import moment from "moment/moment";
import momentTz from "moment-timezone";

import { DayPickerComponent } from "./date-picker-day-picker.component";
import { DatePickerInnerComponent } from "./date-picker-inner.component";
import { DatePickerKeyboardService } from "./date-picker-keyboard.service";
import { MonthPickerComponent } from "./date-picker-month-picker.component";
import { DatePickerSpecHelpers } from "./date-picker-spec-helpers/date-picker-spec-helpers";
import { YearPickerComponent } from "./date-picker-year-picker.component";
import { DatePickerComponent } from "./date-picker.component";
import { IconService } from "../../lib/icon/icon.service";
import {
    ButtonComponent,
    datePickerDateFormats,
    datePickerDefaults,
    FormFieldComponent,
    IconComponent,
    SpinnerComponent,
    TextboxComponent,
    TooltipDirective,
} from "../../public_api";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { PopoverComponent } from "../popover/popover.component";
import { ValidationMessageComponent } from "../validation-message/validation-message.component";

const eventMock = {};

describe("components >", () => {
    describe("date-picker >", () => {
        let fixture: ComponentFixture<DatePickerComponent>;
        let componentInstance: DatePickerComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, FormsModule, NuiOverlayModule, IconComponent],
                declarations: [
                    DatePickerComponent,
                    DatePickerInnerComponent,
                    DayPickerComponent,
                    MonthPickerComponent,
                    YearPickerComponent,
                    OverlayComponent,
                    TextboxComponent,
                    SpinnerComponent,
                    ButtonComponent,
                    PopoverComponent,
                    FormFieldComponent,
                    ValidationMessageComponent,
                    TooltipDirective,
                ],
                providers: [
                    UtilService,
                    EdgeDetectionService,
                    DomUtilService,
                    FormBuilder,
                    LoggerService,
                    IconService,
                ],
            });
            fixture = TestBed.createComponent(DatePickerComponent);
            componentInstance = fixture.componentInstance;
            componentInstance.value = moment();
            debugElement = fixture.debugElement;
            fixture.detectChanges();
        });

        it("should contain nui-overlay when not inline option", () => {
            componentInstance.inline = false;
            fixture.detectChanges();
            const overlayExists =
                debugElement.queryAll(By.css("nui-overlay")).length > 0;
            expect(overlayExists).toBeTruthy();
        });

        it("should NOT contain nui-overlay when inline option is set", () => {
            componentInstance.inline = true;
            fixture.detectChanges();
            const noOverlay =
                debugElement.queryAll(By.css("nui-overlay")).length === 0;
            expect(noOverlay).toBeTruthy();
        });

        it("should have only 10 elements for the year mode", () => {
            componentInstance.datepickerMode = "year";
            componentInstance.yearRange = 10;
            fixture.detectChanges();
            componentInstance.overlay.toggle();
            fixture.detectChanges();
            const numberOfYearTiles = debugElement.queryAll(
                By.css("table .year")
            ).length;
            expect(numberOfYearTiles).toBe(10);
        });

        it("should load with selected date being today", () => {
            const activeDate = moment();
            componentInstance.writeValue(activeDate);
            componentInstance.overlay.toggle();
            fixture.detectChanges();
            const activeDateTile = debugElement.query(
                By.css("table button.selected")
            );
            const activeDateValue =
                activeDateTile.nativeElement.innerText.trim();
            const activeDateDay = moment(activeDate).format("D");
            expect(activeDateValue).toBe(activeDateDay);
        });

        it("should notify about active date change", () => {
            spyOn(componentInstance.valueChange, "emit").and.callThrough();
            componentInstance.value = moment().add(7, "month");
            expect(componentInstance.valueChange.emit).toHaveBeenCalled();
        });

        it("should notify about selected date change", () => {
            spyOn(componentInstance.selectionDone, "emit");
            const newSelectedDate = moment();
            componentInstance.onUpdate(newSelectedDate);
            expect(componentInstance.selectionDone.emit).toHaveBeenCalledWith(
                newSelectedDate
            );
        });

        it("should emit Moment object with invalid date if input value is cleared", fakeAsync(async () => {
            componentInstance.ngOnInit();
            componentInstance.onInputActiveDateChanged("");
            tick(501);
            componentInstance.valueChange.subscribe((value: any) => {
                expect(value).toEqual(moment(""));
            });
        }));

        it("should set innerDatePicker.value to 'undefined' if popup is closed", () => {
            componentInstance.ngOnInit();
            componentInstance.value = moment("");
            fixture.detectChanges();
            componentInstance.overlay.hide$.next();
            expect(componentInstance._datePicker.value).toBeUndefined();
        });

        it("should notify if calendar is moved", () => {
            componentInstance.ngOnInit();
            fixture.detectChanges();
            spyOn(
                componentInstance.calendarNavigated,
                "emit"
            ).and.callThrough();
            spyOn(
                componentInstance._datePicker.calendarMoved,
                "next"
            ).and.callThrough();

            componentInstance._datePicker.calendarMoved.next(moment());

            expect(
                componentInstance._datePicker.calendarMoved.next
            ).toHaveBeenCalled();
            expect(componentInstance.calendarNavigated.emit).toHaveBeenCalled();
        });

        it("should select 1 march when selecting March month in Australia timezone", () => {
            const australiaTimezone = "Australia/Sydney";
            const marchDateISO = "2020-03-01T11:00:00.000+11:00";

            componentInstance.ngOnInit();
            componentInstance.value = momentTz().tz(
                australiaTimezone
            ) as unknown as moment.Moment;
            fixture.detectChanges();

            componentInstance._datePicker.select(marchDateISO, eventMock);

            expect(moment.isMoment(componentInstance.value)).toBeTruthy();
            expect(componentInstance.value.month()).toEqual(2);
        });

        it("should keep timezone value if 'handleTimezone' set to 'true'", () => {
            const dateISO = "2020-03-18T11:00:00.000+11:00";

            componentInstance.ngOnInit();
            componentInstance.handleTimezone = true;
            fixture.detectChanges();

            componentInstance._datePicker.select(dateISO, eventMock);

            expect(moment.isMoment(componentInstance.value)).toBeTruthy();
            expect(componentInstance.value.utcOffset()).toEqual(
                moment.parseZone(dateISO).utcOffset()
            );
            expect(componentInstance.value.toString()).toEqual(
                "Wed Mar 18 2020 00:00:00 GMT+1100"
            );
        });

        it("should react properly on selection change", () => {
            const dateISOMoment = moment("2020-03-18T11:00:00.000+11:00");
            const invalidMoment = moment.invalid();

            componentInstance.ngAfterViewInit();
            componentInstance.value = invalidMoment;
            fixture.detectChanges();

            componentInstance._datePicker.selectionDone.next(dateISOMoment);

            expect(componentInstance.value.isValid()).toBeTruthy();
        });

        describe("date validation", () => {
            const validDatesTestCases =
                DatePickerSpecHelpers.getValidDatesTestCases();
            const invalidDatesTestCases =
                DatePickerSpecHelpers.getInvalidDatesTestCases();
            const inputChangeDebounceTime = 500;

            // Proxying date-picker.component isDateDisabled method, as it tries to get and trigger date-picker-inner.component isDisabled method,
            // which is not accessible here from within date-picker component instance, and is not needed to check if date format validation works
            beforeEach(() => {
                Object.defineProperty(componentInstance, "isDateDisabled", {
                    enumerable: true,
                    writable: true,
                    configurable: true,
                    value: () => false,
                });

                componentInstance.ngOnInit();
            });

            validDatesTestCases.forEach((date) => {
                it(`${date} should be a valid date`, fakeAsync(() => {
                    const dateMoment = moment(
                        date,
                        datePickerDateFormats,
                        true
                    ).format(componentInstance.dateFormat);
                    componentInstance.onInputActiveDateChanged(date);
                    tick(inputChangeDebounceTime);
                    expect(
                        componentInstance.value.format(
                            componentInstance.dateFormat
                        )
                    ).toEqual(dateMoment);
                    expect(componentInstance.isInErrorState).toEqual(false);
                }));
            });

            invalidDatesTestCases.forEach((date) => {
                it(`${date} should be an invalid date`, fakeAsync(() => {
                    componentInstance.onInputActiveDateChanged(date);
                    tick(inputChangeDebounceTime);
                    expect(componentInstance.value.isValid()).toBeFalsy();
                    expect(componentInstance.isInErrorState).toEqual(true);
                }));
            });
        });

        describe("date format validation", () => {
            const validDateFormatsTestCases =
                DatePickerSpecHelpers.getValidDateFormatsTestCases();
            const invalidDateFormatsTestCases =
                DatePickerSpecHelpers.getInvalidDateFormatsTestCases();

            validDateFormatsTestCases.forEach((format) => {
                it(`${format} should be a valid date format`, () => {
                    componentInstance.dateFormat = format;
                    componentInstance.ngOnInit();
                    expect(componentInstance["momentDateFormat"]).toEqual(
                        format
                    );
                });
            });

            invalidDateFormatsTestCases.forEach((format) => {
                it(`${format} should be an invalid date format`, () => {
                    componentInstance.dateFormat = format;
                    componentInstance.ngOnInit();
                    expect(componentInstance["momentDateFormat"]).not.toEqual(
                        format
                    );
                    expect(componentInstance["momentDateFormat"]).toEqual(
                        datePickerDefaults.dateFormat
                    );
                });
            });
        });

        describe("keyboard accessibility >", () => {
            const getToggleButton = (): HTMLButtonElement =>
                debugElement.query(By.css("button.nui-datepicker__icon"))
                    .nativeElement;

            beforeEach(() => {
                componentInstance.inline = false;
                fixture.detectChanges();
            });

            it("should render the calendar toggle as an accessible, focusable button", () => {
                const toggleButton = debugElement.query(
                    By.css("button.nui-datepicker__icon")
                );

                expect(toggleButton).toBeTruthy();
                expect(toggleButton.attributes["aria-label"]).toBe(
                    "Open calendar"
                );
                expect(toggleButton.attributes["aria-expanded"]).toBe("false");
            });

            it("should reflect aria-expanded when the overlay is opened", () => {
                componentInstance.overlay.toggle();
                fixture.detectChanges();

                const toggleButton = debugElement.query(
                    By.css("button.nui-datepicker__icon")
                );

                expect(toggleButton.attributes["aria-expanded"]).toBe("true");
            });

            it("should toggle the overlay exactly once when the toggle button is clicked", () => {
                spyOn(componentInstance.overlay, "toggle").and.callThrough();

                getToggleButton().click();

                expect(componentInstance.overlay.toggle).toHaveBeenCalledTimes(
                    1
                );
            });

            it("should open the calendar on ArrowDown when it is closed", fakeAsync(() => {
                expect(componentInstance.overlay.showing).toBeFalsy();

                debugElement.nativeElement.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "ArrowDown",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                tick();

                expect(componentInstance.overlay.showing).toBeTruthy();
            }));

            it("should close the calendar and restore focus to the toggle button on Escape", () => {
                componentInstance.overlay.show();
                fixture.detectChanges();

                const toggleButton = getToggleButton();
                spyOn(toggleButton, "focus");

                expect(
                    (componentInstance as any).keyboardService["toggleButton"]
                ).toBe(toggleButton);

                debugElement.nativeElement.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "Escape",
                        bubbles: true,
                        cancelable: true,
                    })
                );

                expect(componentInstance.overlay.showing).toBeFalsy();
                expect(toggleButton.focus).toHaveBeenCalled();
            });

            it("should navigate to the next day in the grid on ArrowRight", fakeAsync(() => {
                const startDate = moment().startOf("month").add(10, "days");
                componentInstance.writeValue(startDate.clone());
                componentInstance.overlay.show();
                fixture.detectChanges();

                debugElement.nativeElement.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "ArrowRight",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                fixture.detectChanges();
                tick();

                expect(
                    componentInstance._datePicker.value?.isSame(
                        startDate.clone().add(1, "days"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should navigate to the previous month on PageUp", fakeAsync(() => {
                const startDate = moment().startOf("month").add(10, "days");
                componentInstance.writeValue(startDate.clone());
                componentInstance.overlay.show();
                fixture.detectChanges();

                debugElement.nativeElement.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "PageUp",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                fixture.detectChanges();
                tick();

                expect(
                    componentInstance._datePicker.value?.isSame(
                        startDate.clone().subtract(1, "months"),
                        "day"
                    )
                ).toBeTruthy();
            }));

            it("should refocus the active grid cell when the view mode changes", () => {
                const keyboardService =
                    fixture.debugElement.injector.get<DatePickerKeyboardService>(
                        DatePickerKeyboardService
                    );
                const focusSpy = spyOn(keyboardService, "focusActiveCell");

                componentInstance._datePicker.modeChanged.next("month");

                expect(focusSpy).toHaveBeenCalled();
            });
        });
    });
});
