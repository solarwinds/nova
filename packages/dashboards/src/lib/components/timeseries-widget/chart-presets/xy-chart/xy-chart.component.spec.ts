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
    IXYScales,
    LineAccessors,
    LinearScale,
    SET_DOMAIN_EVENT,
    stackedAreaAccessors,
    TimeScale,
    TimeseriesZoomPlugin,
    XYGrid,
} from "@nova-ui/charts";

import { XYChartComponent } from "./xy-chart.component";
import { NuiDashboardsModule } from "../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../services/provider-registry.service";
import {
    CHART_METRIC_REMOVE,
    INTERACTION,
    SET_TIMEFRAME,
} from "../../../../services/types";
import {
    DATA_SOURCE,
    ISerializableTimeframe,
    PIZZAGNA_EVENT_BUS,
} from "../../../../types";
import {
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetData,
    TimeseriesChartPreset,
    TimeseriesInteractionType,
    TimeseriesScaleType,
    TimeseriesTransformer,
    TimeseriesWidgetProjectType,
} from "../../types";

@Component({
    selector: "test-component",
    template: "",
    standalone: false,
})
class TestComponent extends XYChartComponent {
    public static lateLoadKey = "TestComponent";

    public zoomPlugins = [new TimeseriesZoomPlugin()];

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
            expect(getChart().hasPlugin(TimeseriesZoomPlugin)).toEqual(false);
        });

        it("should add the zoom plugin if zoom is enabled", () => {
            component.configuration = {
                enableZoom: true,
            } as ITimeseriesWidgetConfig;
            component.ngOnChanges(initializationChanges);
            expect(getChart().hasPlugin(TimeseriesZoomPlugin)).toEqual(true);
        });

        it("should subscribe to the SET_DOMAIN event", () => {
            const timeframe: ISerializableTimeframe = {
                startDatetime: "2019-11-11T18:09:03-06:00",
                endDatetime: "2019-11-18T18:09:03-06:00",
                // @ts-ignore: Suppressed for test purposes
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

    describe("getLegendValue", () => {
        beforeEach(() => {
            component.ngOnChanges({
                configuration: {
                    isFirstChange: () => false,
                    currentValue: {},
                } as SimpleChange,
            });
            component.configuration = {
                projectType: TimeseriesWidgetProjectType.PerfstackApp,
                preset: TimeseriesChartPreset.StackedArea,
                units: "percent",
            } as ITimeseriesWidgetConfig;
            component.widgetData = {
                series: [
                    {
                        id: "cpu",
                        name: "CPU",
                        description: "",
                        data: [{ x: 1, y: 2.5 }],
                        legendValueMultiplier: 16,
                    },
                    {
                        id: "remaining",
                        name: "Remaining",
                        description: "",
                        data: [{ x: 1, y: 2.5 }],
                        legendValueMultiplier: 8,
                    },
                ],
                summarySerie: {
                    id: "summary",
                    name: "Summary",
                    description: "",
                    data: [],
                },
            };
            const yScale = component.timeseriesScalesService.getScale(
                {
                    type: TimeseriesScaleType.Linear,
                    properties: { axisUnits: "percent" },
                },
                "percent",
                component.configuration
            );
            const mappedSeries = component.mapSeriesSet(
                component.widgetData.series,
                { x: new TimeScale(), y: yScale }
            );
            mappedSeries[0].accessors = stackedAreaAccessors();
            mappedSeries[1].accessors = stackedAreaAccessors();
            spyOn(component.chartAssist.chart, "update");
            component.chartAssist.update(mappedSeries);
            const [cpu, remaining] = component.chartAssist.legendSeriesSet;
            component.chartAssist.highlightedDataPoints = {
                cpu: {
                    seriesId: cpu.id,
                    dataSeries: cpu,
                    index: 0,
                    data: cpu.data[0],
                },
                remaining: {
                    seriesId: remaining.id,
                    dataSeries: remaining,
                    index: 0,
                    data: remaining.data[0],
                },
            };
            spyOn(
                component.chartAssist,
                "getHighlightedValue"
            ).and.callThrough();
        });

        it("uses the matching widget series multiplier, not the legend count or position", () => {
            const [cpu, remaining] = component.chartAssist.legendSeriesSet;

            expect(component.getLegendValue(remaining, "y1")).toEqual("20 %");
            expect(component.getLegendValue(cpu, "y1")).toEqual("40 %");
            expect(
                component.chartAssist.getHighlightedValue
            ).toHaveBeenCalledWith(cpu, "y", undefined, "y1");
        });

        it("multiplies the raw CPU value before formatting", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            cpu.data[0].y = 37 / 16;
            cpu.data[0].__stack_y = { start: 10, end: 15 };

            expect(
                component.chartAssist.getHighlightedValue(
                    cpu,
                    "y",
                    "tick",
                    "y1"
                )
            ).toEqual(`${(2.3).toLocaleString()} %`);
            expect(component.getLegendValue(cpu, "y1")).toEqual("37 %");
        });

        it("formats the raw Remaining sum without floating-point noise", () => {
            const remaining = component.chartAssist.legendSeriesSet[1];
            remaining.data[0].y = (7 * 50) / 16;
            component.widgetData.series[1].legendValueMultiplier = 16 / 7;

            expect(component.getLegendValue(remaining, "y1")).toEqual("50 %");
            remaining.data[0].y = 216 / 16;
            expect(component.getLegendValue(remaining, "y1")).toEqual(
                `${(30.9).toLocaleString()} %`
            );
        });

        it("preserves missing values when a series multiplier is provided", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            for (const projectType of [
                TimeseriesWidgetProjectType.PerfstackApp,
                TimeseriesWidgetProjectType.ModernDashboard,
                undefined,
            ]) {
                component.configuration.projectType = projectType;
                for (const value of [undefined, null]) {
                    cpu.data[0].y = value;
                    expect(component.getLegendValue(cpu, "y1"))
                        .withContext(
                            `projectType: ${projectType}, value: ${value}`
                        )
                        .toBeUndefined();
                }

                cpu.data[0].y = 0;
                expect(component.getLegendValue(cpu, "y1"))
                    .withContext(`projectType: ${projectType}, value: 0`)
                    .toEqual("0 %");
            }

            const highlightedPoint =
                component.chartAssist.highlightedDataPoints[cpu.id];
            delete component.chartAssist.highlightedDataPoints[cpu.id];
            expect(component.getLegendValue(cpu, "y1")).toBeUndefined();
            component.chartAssist.highlightedDataPoints[cpu.id] =
                highlightedPoint;
            cpu.data = [];
            expect(component.getLegendValue(cpu, "y1")).toBeUndefined();
        });

        it("preserves the zero fallback for missing legacy PerfStack values", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            component.widgetData.series[0].legendValueMultiplier = undefined;
            cpu.data[0].y = undefined;
            expect(component.getLegendValue(cpu, "y1")).toEqual("0 %");
            cpu.data[0].y = null;
            expect(component.getLegendValue(cpu, "y1")).toEqual("0 %");
            delete component.chartAssist.highlightedDataPoints[cpu.id];
            expect(component.getLegendValue(cpu, "y1")).toEqual("0 %");
        });

        it("falls back to the old percent suffix if no tick formatter exists", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            cpu.scales.y.formatters.tick = undefined;

            expect(component.getLegendValue(cpu, "y1")).toEqual("40 %");
        });

        it("excludes the summary from the legend series count", () => {
            expect(
                component.chartAssist.legendSeriesSet.map((s) => s.id)
            ).toEqual(["cpu", "remaining"]);
        });

        it("uses the legend count when the matching multiplier is absent or invalid", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            for (const multiplier of [
                undefined,
                0,
                -1,
                NaN,
                Infinity,
                -Infinity,
            ]) {
                component.widgetData.series[0].legendValueMultiplier =
                    multiplier;
                expect(component.getLegendValue(cpu, "y1"))
                    .withContext(`multiplier: ${multiplier}`)
                    .toEqual("5 %");
            }
        });

        it("uses the legend count if there is no matching widget series", () => {
            component.widgetData.series = [];
            expect(
                component.getLegendValue(
                    component.chartAssist.legendSeriesSet[0],
                    "y1"
                )
            ).toEqual("5 %");
        });

        it("applies a valid series multiplier for any project type", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            const remaining = component.chartAssist.legendSeriesSet[1];
            cpu.data[0].y = 37 / 16;
            remaining.data[0].y = (7 * 50) / 16;
            component.widgetData.series[1].legendValueMultiplier = 16 / 7;

            for (const projectType of [
                TimeseriesWidgetProjectType.PerfstackApp,
                TimeseriesWidgetProjectType.ModernDashboard,
                undefined,
            ]) {
                component.configuration.projectType = projectType;
                expect(component.getLegendValue(cpu, "y1"))
                    .withContext(`projectType: ${projectType}`)
                    .toEqual("37 %");
                expect(component.getLegendValue(remaining, "y1"))
                    .withContext(`projectType: ${projectType}`)
                    .toEqual("50 %");
            }
        });

        it("does not use the legacy legend-count fallback for other projects", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            component.configuration.projectType =
                TimeseriesWidgetProjectType.ModernDashboard;

            for (const multiplier of [
                undefined,
                0,
                -1,
                NaN,
                Infinity,
                -Infinity,
            ]) {
                component.widgetData.series[0].legendValueMultiplier =
                    multiplier;
                expect(component.getLegendValue(cpu, "y1"))
                    .withContext(`multiplier: ${multiplier}`)
                    .toEqual("2.5 %");
            }
            component.widgetData.series = [];
            expect(component.getLegendValue(cpu, "y1")).toEqual("2.5 %");
            expect(
                component.chartAssist.getHighlightedValue
            ).toHaveBeenCalledWith(cpu, "y", "tick", "y1");
        });

        it("does not apply the multiplier for other presets or units", () => {
            const cpu = component.chartAssist.legendSeriesSet[0];
            const defaultConfig = component.configuration;
            const configurations = [
                { ...defaultConfig, preset: TimeseriesChartPreset.Line },
                {
                    ...defaultConfig,
                    preset: TimeseriesChartPreset.StackedPercentageArea,
                },
                { ...defaultConfig, units: "bytes" as const },
                {
                    ...defaultConfig,
                    preset: TimeseriesChartPreset.Line,
                    projectType: TimeseriesWidgetProjectType.ModernDashboard,
                },
                {
                    ...defaultConfig,
                    units: "bytes" as const,
                    projectType: TimeseriesWidgetProjectType.ModernDashboard,
                },
            ];
            for (const configuration of configurations) {
                component.configuration = configuration;
                expect(component.getLegendValue(cpu, "y1"))
                    .withContext(JSON.stringify(configuration))
                    .toEqual("2.5 %");
            }
        });
    });

    describe("legend menu", () => {
        beforeEach(() => {
            component.widgetData.series = [
                {
                    id: "42",
                    transformer: undefined,
                    data: [
                        {
                            x: "1",
                            y: 1,
                        },
                        {
                            x: "2",
                            y: 10,
                        },
                        {
                            x: "3",
                            y: 3,
                        },
                        {
                            x: "4",
                            y: 16,
                        },
                        {
                            x: "5",
                            y: 17,
                        },
                        {
                            x: "6",
                            y: 5,
                        },
                        {
                            x: "7",
                            y: 1,
                        },
                    ],
                    metricUnits: "bytes",
                } as ITimeseriesWidgetData,
            ];
            spyOn(<any>component, "updateChartData");
        });

        it("should trigger CHART_METRIC_REMOVE event", () => {
            component.configuration.groupUniqueId = "groupid";
            const spy = spyOn(eventBus.getStream(CHART_METRIC_REMOVE), "next");
            component.removeMetric("42");

            expect(spy).toHaveBeenCalledWith({
                payload: {
                    metricId: "42",
                    groupUniqueId: "groupid",
                },
            });
        });

        it("should transform chart data", () => {
            const transformedY = [
                0.00021788429890611262, 0.0002608133382479896,
                0.00030374237758986657, 0.0003466714169317436,
                0.0003896004562736206, 0.00043252949561549755,
                0.0004754585349573745,
            ];
            component.widgetData.series[0].rawData =
                component.widgetData.series[0].data;
            component.transformData("42", TimeseriesTransformer.Linear);

            expect(component.widgetData.series[0].data.map((d) => d.y)).toEqual(
                transformedY
            );
            expect(component.widgetData.series[0].transformer?.name).toEqual(
                "transformLinReg"
            );
        });

        it("should update Y axis domain", () => {
            component.configuration = {
                scales: {
                    y: {
                        properties: {
                            axisUnits: "bytes",
                        },
                    },
                },
            } as any;
            component.updateYAxisDomain();

            expect(component.configuration.scales.y.properties?.domain).toEqual(
                {
                    min: 1,
                    max: 17,
                }
            );
        });

        it("should revert transformation", () => {
            component.widgetData.series[0].rawData = [
                {
                    x: 1,
                    y: 1,
                },
                {
                    x: 2,
                    y: 2,
                },
            ];
            component.transformData("42", TimeseriesTransformer.None);

            expect(component.widgetData.series[0].data.map((d) => d.y)).toEqual(
                [1, 2]
            );
            expect(component.widgetData.series[0].transformer).toBeUndefined();
        });
    });
});
