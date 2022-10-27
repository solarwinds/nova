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

import { ChangeDetectorRef, DebugElement } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import moment from "moment/moment";

import { NuiCommonModule } from "../../common/common.module";
import { NuiDateTimePickerModule } from "../date-time-picker/date-time-picker.module";
import { NuiMenuModule } from "../menu/menu.module";
import { ITimeframe, ITimeFramePreset } from "./public-api";
import { QuickPickerComponent } from "./quick-picker/quick-picker.component";
import { TimeframeService } from "./services/timeframe.service";
import { TimeFrameFormatPipe } from "./time-frame-format.pipe";
import { TimeFramePickerComponent } from "./time-frame-picker.component";

describe("components >", () => {
    describe("time frame picker inline >", () => {
        let fixture: ComponentFixture<TimeFramePickerComponent>;
        let componentInstance: TimeFramePickerComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiCommonModule,
                    NuiMenuModule,
                    NuiDateTimePickerModule,
                ],
                declarations: [
                    QuickPickerComponent,
                    TimeFramePickerComponent,
                    TimeFrameFormatPipe,
                ],
                providers: [TimeframeService, ChangeDetectorRef],
            });

            fixture = TestBed.createComponent(TimeFramePickerComponent);
            componentInstance = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });

        describe("when selectPreset() is executed", () => {
            it("it set model based on selected preset", () => {
                // act
                componentInstance.selectPreset("last12Hours", <
                    ITimeFramePreset
                >{
                    name: "Last 12 hours",
                    startDatetimePattern: { hours: -12 },
                    endDatetimePattern: {},
                });

                // assert
                expect(componentInstance.model.selectedPresetId).toEqual(
                    "last12Hours"
                );
                expect(componentInstance.model.startDatetime).toBeDefined();
                expect(componentInstance.model.endDatetime).toBeDefined();
                expect(
                    moment(componentInstance.model.startDatetime).isSame(
                        moment(componentInstance.model.endDatetime).add({
                            hours: -12,
                        }),
                        "second"
                    )
                ).toBe(true);
            });
        });

        describe("when onChangeInternal() is executed", () => {
            it("it should clear 'selectedPresetId' and 'title' if any preset was used", () => {
                // arrange
                componentInstance.model = <ITimeframe>{
                    startDatetime: moment("2012-08-08T13:00:00.000Z"),
                    endDatetime: moment("2015-07-07T13:00:00.000Z"),
                    selectedPresetId: "lastHour",
                };

                // act
                componentInstance.onChangeInternalStart(
                    componentInstance.model.startDatetime
                );

                // assert
                expect(componentInstance.model.title).toBeUndefined();
                expect(
                    componentInstance.model.selectedPresetId
                ).toBeUndefined();
            });
        });

        describe("when start-date set is changed", () => {
            it("to later than end-date it updates end-date keeping the previous distance without any preset", () => {
                const baseDate = moment("2015-08-08T00:00:00.000Z");
                componentInstance.model = <ITimeframe>{
                    startDatetime: baseDate.clone(),
                    endDatetime: baseDate.clone().add(25, "hours"),
                };
                componentInstance.onChangeInternalEnd(
                    componentInstance.model.endDatetime
                );
                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    25
                ); // each hour has 3600000 ms

                // change the startDate to be startDate + 48 hours
                componentInstance.model.startDatetime = baseDate
                    .clone()
                    .add(48, "hours");
                componentInstance.onChangeInternalStart(
                    componentInstance.model.startDatetime
                );

                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    25
                ); // each hour has 3600000 ms
                expect(
                    componentInstance.model.endDatetime.isSame(
                        baseDate.add(48 + 25, "hours")
                    )
                ).toBe(true);

                expect(componentInstance.model.title).toBeUndefined();
                expect(
                    componentInstance.model.selectedPresetId
                ).toBeUndefined();
            });

            it("to later than end-date it should clear 'selectedPresetId' and 'title' if any preset was used", () => {
                componentInstance.selectPreset("last24Hours", <
                    ITimeFramePreset
                >{
                    name: "Last 24 hours",
                    startDatetimePattern: { hours: -24 },
                    endDatetimePattern: {},
                });

                expect(componentInstance.model.selectedPresetId).toEqual(
                    "last24Hours"
                );
                expect(componentInstance.model.startDatetime).toBeDefined();
                expect(componentInstance.model.endDatetime).toBeDefined();
                expect(
                    moment(componentInstance.model.startDatetime).isSame(
                        moment(componentInstance.model.endDatetime).add({
                            hours: -24,
                        }),
                        "second"
                    )
                ).toBe(true);

                // change the startDate to be endDatetime + 48 hours
                componentInstance.model.startDatetime = moment(
                    componentInstance.model.endDatetime
                ).add(48, "hours");
                componentInstance.onChangeInternalStart(
                    componentInstance.model.startDatetime
                );

                expect(componentInstance.model.title).toBeUndefined();
                expect(
                    componentInstance.model.selectedPresetId
                ).toBeUndefined();
            });

            it("to exactly the end-date it updates end-date keeping the previous distance", () => {
                const baseDate = moment("2015-08-08T13:00:00.000Z");
                componentInstance.model = <ITimeframe>{
                    startDatetime: baseDate.clone(),
                    endDatetime: baseDate.clone().add(25, "hours"),
                };
                componentInstance.onChangeInternalEnd(
                    componentInstance.model.endDatetime
                );
                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    25
                ); // each hour has 3600000 ms

                // change the startDate to be the EndDate (startDate + 25 hours)
                componentInstance.model.startDatetime =
                    componentInstance.model.endDatetime;
                componentInstance.onChangeInternalStart(
                    componentInstance.model.startDatetime
                );

                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    25
                ); // each hour has 3600000 ms
                expect(
                    componentInstance.model.endDatetime.isSame(
                        baseDate.add(25 + 25, "hours")
                    )
                ).toBe(true);
            });
            it("to before the end-date it updates the distance between both dates", () => {
                const baseDate = moment("2015-08-08T13:00:00.000Z");
                componentInstance.model = <ITimeframe>{
                    startDatetime: baseDate.clone(),
                    endDatetime: baseDate.clone().add(25, "hours"),
                };
                componentInstance.onChangeInternalEnd(
                    componentInstance.model.endDatetime
                );
                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    25
                ); // each hour has 3600000 ms

                // change the startDate to 48 hours before itself
                componentInstance.model.startDatetime = baseDate
                    .clone()
                    .add(-48, "hours");
                componentInstance.onChangeInternalStart(
                    componentInstance.model.startDatetime
                );

                expect(componentInstance.distanceToEndDate / 3600000).toEqual(
                    48 + 25
                ); // each hour has 3600000 ms
                expect(
                    componentInstance.model.endDatetime.isSame(
                        baseDate.clone().add(25, "hours")
                    )
                ).toBeTruthy();
            });
        });

        describe("deleting input value", () => {
            it("should shift end date after removing and re-selecting start value", fakeAsync(() => {
                componentInstance.startModel = <ITimeframe>{
                    startDatetime: moment("2019-08-12T13:00:00.000Z"),
                    endDatetime: moment("2019-08-16T13:00:00.000Z"),
                };
                componentInstance.ngOnInit();
                fixture.detectChanges();

                const startDatePicker = debugElement.query(
                    By.css(
                        ".nui-time-frame-picker__date-time_start nui-date-time-picker"
                    )
                );
                const startDatePickerInput = startDatePicker.query(
                    By.css("nui-textbox input")
                );

                startDatePickerInput.nativeElement.value = "";
                // Must dispatch an event for angular to capture this
                const event = new KeyboardEvent("keyup", {
                    bubbles: true,
                    cancelable: true,
                    shiftKey: false,
                });
                startDatePickerInput.nativeElement.dispatchEvent(event);
                // observable has debounceTime(500)
                tick(501);
                fixture.detectChanges();

                // Do not use clicking approach because there's no stable unique css selector for
                // button - _.uniqueId is used
                const august28Date = moment("2019-08-28");
                componentInstance.onChangeInternalStart(august28Date);
                fixture.detectChanges();

                expect(
                    componentInstance.model.startDatetime.format("YYYY-MM-DD")
                ).toEqual("2019-08-28");
                expect(
                    componentInstance.model.endDatetime.format("YYYY-MM-DD")
                ).toEqual("2019-09-01");
            }));
        });
    });
});
