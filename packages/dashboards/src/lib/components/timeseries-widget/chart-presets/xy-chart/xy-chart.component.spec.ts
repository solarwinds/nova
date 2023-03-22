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

import { Component, SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus, IEvent } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartPalette,
    defaultPalette,
    IAccessors,
    IValueProvider,
    LineAccessors,
    SET_DOMAIN_EVENT,
    XYGrid,
    ZoomPlugin,
    LinearScale,
    IXYScales,
    TimeScale,
} from "@nova-ui/charts";
import {
    DATA_SOURCE,
    NuiDashboardsModule,
    INTERACTION,
    ISerializableTimeframe,
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetData,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
    SET_TIMEFRAME,
    TimeseriesInteractionType,
    XYChartComponent,
} from "@nova-ui/dashboards";

@Component({
    selector: "test-component",
    template: "",
})
class TestComponent extends XYChartComponent {
    public static lateLoadKey = "TestComponent";

    protected createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors {
        return new LineAccessors(colorProvider);
    }

    protected createChartAssist(palette: ChartPalette): ChartAssist {
        // @ts-ignore: Avoiding strict mode errors, keeping old flow
        return new ChartAssist(new Chart(new XYGrid()), null, palette);
    }
}

describe("XYChartComponent", () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    const eventBus = new EventBus<IEvent>();

    const getChart = (): Chart => component.chartAssist.chart as Chart;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        let initializationChanges: SimpleChanges;

        beforeEach(() => {
            initializationChanges = {
                widgetData: { isFirstChange: () => false } as SimpleChange,
                configuration: {
                    isFirstChange: () => false,
                    currentValue: {},
                } as SimpleChange,
            };
        });

        it("should invoke chartAssist.update", () => {
            component.widgetData = { series: [] };
            component.ngOnChanges(initializationChanges);
            const spy = spyOn(component.chartAssist, "update");
            component.ngOnChanges({
                widgetData: { isFirstChange: () => false } as SimpleChange,
            } as SimpleChanges);
            expect(spy).toHaveBeenCalled();
        });

        it("should re-instantiate the chart if there were no series to display in the previous change detection cycle", () => {
            spyOn(<any>component, "updateChartData");

            component.widgetData = { series: [] };
            component.ngOnChanges(initializationChanges);

            const originalChart = getChart();

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges({
                widgetData: { isFirstChange: () => false } as SimpleChange,
            } as SimpleChanges);

            expect(originalChart).not.toBe(getChart());
        });

        it("should not re-instantiate the chart if the widget data contained one or more series in the previous change detection cycle", () => {
            spyOn(<any>component, "updateChartData");

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges(initializationChanges);

            const originalChart = getChart();

            component.widgetData = { series: [{} as ITimeseriesWidgetData] };
            component.ngOnChanges({
                widgetData: { isFirstChange: () => false } as SimpleChange,
            } as SimpleChanges);

            expect(originalChart).toBe(getChart());
        });

        it("should initialize the chart assist with the default palette", () => {
            component.ngOnChanges(initializationChanges);
            expect(
                component.chartAssist.palette.standardColors.get("testEntityId")
            ).toEqual(defaultPalette().standardColors.get("testEntityId"));
        });

        it("should initialize the chart assist with the configured colors", () => {
            component.configuration = {
                chartColors: ["blue"],
            } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(
                component.chartAssist.palette.standardColors.get("testEntityId")
            ).toEqual("blue");
        });

        it("should not add the zoom plugin if zoom is disabled", () => {
            component.configuration = {
                enableZoom: false,
            } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(getChart().hasPlugin(ZoomPlugin)).toEqual(false);
        });

        it("should add the zoom plugin if zoom is enabled", () => {
            component.configuration = {
                enableZoom: true,
            } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(getChart().hasPlugin(ZoomPlugin)).toEqual(true);
        });

        it("should subscribe to the SET_DOMAIN event", () => {
            const timeframe: ISerializableTimeframe = {
                startDatetime: "2019-11-11T18:09:03-06:00",
                endDatetime: "2019-11-18T18:09:03-06:00",
                selectedPresetId: undefined,
            };
            component.ngOnChanges(initializationChanges);
            const spy = spyOn(eventBus.getStream(SET_TIMEFRAME), "next");
            getChart()
                .getEventBus()
                .getStream(SET_DOMAIN_EVENT)
                .next({
                    data: {
                        myScaleId: [
                            timeframe.startDatetime,
                            timeframe.endDatetime,
                        ],
                    },
                });
            expect(spy).toHaveBeenCalledWith({ payload: timeframe });
        });
    });

    describe("onPrimaryDescClick", () => {
        const initializationChanges = {
            widgetData: { isFirstChange: () => false } as SimpleChange,
            configuration: {
                isFirstChange: () => false,
                currentValue: {},
            } as SimpleChange,
        };

        it("should communicate interaction on the EventBus when series is interactive", () => {
            const spy = spyOn(
                eventBus.getStream(INTERACTION),
                "next"
            ).and.callThrough();
            component.configuration = {
                interaction: "series",
            } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            component.onPrimaryDescClick(
                { stopPropagation: () => null } as any,
                component.chartAssist.legendSeriesSet[0]
            );
            const interactionData = {
                payload: {
                    data: component.chartAssist.legendSeriesSet[0],
                    interactionType: TimeseriesInteractionType.Series,
                },
                id: "INTERACTION",
            };
            expect(spy).toHaveBeenCalledWith(interactionData);
        });
    });

    describe("mapSeriesSet", () => {
        let data: any[];
        let scales: IXYScales;
        beforeEach(() => {
            data = [
                {
                    data: [],
                    description: "XXXXX",
                    id: "id1",
                    metricUnits: "bytes",
                    name: "Total Memory",
                },
            ];
            scales = {
                x: new TimeScale(),
                y: new LinearScale(),
            };
        });

        it("should use yscale if yRight scale is not provided", () => {
            const res = component.mapSeriesSet(data, scales);

            expect(res[0].scales.y).toEqual(scales.y);
        });

        it("should map y-scale acording to scale units and data metric units", () => {
            scales.yRight = new LinearScale();
            scales.y.scaleUnits = "percent";
            scales.yRight.scaleUnits = "bytes";
            const res = component.mapSeriesSet(data, scales);

            expect(res[0].scales.y).toEqual(scales.yRight);
        });

        it("should map to generic y-scale if its provided and data metric units are different than other y-scale", () => {
            scales.yRight = new LinearScale();
            scales.y.scaleUnits = "percent";
            scales.yRight.scaleUnits = "generic";
            const res = component.mapSeriesSet(data, scales);

            expect(res[0].scales.y).toEqual(scales.yRight);
        });

        it("should map each metric unit to different y-scale if multiple data are provided", () => {
            data = [
                ...data,
                {
                    data: [],
                    description: "XXXXX",
                    id: "id2",
                    metricUnits: "percent",
                    name: "Average CPU Load",
                },
            ];

            scales.yRight = new LinearScale();
            scales.y.scaleUnits = "percent";
            scales.yRight.scaleUnits = "bytes";
            const res = component.mapSeriesSet(data, scales);

            expect(res[0].scales.y).toEqual(scales.yRight);
            expect(res[1].scales.y).toEqual(scales.y);
        });
    });
});
