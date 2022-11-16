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

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import moment from "moment/moment";
import { Subject } from "rxjs";

import {
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
    ITimeframe,
    TimeFrameBarComponent,
} from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DynamicComponentCreator,
    ISerializableTimeframe,
    NuiDashboardsModule,
    PIZZAGNA_EVENT_BUS,
    PizzagnaLayer,
    PizzagnaService,
    ProviderRegistryService,
    REFRESH,
    SET_TIMEFRAME,
    TimeframeSelectionComponent,
    TimeframeSerializationService,
} from "@nova-ui/dashboards";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();
    public filterParticipants: IFilteringParticipants;

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {
        // @ts-ignore: Suppressed for test purposes
        this.filterParticipants = components;
    }

    public deregisterComponent(componentKey: string): void {
        delete this.filterParticipants?.[componentKey];
    }
}

describe("TimeframeSelectionComponent", () => {
    let component: TimeframeSelectionComponent;
    let timeframeBar: TimeFrameBarComponent;
    let fixture: ComponentFixture<TimeframeSelectionComponent>;
    const tfSerializationService = new TimeframeSerializationService();
    const eventBus = new EventBus<IEvent>();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(
        eventBus,
        dynamicComponentCreator
    );
    const dataSource = new MockDataSource();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: dataSource,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TimeframeSelectionComponent);
        component = fixture.componentInstance;
        component.componentId = "timeframeSelection";
        const timeframBarDE = fixture.debugElement.query(
            By.directive(TimeFrameBarComponent)
        );
        timeframeBar = timeframBarDE.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should update the currentTimeframe", () => {
            const testTimeframe: ISerializableTimeframe = {
                startDatetime: moment("2019-11-11T18:09:03-06:00").format(),
                endDatetime: moment("2019-11-18T18:09:03-06:00").format(),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.timeframe = testTimeframe;
            component.ngOnChanges({
                timeframe: { isFirstChange: () => true } as SimpleChange,
            });
            expect(component.currentTimeframe).toEqual(
                tfSerializationService.convertFromSerializable(testTimeframe)
            );
        });

        it("should update the startDatetime and endDatetime according to the selectedPresetId", () => {
            const testTimeframe = {
                selectedPresetId: "last7Days",
            } as ISerializableTimeframe;
            component.timeframe = testTimeframe;
            component.ngOnChanges({
                timeframe: { isFirstChange: () => true } as SimpleChange,
            });
            expect(component.currentTimeframe.startDatetime).toBeDefined();
            expect(component.currentTimeframe.endDatetime).toBeDefined();
        });

        it("should populate the timeframe's title", () => {
            const testTimeframe = {
                selectedPresetId: "last7Days",
            } as ISerializableTimeframe;
            component.timeframe = testTimeframe;
            component.ngOnChanges({
                timeframe: { isFirstChange: () => true } as SimpleChange,
            });
            expect(component.currentTimeframe.title).toEqual("Last 7 days");
        });

        it("should not invoke eventBus REFRESH if it's the first timeframe change", () => {
            const testTimeframe = {
                selectedPresetId: "last7Days",
            } as ISerializableTimeframe;
            component.timeframe = testTimeframe;
            const refreshSpy = spyOn(
                (<any>component).eventBus.getStream(REFRESH),
                "next"
            );
            component.ngOnChanges({
                timeframe: { isFirstChange: () => true } as SimpleChange,
            });
            expect(refreshSpy).not.toHaveBeenCalled();
        });

        it("should invoke eventBus REFRESH if it's not the first timeframe change", () => {
            const testTimeframe = {
                selectedPresetId: "last7Days",
            } as ISerializableTimeframe;
            component.timeframe = testTimeframe;
            const refreshSpy = spyOn(
                (<any>component).eventBus.getStream(REFRESH),
                "next"
            );
            component.ngOnChanges({
                timeframe: { isFirstChange: () => false } as SimpleChange,
            });
            expect(refreshSpy).toHaveBeenCalled();
        });

        it("should transform minDate and maxDate to moments", () => {
            const testMinDate = moment("2019-11-11T18:09:03-06:00").format();
            const testMaxDate = moment("2019-11-18T18:09:03-06:00").format();
            component.minDate = testMinDate;
            component.maxDate = testMaxDate;
            component.ngOnChanges({
                minDate: {} as SimpleChange,
                maxDate: {} as SimpleChange,
            });
            expect(component.minDateAsMoment).toEqual(
                moment(testMinDate, moment.defaultFormat)
            );
            expect(component.maxDateAsMoment).toEqual(
                moment(testMaxDate, moment.defaultFormat)
            );
        });
    });

    describe("ngOnInit > ", () => {
        it("should invoke history.restart with the currentTimeframe", () => {
            const spy = spyOn(component.history, "restart");
            component.currentTimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnInit();
            expect(spy).toHaveBeenCalledWith(component.currentTimeframe);
        });

        it("should invoke history.save with the SET_TIMEFRAME payload", () => {
            const testTimeframe: ISerializableTimeframe = {
                startDatetime: moment("2019-11-11T18:09:03-06:00").format(),
                endDatetime: moment("2019-11-18T18:09:03-06:00").format(),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.currentTimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnInit();
            const spy = spyOn(component.history, "save").and.callThrough();
            eventBus.getStream(SET_TIMEFRAME).next({ payload: testTimeframe });
            expect(spy).toHaveBeenCalledWith(
                tfSerializationService.convertFromSerializable(testTimeframe)
            );
        });

        it("should not invoke PizzagnaService.setProperty on SET_TIMEFRAME if the timeframe hasn't changed", () => {
            const testStartDatetime = "2019-11-11T18:09:03-06:00";
            const testEndDatetetime = "2019-11-18T18:09:03-06:00";
            const testTimeframe: ISerializableTimeframe = {
                startDatetime: moment(testStartDatetime).format(),
                endDatetime: moment(testEndDatetetime).format(),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
                title: undefined,
            };
            component.currentTimeframe = {
                startDatetime: moment(testStartDatetime, moment.defaultFormat),
                endDatetime: moment(testEndDatetetime, moment.defaultFormat),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnInit();
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(SET_TIMEFRAME).next({ payload: testTimeframe });
            expect(spy).not.toHaveBeenCalled();
        });

        it("should use the PizzagnaService to update the timeframe property", () => {
            const testStartDatetime = "2019-11-11T18:09:03-05:00";
            const testEndDatetetime = "2019-11-18T18:09:03-05:00";
            const testTimeframe: ISerializableTimeframe = {
                startDatetime: moment(testStartDatetime).format(),
                endDatetime: moment(testEndDatetetime).format(),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: "",
                title: undefined,
            };
            component.currentTimeframe = {
                startDatetime: moment(testStartDatetime, moment.defaultFormat),
                endDatetime: moment(
                    testEndDatetetime,
                    moment.defaultFormat
                ).add(1, "hour"),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnInit();
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(SET_TIMEFRAME).next({ payload: testTimeframe });
            expect(spy).toHaveBeenCalledWith(
                {
                    pizzagnaKey: PizzagnaLayer.Data,
                    componentId: component.componentId,
                    propertyPath: ["timeframe"],
                },
                testTimeframe
            );
        });

        it("register the component as a filtering participant", () => {
            component.currentTimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.ngOnInit();
            expect(
                dataSource.filterParticipants.timeframe.componentInstance.getFilters()
            ).toEqual({ type: "timeframe", value: component.currentTimeframe });
        });
    });

    describe("undo emission from TimeFrameBarComponent", () => {
        it("should trigger history.undo and onTimeframeChange", () => {
            const undoSpy = spyOn(component.history, "undo");
            const tfChangeSpy = spyOn(component, "onTimeframeChange");
            timeframeBar.undo.emit();
            expect(undoSpy).toHaveBeenCalled();
            expect(tfChangeSpy).toHaveBeenCalled();
        });
    });

    describe("clear emission TimeFrameBarComponent", () => {
        it("should trigger history.restart and onTimeframeChange", () => {
            const restartSpy = spyOn(component.history, "restart");
            const tfChangeSpy = spyOn(component, "onTimeframeChange");
            timeframeBar.clear.emit();
            expect(restartSpy).toHaveBeenCalledWith();
            expect(tfChangeSpy).toHaveBeenCalled();
        });
    });

    describe("timeFrameChange emission TimeFrameBarComponent", () => {
        it("should trigger history.restart and onTimeframeChange", () => {
            const timeframe: ITimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            const restartSpy = spyOn(component.history, "restart");
            const tfChangeSpy = spyOn(component, "onTimeframeChange");
            timeframeBar.timeFrameChange.emit(timeframe);
            expect(restartSpy).toHaveBeenCalledWith(timeframe);
            expect(tfChangeSpy).toHaveBeenCalled();
        });
    });

    describe("onTimeframeChange", () => {
        it("should invoke PizzagnaService.setProperty", () => {
            const timeframe: ITimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: "",
            };
            const spy = spyOn(pizzagnaService, "setProperty");
            component.onTimeframeChange(timeframe);
            expect(spy).toHaveBeenCalledWith(
                {
                    pizzagnaKey: PizzagnaLayer.Data,
                    componentId: component.componentId,
                    propertyPath: ["timeframe"],
                },
                tfSerializationService.convertToSerializable(timeframe)
            );
        });

        it("should not invoke PizzagnaService.setProperty if the timeframe hasn't changed", () => {
            const timeframe: ITimeframe = {
                startDatetime: moment(
                    "2019-11-11T18:09:03-06:00",
                    moment.defaultFormat
                ),
                endDatetime: moment(
                    "2019-11-18T18:09:03-06:00",
                    moment.defaultFormat
                ),
                // @ts-ignore: Suppressed for test purposes
                selectedPresetId: null,
            };
            component.currentTimeframe = timeframe;
            const spy = spyOn(pizzagnaService, "setProperty");
            component.onTimeframeChange(timeframe);
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
