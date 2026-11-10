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
import moment from "moment/moment";

import { EventBus, IconService, IEvent } from "@nova-ui/bits";
import {
    Chart,
    SET_DOMAIN_EVENT,
    TimeseriesZoomPlugin,
    ZoomPlugin,
} from "@nova-ui/charts";

import { StatusBarChartComponent } from "./status-bar-chart.component";
import { NuiDashboardsModule } from "../../../../dashboards.module";
import { SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { LegendPlacement } from "../../../../widget-types/common/widget/legend";
import { TimeseriesScalesService } from "../../timeseries-scales.service";
import {
    ITimeseriesWidgetConfig,
    TimeseriesChartPreset,
    TimeseriesChartTypes,
    TimeseriesScaleType,
    TimeseriesWidgetProjectType,
} from "../../types";

describe(StatusBarChartComponent.name, () => {
    const frozenTime = moment("2020-11-06T00:00:00-06:00")
        .startOf("day")
        .toDate();
    let component: StatusBarChartComponent;
    let fixture: ComponentFixture<StatusBarChartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                IconService,
                TimeseriesScalesService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: new EventBus<IEvent>(),
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
            declarations: [StatusBarChartComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusBarChartComponent);
        component = fixture.componentInstance;

        component.widgetData = {
            series: [
                {
                    id: "series-1",
                    name: "Test Name",
                    description: "Test Description",
                    data: [
                        {
                            x: moment(frozenTime).subtract(9, "day").toDate(),
                            y: Status.Warning,
                        },
                        {
                            x: moment(frozenTime).subtract(6, "day").toDate(),
                            y: Status.Up,
                        },
                        {
                            x: moment(frozenTime).subtract(3, "day").toDate(),
                            y: Status.Critical,
                        },
                        { x: moment(frozenTime).toDate(), y: Status.Critical },
                    ],
                },
                {
                    id: "series-2",
                    name: "Test Name",
                    description: "Test Description",
                    data: [
                        {
                            x: moment(frozenTime).subtract(9, "day").toDate(),
                            y: Status.Critical,
                        },
                        {
                            x: moment(frozenTime).subtract(6, "day").toDate(),
                            y: Status.Warning,
                        },
                        {
                            x: moment(frozenTime).subtract(3, "day").toDate(),
                            y: Status.Up,
                        },
                        { x: moment(frozenTime).toDate(), y: Status.Up },
                    ],
                },
            ],
        };

        component.zoomPlugins = [
            new TimeseriesZoomPlugin(),
            new TimeseriesZoomPlugin(),
        ];

        (<any>component).buildChart();
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("updateChartData", () => {
        it("should add the default zoom plugin to each spark if zoom is enabled", () => {
            component.configuration.enableZoom = true;
            (<any>component).updateChartData();
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(
                    true
                );
            });
        });

        it("should not add multiple default zoom plugins on multiple calls", () => {
            component.configuration.enableZoom = true;

            // multiple calls
            (<any>component).updateChartData();
            (<any>component).updateChartData();

            spyOn(ZoomPlugin.prototype, "destroy");
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(
                    true
                );
                (spark?.chart as Chart)?.removePlugin(ZoomPlugin);
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(
                    false
                );
            });
        });

        it("should not add the default zoom plugin to each spark if zoom is disabled", () => {
            component.configuration.enableZoom = false;
            (<any>component).updateChartData();
            component.chartAssist.sparks.forEach(spark => {
                expect((spark?.chart as Chart)?.hasPlugin(ZoomPlugin)).toEqual(
                    false
                );
            });
        });

        it("should add the timeseries zoom plugin to each spark for the pefstack widget type", () => {
            component.configuration.enableZoom = true;
            component.configuration.projectType =
                TimeseriesWidgetProjectType.PerfstackApp;
            (<any>component).updateChartData();
            component.chartAssist.sparks.forEach(spark => {
                expect(
                    (spark?.chart as Chart)?.hasPlugin(TimeseriesZoomPlugin)
                ).toEqual(true);
            });
        });

        it("should not add multiple timeseries zoom plugins on multiple calls for the pefstack widget type", () => {
            component.configuration.enableZoom = true;
            component.configuration.projectType =
                TimeseriesWidgetProjectType.PerfstackApp;

            // multiple calls
            (<any>component).updateChartData();
            (<any>component).updateChartData();

            spyOn(TimeseriesZoomPlugin.prototype, "destroy");
            component.chartAssist.sparks.forEach(spark => {
                expect(
                    (spark?.chart as Chart)?.hasPlugin(TimeseriesZoomPlugin)
                ).toEqual(true);
                (spark?.chart as Chart)?.removePlugin(TimeseriesZoomPlugin);
                expect(
                    (spark?.chart as Chart)?.hasPlugin(TimeseriesZoomPlugin)
                ).toEqual(false);
            });
        });

        it("should not throw if a perfstack spark has no matching zoom plugin", () => {
            component.configuration.enableZoom = true;
            component.configuration.projectType =
                TimeseriesWidgetProjectType.PerfstackApp;
            component.zoomPlugins = [new TimeseriesZoomPlugin()];

            expect(() => (<any>component).updateChartData()).not.toThrow();
        });

        it("should subscribe to only the first spark's SET_DOMAIN_EVENT", () => {
            component.configuration.enableZoom = true;
            const expectedDomain = [5, 10];
            (<any>component).updateChartData();
            const spy = spyOn(
                (<any>component).eventBus.getStream(SET_TIMEFRAME),
                "next"
            );
            component.chartAssist.sparks.forEach(spark => {
                spark.chart
                    ?.getEventBus()
                    .getStream(SET_DOMAIN_EVENT)
                    .next({ data: { x: expectedDomain } });
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({
                payload: {
                    startDatetime: expectedDomain[0],
                    endDatetime: expectedDomain[1],
                    selectedPresetId: undefined,
                },
            });
        });

        it("should maintain only one subscription to the SET_DOMAIN_EVENT on multiple calls", () => {
            component.configuration.enableZoom = true;
            const expectedDomain = [5, 10];

            // multiple calls
            (<any>component).updateChartData();
            (<any>component).updateChartData();

            const spy = spyOn(
                (<any>component).eventBus.getStream(SET_TIMEFRAME),
                "next"
            );
            component.chartAssist.sparks.forEach(spark => {
                spark.chart
                    ?.getEventBus()
                    .getStream(SET_DOMAIN_EVENT)
                    .next({ data: { x: expectedDomain } });
            });
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith({
                payload: {
                    startDatetime: expectedDomain[0],
                    endDatetime: expectedDomain[1],
                    selectedPresetId: undefined,
                },
            });
        });
    });

    describe("transformData", () => {
        it("should set end to the next value in the progression if the progression is not on an interval", () => {
            const result = (<any>component).transformData(
                component.widgetData.series[0].data,
                false
            );
            expect(result[0].end).toEqual(result[1].start);
        });

        it("should use the same value for start and end if the progression is on an interval", () => {
            const result = (<any>component).transformData(
                component.widgetData.series[0].data,
                true
            );
            expect(result[0].start).toEqual(result[0].end);
        });
    });
});

