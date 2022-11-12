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

import { Component, OnInit, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import cloneDeep from "lodash/cloneDeep";
import noop from "lodash/noop";
import moment, { Moment } from "moment/moment";

import { NuiCommonModule } from "../../../common/common.module";
import { NuiButtonModule } from "../../button/button.module";
import { NuiDatePickerModule } from "../../date-picker/date-picker.module";
import { NuiDialogModule } from "../../dialog/dialog.module";
import { NuiIconModule } from "../../icon/icon.module";
import { NuiPopoverModule } from "../../popover/popover.module";
import {
    ITimeframe,
    ITimeFramePresetDictionary,
} from "../../time-frame-picker/public-api";
import { NuiTimeFramePickerModule } from "../../time-frame-picker/time-frame-picker.module";
import { NuiTimePickerModule } from "../../time-picker/time-picker.module";
import { NuiTooltipModule } from "../../tooltip/tooltip.module";
import { TimeFrameBarComponent } from "./time-frame-bar.component";

@Component({
    selector: "test-wrapper-component",
    template: `
        <nui-time-frame-bar
            [minDate]="minDate"
            [maxDate]="maxDate"
            [(timeFrame)]="timeFrame"
        >
            <nui-icon icon="calendar" class="pr-3"></nui-icon>
            {{ timeFrame | timeFrame }}
            <nui-quick-picker timeFrameSelection>
                <nui-time-frame-picker></nui-time-frame-picker>
            </nui-quick-picker>
        </nui-time-frame-bar>
    `,
})
class TestWrapperComponent implements OnInit {
    public minDate: Moment;
    public maxDate: Moment;
    public timeFrame: ITimeframe;

    public baseDate = moment([2018, 5, 1, 15, 0, 0]);

    public ngOnInit() {
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = this.baseDate.clone().add(1, "months");

        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
            // @ts-ignore
            selectedPresetId: null,
        };
    }
}

