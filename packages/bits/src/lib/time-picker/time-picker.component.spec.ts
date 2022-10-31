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

import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import _debounce from "lodash/debounce";
import _each from "lodash/each";
import _findIndex from "lodash/findIndex";
import moment from "moment/moment";
import { Moment } from "moment/moment";

import { ButtonComponent } from "../../lib/button/button.component";
import { CheckboxComponent } from "../../lib/checkbox/checkbox.component";
import { DividerComponent } from "../../lib/divider/divider.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { MenuLinkComponent } from "../../lib/menu/menu-item//menu-link/menu-link.component";
import { MenuActionComponent } from "../../lib/menu/menu-item/menu-action/menu-action.component";
import { MenuItemComponent } from "../../lib/menu/menu-item/menu-item/menu-item.component";
import { MenuOptionComponent } from "../../lib/menu/menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "../../lib/menu/menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "../../lib/menu/menu-popup/menu-popup.component";
import { PopupToggleDirective } from "../../lib/popup/popup-toggle.directive";
import { SpinnerComponent } from "../../lib/spinner/spinner.component";
import { SwitchComponent } from "../../lib/switch/switch.component";
import { TextboxComponent } from "../../lib/textbox/textbox.component";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { NotificationService } from "../../services/notification-service";
import { UtilService } from "../../services/util.service";
import { FormFieldComponent } from "../form-field/form-field.component";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { PopoverComponent } from "../popover/popover.component";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { ToastContainerService } from "../toast/toast-container.service";
import { ToastService } from "../toast/toast.service";
import { TooltipDirective } from "../tooltip/tooltip.directive";
import { ValidationMessageComponent } from "../validation-message/validation-message.component";
import { TimePickerReactiveFormTestComponent } from "./spec-helpers/spec-components";
import { TimePickerKeyboardService } from "./time-picker-keyboard.service";
import { TimePickerComponent } from "./time-picker.component";