describe("StatusBarChartComponent legend values", () => {
    let component: StatusBarChartComponent;
    let fixture: ComponentFixture<StatusBarChartComponent>;

    const getTiles = (): HTMLElement[] =>
        Array.from(
            fixture.nativeElement.querySelectorAll("nui-rich-legend-tile")
        );

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: new EventBus<IEvent>(),
                },
                { provide: DATA_SOURCE, useValue: {} },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StatusBarChartComponent);
        component = fixture.componentInstance;
        component.configuration = {
            interaction: null,
            displayedSeries: [],
            legendPlacement: LegendPlacement.Right,
            enableZoom: false,
            preset: TimeseriesChartPreset.StatusBar,
            scales: {
                x: { type: TimeseriesScaleType.Time },
                y: { type: TimeseriesScaleType.Linear },
            },
            units: "generic",
            type: TimeseriesChartTypes.alert,
            projectType: TimeseriesWidgetProjectType.PerfstackApp,
        } satisfies ITimeseriesWidgetConfig;
        component.widgetData = {
            series: [
                { id: "metric", name: "Metric", description: "", data: [] },
            ],
            summarySerie: {
                id: "summary",
                name: "Summary",
                description: "",
                data: [],
            },
        };
        component.zoomPlugins = [];
        component.ngOnChanges({
            configuration: new SimpleChange(
                undefined,
                component.configuration,
                true
            ),
            widgetData: new SimpleChange(undefined, component.widgetData, true),
        });
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it("should render accessible placeholders for missing alert and summary values", () => {
        const tiles = getTiles();

        expect(tiles.length).toBe(2);
        for (const tile of tiles) {
            const placeholder = tile.querySelector<HTMLElement>(
                "[role='img'][aria-label='No data']"
            );
            expect(placeholder?.textContent?.trim()).toBe("--");
            expect(placeholder?.hidden).toBeFalse();
        }
    });

    it("should show real alert values, including zero, without placeholders", () => {
        spyOn(component.chartAssist, "getHighlightedValue").and.returnValue(0);
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        for (const tile of getTiles()) {
            expect(tile.textContent?.trim()).toBe("0");
            expect(tile.querySelector("[aria-label='No data']")).toBeNull();
        }
    });

    it("should leave modern dashboard alert tiles unchanged", () => {
        component.configuration.projectType =
            TimeseriesWidgetProjectType.ModernDashboard;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        for (const tile of getTiles()) {
            const placeholder = tile.querySelector<HTMLElement>(
                "[role='img'][aria-label='No data']"
            );
            expect(placeholder?.hidden).toBeTrue();
        }
    });

    it("should project and invoke the conditional remove buttons", () => {
        component.configuration.allowLegendMenu = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        const buttons: NodeListOf<HTMLButtonElement> =
            fixture.nativeElement.querySelectorAll(".legend-menu button");
        expect(buttons.length).toBe(2);
        const removeMetricSpy = spyOn(component, "removeMetric");
        buttons[0].click();
        buttons[1].click();
        expect(removeMetricSpy).toHaveBeenCalledWith("summary");
        expect(removeMetricSpy).toHaveBeenCalledWith("metric");
    });

    it("should replace the status placeholder with an icon when data arrives", () => {
        component.configuration.type = TimeseriesChartTypes.multi;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        const placeholders = fixture.nativeElement.querySelectorAll(
            ".status-bar-chart__legend__tile [role='img'][aria-label='No data']"
        );
        expect(placeholders.length).toBe(2);
        expect(placeholders[0].textContent.trim()).toBe("--");

        const previousData = component.widgetData;
        component.widgetData = {
            ...previousData,
            series: [
                {
                    ...previousData.series[0],
                    data: [
                        {
                            x: new Date("2026-01-01T00:00:00Z"),
                            y: 1,
                            icon: "status_up",
                        },
                        {
                            x: new Date("2026-01-01T00:01:00Z"),
                            y: 1,
                            icon: "status_up",
                        },
                    ],
                },
            ],
        };
        component.ngOnChanges({
            widgetData: new SimpleChange(
                previousData,
                component.widgetData,
                false
            ),
        });
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        const tiles: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll(
                ".status-bar-chart__legend__tile"
            );
        expect(tiles.length).toBe(2);
        expect(tiles[0].querySelector("[aria-label='No data']")).not.toBeNull();
        expect(tiles[1].querySelector("[aria-label='No data']")).toBeNull();
        expect(tiles[1].querySelector("nui-icon")).not.toBeNull();
    });
});

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
}
