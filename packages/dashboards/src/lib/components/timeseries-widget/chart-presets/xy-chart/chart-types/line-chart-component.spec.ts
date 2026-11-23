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

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus } from "@nova-ui/bits";
import { LinearScale, TimeScale, XYGridConfig } from "@nova-ui/charts";

import { LineChartComponent } from "./line-chart.component";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { LegendPlacement } from "../../../../../widget-types/common/widget/legend";
import {
    ITimeseriesWidgetConfig,
    TimeseriesChartPreset,
    TimeseriesScaleType,
    TimeseriesWidgetProjectType,
} from "../../../types";

describe("LineChartComponent", () => {
    let component: LineChartComponent;
    let fixture: ComponentFixture<LineChartComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineChartComponent);
        component = fixture.componentInstance;
        (<any>component).buildChart();
        fixture.detectChanges();
    });

    it("should set the left axis to fit", () => {
        expect(
            (component.chartAssist.chart.getGrid().config() as XYGridConfig)
                .axis.left.fit
        ).toEqual(true);
    });

    describe("legend values", () => {
        let highlightedValues: Record<string, string | number | undefined>;
        let highlightedValueSpy: jasmine.Spy;

        const getTiles = (): HTMLElement[] =>
            Array.from(
                fixture.nativeElement.querySelectorAll("nui-rich-legend-tile")
            );

        const configureStackedPercent = (): void => {
            component.configuration.preset = TimeseriesChartPreset.StackedArea;
            component.configuration.units = "percent";
            component.chartAssist.legendSeriesSet[0].scales.y =
                component.timeseriesScalesService.getScale(
                    {
                        type: TimeseriesScaleType.Linear,
                        properties: { axisUnits: "percent" },
                    },
                    "percent",
                    component.configuration
                );
        };

        beforeEach(() => {
            component.configuration = {
                interaction: null,
                displayedSeries: [],
                legendPlacement: LegendPlacement.Right,
                enableZoom: false,
                preset: TimeseriesChartPreset.Line,
                scales: {
                    x: { type: TimeseriesScaleType.Time },
                    y: { type: TimeseriesScaleType.Linear },
                },
                units: "generic",
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
            const series = component.mapSeriesSet(component.widgetData.series, {
                x: new TimeScale(),
                y: new LinearScale(),
            });
            component.chartAssist.update(series);
            highlightedValues = {};
            highlightedValueSpy = spyOn(
                component.chartAssist,
                "getHighlightedValue"
            ).and.callFake(series => highlightedValues[series.id]);
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
        });

        it("should render accessible placeholders for missing metric and summary values", () => {
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

        it("should replace placeholders with available values, including zero and negative values, and restore them when unavailable", () => {
            highlightedValues["metric"] = 0;
            highlightedValues["summary"] = "12 ms";
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            expect(getTiles()[0].textContent?.trim()).toBe("12 ms");
            expect(getTiles()[1].textContent?.trim()).toBe("0");

            highlightedValues["metric"] = -1;
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            expect(getTiles()[1].textContent?.trim()).toBe("-1");
            expect(
                getTiles()[1].querySelector("[aria-label='No data']")
            ).toBeNull();

            highlightedValues["metric"] = "";
            highlightedValues["summary"] = undefined;
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            expect(getTiles()[0].textContent?.trim()).toBe("--");
            expect(getTiles()[1].textContent?.trim()).toBe("--");
        });

        it("should render a real highlighted measurement after an empty series receives data", () => {
            const data = [{ x: new Date("2026-01-01T00:00:00Z"), y: 17 }];
            const metric = component.chartAssist.legendSeriesSet[0];
            metric.data = data;
            component.chartAssist.highlightedDataPoints = {
                metric: {
                    seriesId: metric.id,
                    dataSeries: metric,
                    index: 0,
                    data: data[0],
                    position: undefined,
                },
            };
            highlightedValueSpy.and.callThrough();
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            expect(getTiles()[1].textContent?.trim()).toBe("17");
            expect(
                getTiles()[1].querySelector("[aria-label='No data']")
            ).toBeNull();
        });

        it("should not display placeholders in modern dashboards", () => {
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

        it("should not turn a missing stacked percentage into zero", () => {
            configureStackedPercent();
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            expect(getTiles()[1].textContent?.trim()).toBe("--");

            highlightedValues["metric"] = "";
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            expect(getTiles()[1].textContent?.trim()).toBe("--");

            highlightedValues["metric"] = 0;
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
            expect(getTiles()[1].textContent?.trim()).toBe("0 %");
        });

        it("should display placeholders and scaled values with a legend multiplier", () => {
            configureStackedPercent();
            component.widgetData.series[0].legendValueMultiplier = 16;

            for (const { value, expected } of [
                { value: undefined, expected: "--" },
                { value: "", expected: "--" },
                { value: 0, expected: "0 %" },
                { value: 37 / 16, expected: "37 %" },
                { value: undefined, expected: "--" },
            ]) {
                highlightedValues["metric"] = value;
                fixture.changeDetectorRef.markForCheck();
                fixture.detectChanges();
                const tile = getTiles()[1];
                expect(tile.textContent?.trim())
                    .withContext(`value: ${value}`)
                    .toBe(expected);
                const placeholder = tile.querySelector<HTMLElement>(
                    "[role='img'][aria-label='No data']"
                );
                expect(placeholder !== null)
                    .withContext(`value: ${value}`)
                    .toBe(expected === "--");
                if (placeholder) {
                    expect(placeholder.hidden).toBeFalse();
                }
            }
        });

        it("should project the conditional legend menu and summary remove button", () => {
            component.configuration.allowLegendMenu = true;
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            expect(
                fixture.nativeElement.querySelector(
                    ".xy-chart__legend-series .legend-menu nui-menu"
                )
            ).not.toBeNull();

            component.configuration.preset = TimeseriesChartPreset.StackedArea;
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();

            const removeButton: HTMLButtonElement =
                fixture.nativeElement.querySelector(
                    ".summary-serie .legend-menu button"
                );
            expect(removeButton).not.toBeNull();
            const removeMetricSpy = spyOn(component, "removeMetric");
            removeButton.click();
            expect(removeMetricSpy).toHaveBeenCalledWith("summary");
        });
    });
});