describe("components >", () => {
    describe("timepicker >", () => {
        let fixture: ComponentFixture<TimePickerComponent>;
        let componentInstance: TimePickerComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, FormsModule, NuiOverlayModule],
                declarations: [
                    CheckboxComponent,
                    TimePickerComponent,
                    IconComponent,
                    MenuPopupComponent,
                    MenuActionComponent,
                    MenuItemComponent,
                    MenuOptionComponent,
                    MenuSwitchComponent,
                    MenuLinkComponent,
                    DividerComponent,
                    PopupComponent,
                    PopupToggleDirective,
                    TextboxComponent,
                    SpinnerComponent,
                    ButtonComponent,
                    SwitchComponent,
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
                    TimePickerKeyboardService,
                ],
            });
            fixture = TestBed.createComponent(TimePickerComponent);
            componentInstance = fixture.componentInstance;
            debugElement = fixture.debugElement;
            fixture.detectChanges();
        });

        it("should change disable state", () => {
            componentInstance.isDisabled = true;
            _debounce(() => {
                const secondaryState = debugElement
                    .query(By.css(".nui-textbox__input"))
                    .nativeElement.getAttribute("disabled");
                expect(secondaryState).toBeTruthy();
            });
        });

        it("should change selected element", () => {
            componentInstance.overlay.toggle();
            fixture.detectChanges();
            const initialState = debugElement.query(
                By.css(".nui-menu-item--selected")
            ).nativeElement.innerText;
            const index = _findIndex(
                componentInstance.times,
                (time) =>
                    moment(time)
                        .format(componentInstance.timeFormat)
                        .toUpperCase() === initialState
            );
            const movedTime =
                index < 2
                    ? componentInstance.times[index + 1]
                    : componentInstance.times[index - 1];
            const movedTimeFormatted = moment(movedTime).format(
                componentInstance.timeFormat
            );
            expect(movedTimeFormatted).not.toBe(initialState);
            componentInstance.writeValue(movedTime);
            fixture.detectChanges();
            const changedState = debugElement
                .query(By.css(".nui-menu-item--selected"))
                .nativeElement.textContent.trim();
            expect(changedState).toBe(movedTimeFormatted);
        });

        it("should change selected item(input change imitation)", (done: DoneFn) => {
            spyOn(componentInstance, "getItemToSelect");
            componentInstance.onInputActiveDateChanged("01:00 AM");
            // timeout added for debounce time on input
            setTimeout(() => {
                expect(componentInstance.getItemToSelect).toHaveBeenCalled();
                done();
            }, 1000);
        });

        it("should create an times to be shown", () => {
            // generating items with step 60 minutes, gives us 24 elements
            const items = componentInstance.generateTimeItems(60);
            expect(items.length).toBe(24);
        });

        it("should create correct items (step is 60 minutes)", () => {
            const timeStep = 60;
            const items = componentInstance.generateTimeItems(timeStep);
            let prevItem: Moment;
            _each(items, (item) => {
                if (!prevItem) {
                    // this checks that first element in array of times is 00:00
                    prevItem = item;
                    expect(moment(prevItem).toISOString()).toBe(
                        moment(prevItem).startOf("day").toISOString()
                    );
                } else {
                    // this checks that dates is generated correctly considering the step
                    expect(moment(item).diff(moment(prevItem), "minutes")).toBe(
                        timeStep
                    );
                    prevItem = item;
                }
            });
        });

        it("should create correct items (step is 30 minutes)", () => {
            const timeStep = 30;
            const items = componentInstance.generateTimeItems(timeStep);
            let prevItem: Moment;
            _each(items, (item) => {
                if (!prevItem) {
                    // this checks that first element in array of times is 00:00
                    prevItem = item;
                    expect(moment(prevItem).toISOString()).toBe(
                        moment(prevItem).startOf("day").toISOString()
                    );
                } else {
                    // this checks that dates is generated correctly considering the step
                    expect(moment(item).diff(moment(prevItem), "minutes")).toBe(
                        timeStep
                    );
                    prevItem = item;
                }
            });
        });

        it("should check if item is selected", () => {
            componentInstance.writeValue(
                componentInstance.itemsSource[0].itemsSource[0].title
            );
            fixture.detectChanges();
            const isSelected =
                componentInstance.itemsSource[0].itemsSource[4].isSelected;
            expect(isSelected).toBeFalsy();

            const isSelected2 =
                componentInstance.itemsSource[0].itemsSource[0].isSelected;
            expect(isSelected2).toBeTruthy();
        });

        it("should get item to be selected", () => {
            const model = moment();
            model.hour(1).minute(0).second(0);
            componentInstance.innerModel = model;
            const selectedItem = componentInstance.getItemToSelect();
            expect(selectedItem?.title.hour()).toBe(model.hour());
        });

        describe("should check corner cases of time selection", () => {
            it("should check 23:59 case", () => {
                fixture.detectChanges();

                const model = moment();
                model.hour(23).minute(59).second(0);
                componentInstance.innerModel = model;
                const expectedModelToReturn = moment();
                expectedModelToReturn.hour(0).minute(0).second(0);
                const selectedItem = componentInstance.getItemToSelect();
                expect(selectedItem?.title.hour()).toBe(
                    expectedModelToReturn.hour()
                );
            });

            it("should check 00:01 case", () => {
                fixture.detectChanges();

                const secondModel = moment();
                secondModel.hour(0).minute(1).second(0);
                componentInstance.innerModel = secondModel;
                const expectedSecondModelToReturn = moment();
                expectedSecondModelToReturn.hour(0).minute(0).second(0);
                const secondSelectedItem = componentInstance.getItemToSelect();
                expect(secondSelectedItem?.title.hour()).toBe(
                    expectedSecondModelToReturn.hour()
                );
            });
        });

        describe("localization", () => {
            it("should format 12-hour locales correctly", () => {
                fixture.detectChanges();

                componentInstance.model = moment().hour(1).minute(0);
                expect(componentInstance.textbox.value).toEqual("1:00 AM");
            });

            it("should format 24-hour locales correctly", () => {
                fixture.detectChanges();

                const oldLocale = moment.locale();
                moment.locale("en-gb");
                componentInstance.model = moment().hour(1).minute(0);
                expect(componentInstance.textbox.value).toEqual("01:00");

                // restore locale
                moment.locale(oldLocale);
            });
        });
    });

    describe("timepicker with reactive form >", () => {
        let fixture: ComponentFixture<TimePickerReactiveFormTestComponent>;
        let componentInstance: TimePickerReactiveFormTestComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule],
                declarations: [TimePickerReactiveFormTestComponent],
                providers: [
                    ToastService,
                    ToastContainerService,
                    NotificationService,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(
                TimePickerReactiveFormTestComponent
            );
            componentInstance = fixture.componentInstance;
        });

        it("should change selected item on 'timeChanged' event", () => {
            const testTime = "03:30 AM";
            componentInstance.valueChange(testTime);
            expect(
                moment(componentInstance.time.toString(), "HH:mm a")
            ).toEqual(moment(testTime, "HH:mm a"));
        });

        it("should validate form on submit, emit error toast if no value is selected and re-validate form on value selection", () => {
            spyOn(componentInstance.toastService, "error");
            componentInstance.ngOnInit();
            expect(componentInstance.myForm.valid).toEqual(false);
            componentInstance.onSubmit();
            expect(componentInstance.toastService.error).toHaveBeenCalled();
            const time = componentInstance.myForm.controls["testTimePicker"];
            time.setValue("03:30 AM");
            expect(componentInstance.myForm.valid).toEqual(true);
        });

        it("should validate form on submit and emit success toast if value is selected", () => {
            spyOn(componentInstance.toastService, "success");
            componentInstance.ngOnInit();
            expect(componentInstance.myForm.valid).toEqual(false);
            const time = componentInstance.myForm.controls["testTimePicker"];
            time.setValue("03:30 AM");
            expect(componentInstance.myForm.valid).toEqual(true);
            componentInstance.onSubmit();
            expect(componentInstance.toastService.success).toHaveBeenCalled();
        });
    });
});
