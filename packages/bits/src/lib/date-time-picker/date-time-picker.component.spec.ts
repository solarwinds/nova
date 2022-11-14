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

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import moment from "moment/moment";

import {
    ButtonComponent,
    FormFieldComponent,
    IconComponent,
    MenuPopupComponent,
    NuiOverlayModule,
    OverlayComponent,
    PopupComponent,
    PopupToggleDirective,
    SpinnerComponent,
    TextboxComponent,
    TimePickerComponent,
    TooltipDirective,
} from "../../public_api";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { UtilService } from "../../services/util.service";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { DayPickerComponent } from "../date-picker/date-picker-day-picker.component";
import { DatePickerInnerComponent } from "../date-picker/date-picker-inner.component";
import { MonthPickerComponent } from "../date-picker/date-picker-month-picker.component";
import { YearPickerComponent } from "../date-picker/date-picker-year-picker.component";
import { DatePickerComponent } from "../date-picker/date-picker.component";
import { DividerComponent } from "../divider/divider.component";
import { IconService } from "../icon/icon.service";
import {
    MenuActionComponent,
    MenuItemComponent,
    MenuLinkComponent,
    MenuOptionComponent,
    MenuSwitchComponent,
} from "../menu";
import { PopoverComponent } from "../popover/popover.component";
import { SwitchComponent } from "../switch/switch.component";
import { ValidationMessageComponent } from "../validation-message/validation-message.component";
import { DateTimePickerComponent } from "./date-time-picker.component";

describe("components >", () => {
    describe("date-time-picker >", () => {
        let fixture: ComponentFixture<DateTimePickerComponent>;
        let datetimePicker: DateTimePickerComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, FormsModule, NuiOverlayModule],
                declarations: [
                    DateTimePickerComponent,
                    DatePickerComponent,
                    DatePickerInnerComponent,
                    DayPickerComponent,
                    MonthPickerComponent,
                    YearPickerComponent,
                    IconComponent,
                    PopupComponent,
                    PopupToggleDirective,
                    TextboxComponent,
                    SpinnerComponent,
                    ButtonComponent,
                    PopoverComponent,
                    FormFieldComponent,
                    ValidationMessageComponent,
                    TooltipDirective,
                    TimePickerComponent,
                    MenuPopupComponent,
                    CheckboxComponent,
                    MenuActionComponent,
                    MenuItemComponent,
                    MenuOptionComponent,
                    MenuSwitchComponent,
                    MenuLinkComponent,
                    DividerComponent,
                    SwitchComponent,
                    OverlayComponent,
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
            fixture = TestBed.createComponent(DateTimePickerComponent);
            datetimePicker = fixture.componentInstance;
        });

        it("should update children models after model's update", () => {
            const newDate = moment();
            spyOn(
                <any>datetimePicker,
                "updateChildrenModels"
            ).and.callThrough();
            datetimePicker.writeValue(newDate);
            expect(
                (datetimePicker as any).updateChildrenModels
            ).toHaveBeenCalled();
            expect(datetimePicker.date?.isSame(newDate)).toBeTruthy();
            expect(datetimePicker.time?.isSame(newDate)).toBeTruthy();
        });

        it("ngAfterViewInit should add inline styles in case of inline input set to true", () => {
            datetimePicker.displayMode = "inline";
            datetimePicker.ngAfterViewInit();
            const isInline =
                datetimePicker.codeElement.nativeElement.classList.contains(
                    "nui-datetime-picker--inline"
                );
            expect(isInline).toBeTruthy();
        });

        it("change model on time update", () => {
            datetimePicker.model = moment("2017/01/01", "DD MMM YYYY");
            const valueForEverything = 10;
            const oldTime = moment(datetimePicker.time);
            const newTime = moment()
                .hours(valueForEverything)
                .minutes(valueForEverything)
                .seconds(valueForEverything);
            datetimePicker.onTimeChanged(newTime);
            expect(oldTime.valueOf()).not.toBe(datetimePicker.model.valueOf());
            expect(datetimePicker.model.hours()).toBe(valueForEverything);
            expect(datetimePicker.model.minutes()).toBe(valueForEverything);
            expect(datetimePicker.model.seconds()).toBe(valueForEverything);
        });

        it("change model on date update", () => {
            datetimePicker.model = moment("2017/01/01", "DD MMM YYYY");
            const year = 2018;
            const month = 3;
            const day = 10;
            const oldTime = moment(datetimePicker.date);
            const newTime = moment().year(year).month(month).date(day);
            datetimePicker.onDateChanged(newTime);
            expect(oldTime.isSame(datetimePicker.model)).toBeFalsy();
            expect(datetimePicker.model.year()).toBe(year);
            expect(datetimePicker.model.month()).toBe(month);
            expect(datetimePicker.model.date()).toBe(day);
        });

        it("should emit invalid Moment object if date is missing", () => {
            datetimePicker.model = moment("2017/01/01", "DD MMM YYYY");

            // @ts-ignore: Suppressing error for testing purposes
            datetimePicker.onDateChanged(null);

            datetimePicker.modelChanged.subscribe((val: any) => {
                expect(val).toEqual(moment(""));
            });
        });

        it("should emit invalid Moment object if time is missing", () => {
            datetimePicker.model = moment("2017/01/01", "DD MMM YYYY");
            // @ts-ignore: Suppressing error for testing purposes
            datetimePicker.onTimeChanged(null);

            datetimePicker.modelChanged.subscribe((val: any) => {
                expect(val).toEqual(moment(""));
            });
        });
    });
});