describe("convenience components >", () => {
    describe("time-frame-bar >", () => {
        let fixture: ComponentFixture<TestWrapperComponent>;
        let component: TimeFrameBarComponent;
        let warningSpy: jasmine.Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiButtonModule,
                    NuiCommonModule,
                    NuiDatePickerModule,
                    NuiDialogModule,
                    NuiIconModule,
                    NuiPopoverModule,
                    NuiTimeFramePickerModule,
                    NuiTimePickerModule,
                    NuiTooltipModule,
                ],
                declarations: [TimeFrameBarComponent, TestWrapperComponent],
                providers: [],
            });
            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;
            warningSpy = spyOnProperty(
                (<any>component).logger,
                "warn"
            ).and.returnValue(noop); // suppress warnings
            fixture.detectChanges();
        });

        describe("TimeFramePicker initialization", () => {
            it("should throw an error if no time frame picker is projected", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker = undefined;
                expect(() => component.ngAfterContentInit()).toThrow();
            });

            it("should log a warning if the user has set the minDate property on the time frame picker", () => {
                component.timeFramePicker.minDate = component.minDate;
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.maxDate = undefined;
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.startModel = undefined;
                component.ngAfterContentInit();
                expect(warningSpy).toHaveBeenCalled();
            });

            it("should log a warning if the user has set the maxDate property on the time frame picker", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.minDate = undefined;
                component.timeFramePicker.maxDate = component.maxDate;
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.startModel = undefined;
                component.ngAfterContentInit();
                expect(warningSpy).toHaveBeenCalled();
            });

            it("should log a warning if the user has set the minDate property on the time frame picker", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.minDate = undefined;
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.maxDate = undefined;
                component.timeFramePicker.startModel = component.timeFrame;
                component.ngAfterContentInit();
                expect(warningSpy).toHaveBeenCalled();
            });

            it("should set the time frame picker's properties", () => {
                expect(component.timeFramePicker.model).toBe(
                    component.pickerTimeframe
                ); // check for same instance
                expect(component.timeFramePicker.minDate).toBe(
                    component.minDate
                );
                expect(component.timeFramePicker.maxDate).toBe(
                    component.maxDate
                );
            });

            it("should invoke updatePickerTf on time frame picker changed event", () => {
                spyOn(component, "updatePickerTf");
                component.timeFramePicker.changed.emit(component.timeFrame);
                expect(
                    component.timeFramePicker.changed.observers.length
                ).toEqual(1);
                expect(component.updatePickerTf).toHaveBeenCalledWith(
                    component.timeFrame
                );
            });

            it("should unsubscribe from time frame picker changed event on time frame bar destroy", () => {
                expect(
                    component.timeFramePicker.changed.observers.length
                ).toEqual(1);
                component.ngOnDestroy();
                expect(
                    component.timeFramePicker.changed.observers.length
                ).toEqual(0);
            });
        });

        describe("QuickPicker initialization", () => {
            it("should set the quick picker's presets to the default time frame service presets if not specified", () => {
                expect(component.quickPicker.presets).toEqual(
                    component.timeframeService.getDefaultPresets()
                );
            });

            it("should use the quick picker's specified presets", () => {
                const testPresets: ITimeFramePresetDictionary = {
                    lastHour: {
                        name: "Last hour",
                        startDatetimePattern: { hours: -1 },
                        endDatetimePattern: {},
                    },
                };
                component.quickPicker.presets = cloneDeep(testPresets);
                component.ngAfterContentInit();
                expect(component.quickPicker.presets).toEqual(testPresets);
            });

            it("should set the quick picker's picker title to the default picker title if not specified", () => {
                expect(component.quickPicker.pickerTitle).toEqual(
                    component.defaultPickerTitle
                );
            });

            it("should use the quick picker's specified picker title", () => {
                const testTitle = "test title";
                component.quickPicker.pickerTitle = testTitle;
                component.ngAfterContentInit();
                expect(component.quickPicker.pickerTitle).toEqual(testTitle);
            });

            it("should invoke handlePresetSelection on quick picker presetSelected event", () => {
                spyOn(component, "handlePresetSelection");
                component.quickPicker.presetSelected.emit("samplePreset");
                expect(
                    component.quickPicker.presetSelected.observers.length
                ).toEqual(1);
                expect(component.handlePresetSelection).toHaveBeenCalledWith(
                    "samplePreset"
                );
            });

            it("should unsubscribe from quick picker presetSelected event on time frame bar destroy", () => {
                expect(
                    component.quickPicker.presetSelected.observers.length
                ).toEqual(1);
                component.ngOnDestroy();
                expect(
                    component.quickPicker.presetSelected.observers.length
                ).toEqual(0);
            });
        });

        describe("ngOnChanges", () => {
            it("should set isLeftMostRange to true when the minDate is reached", () => {
                expect(component.isLeftmostRange).toEqual(false);
                component.timeFrame = {
                    startDatetime: component.minDate,
                    endDatetime: fixture.componentInstance.baseDate.clone(),
                };
                component.ngOnChanges({
                    timeFrame: new SimpleChange(
                        null,
                        component.timeFrame,
                        true
                    ),
                });
                expect(component.isLeftmostRange).toEqual(true);
            });

            it("should set isRightmostRange to true when the maxDate is reached", () => {
                expect(component.isRightmostRange).toEqual(false);
                component.timeFrame = {
                    startDatetime: fixture.componentInstance.baseDate.clone(),
                    endDatetime: component.maxDate,
                };
                component.ngOnChanges({
                    timeFrame: new SimpleChange(
                        null,
                        component.timeFrame,
                        true
                    ),
                });
                expect(component.isRightmostRange).toEqual(true);
            });

            it("should update the picker time frame", () => {
                component.timeFrame = {
                    startDatetime: fixture.componentInstance.baseDate.clone(),
                    endDatetime: component.maxDate,
                };
                component.ngOnChanges({
                    timeFrame: new SimpleChange(
                        null,
                        component.timeFrame,
                        true
                    ),
                });
                expect(component.pickerTimeframe).toEqual(component.timeFrame);
                expect(component.pickerTimeframe).not.toBe(component.timeFrame); // check for clone
            });

            it("should set the humanized time frame", () => {
                expect(component.humanizedTimeframe).toEqual("7 days");
                component.timeFrame = {
                    startDatetime: fixture.componentInstance.baseDate.clone(),
                    endDatetime: component.maxDate,
                };
                component.ngOnChanges({
                    timeFrame: new SimpleChange(
                        null,
                        component.timeFrame,
                        true
                    ),
                });
                expect(component.humanizedTimeframe).toEqual("a month");
            });
        });

        describe("onPopoverShown", () => {
            it("should update the time frame picker's model", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.timeFramePicker.model = undefined;
                component.onPopoverShown();
                expect(component.timeFramePicker.model).toBeDefined();
                expect(component.timeFramePicker.model).toBe(
                    component.pickerTimeframe
                ); // check for same instance
            });

            it("should invoke markForCheck on the time frame picker's change detector", () => {
                const markForCheckSpy = spyOn(
                    component.timeFramePicker.changeDetector,
                    "markForCheck"
                );
                component.onPopoverShown();
                expect(markForCheckSpy).toHaveBeenCalled();
            });

            it("should update the quick picker's selected preset", () => {
                component.quickPicker.selectedPreset = undefined;
                component.onPopoverShown();
                expect(component.quickPicker.selectedPreset).toBeDefined();
                expect(component.quickPicker.selectedPreset).toEqual(
                    // @ts-ignore: Suppressing error for testing purposes
                    component.timeFrame.selectedPresetId
                );
            });

            it("should invoke markForCheck on the quick picker's change detector", () => {
                const markForCheckSpy = spyOn(
                    component.quickPicker.changeDetector,
                    "markForCheck"
                );
                component.onPopoverShown();
                expect(markForCheckSpy).toHaveBeenCalled();
            });
        });

        it("unzoom should emit the undo event", () => {
            spyOn(component.undo, "emit");
            component.onUndo();
            expect(component.undo.emit).toHaveBeenCalled();
        });

        it("reset should emit clear event", () => {
            spyOn(component.clear, "emit");
            component.onClear();
            expect(component.clear.emit).toHaveBeenCalled();
        });

        it("updatePickerTf should set the picker time frame and update the changed boolean", () => {
            const testTf: ITimeframe = {
                startDatetime: fixture.componentInstance.baseDate.clone(),
                endDatetime: component.maxDate,
            };
            component.changed = false;
            spyOn(component.timeframeService, "isEqual").and.returnValue(false);
            component.updatePickerTf(testTf);
            expect(component.pickerTimeframe).toEqual(testTf);
            expect(component.changed).toEqual(true);
        });

        describe("handlePresetSelection", () => {
            let getTimeframeByPresetIdSpy: jasmine.Spy;
            let closePopoverSpy: jasmine.Spy;

            beforeEach(() => {
                getTimeframeByPresetIdSpy = spyOn(
                    component.timeframeService,
                    "getTimeframeByPresetId"
                );
                closePopoverSpy = spyOn(component, "closePopover");
            });

            it("should set the picker time frame and invoke closePopover", () => {
                const testTf: ITimeframe = {
                    startDatetime: fixture.componentInstance.baseDate.clone(),
                    endDatetime: component.maxDate,
                };
                getTimeframeByPresetIdSpy.and.returnValue(testTf);
                component.handlePresetSelection("");
                expect(component.pickerTimeframe).toEqual(testTf);
            });

            it("should set the quick picker's preset to the specified value", () => {
                component.quickPicker.selectedPreset = "";
                component.handlePresetSelection("test_preset_key");
                expect(component.quickPicker.selectedPreset).toEqual(
                    "test_preset_key"
                );
            });

            it("should invoke markForCheck on the quick picker's change detector", () => {
                const markForCheckSpy = spyOn(
                    component.quickPicker.changeDetector,
                    "markForCheck"
                );
                component.handlePresetSelection("");
                expect(markForCheckSpy).toHaveBeenCalled();
            });

            it("should set the picker time frame and invoke closePopover", () => {
                component.handlePresetSelection("");
                expect(closePopoverSpy).toHaveBeenCalledWith(true);
            });
        });

        describe("closePopover", () => {
            it("should not change the time frame if not confirmed", () => {
                spyOn(<any>component, "changeTimeFrame");
                component.closePopover();
                expect((<any>component).changeTimeFrame).not.toHaveBeenCalled();
            });

            it("should change the time frame if confirmed", () => {
                component.pickerTimeframe = {
                    startDatetime: fixture.componentInstance.baseDate.clone(),
                    endDatetime: component.maxDate,
                };
                spyOn(<any>component, "changeTimeFrame").and.callThrough();
                component.closePopover(true);
                fixture.detectChanges();
                expect((<any>component).changeTimeFrame).toHaveBeenCalled();
                expect(component.timeFrame).toEqual(component.pickerTimeframe);
                expect(component.timeFrame).not.toBe(component.pickerTimeframe); // check for clone
            });

            it("should invoke next on the closePopoverSubject", () => {
                spyOn(component.closePopoverSubject, "next");
                component.closePopover();
                expect(component.closePopoverSubject.next).toHaveBeenCalled();
            });

            it("should reset the changed property", () => {
                component.changed = true;
                component.closePopover();
                expect(component.changed).toEqual(false);
            });
        });

        describe("shiftRange", () => {
            it("should shift the range left by emitting the timeFrameChange event with the correct output value", () => {
                spyOn(component.timeFrameChange, "emit");
                component.shiftRange(-1);
                expect(component.timeFrameChange.emit).toHaveBeenCalledWith(<
                    any
                >{
                    startDatetime:
                        fixture.componentInstance.timeFrame.startDatetime
                            .clone()
                            .subtract(1, "weeks"),
                    endDatetime: fixture.componentInstance.timeFrame.endDatetime
                        .clone()
                        .subtract(1, "weeks"),
                    selectedPresetId: null,
                });
            });

            it("should shift the range left by emitting the timeFrameChange event with the correct output value", () => {
                spyOn(component.timeFrameChange, "emit");
                component.shiftRange(1);
                expect(component.timeFrameChange.emit).toHaveBeenCalledWith(<
                    any
                >{
                    startDatetime:
                        fixture.componentInstance.timeFrame.startDatetime
                            .clone()
                            .add(1, "weeks"),
                    endDatetime: fixture.componentInstance.timeFrame.endDatetime
                        .clone()
                        .add(1, "weeks"),
                    selectedPresetId: null,
                });
            });
        });

        it("should invoke next on the destroy$ subject", () => {
            const nextSpy = spyOn((<any>component).destroy$, "next");
            component.ngOnDestroy();
            expect(nextSpy).toHaveBeenCalled();
        });
    });
});
