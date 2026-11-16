// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus } from "@nova-ui/bits";

import { StackedAreaChartComponent } from "./stacked-area-chart.component";
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

describe("StackedAreaChartComponent", () => {
    let component: StackedAreaChartComponent;
    let fixture: ComponentFixture<StackedAreaChartComponent>;

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
        fixture = TestBed.createComponent(StackedAreaChartComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput("configuration", {
            interaction: null,
            displayedSeries: [],
            enableZoom: false,
            legendPlacement: LegendPlacement.Right,
            preset: TimeseriesChartPreset.StackedArea,
            scales: {
                x: { type: TimeseriesScaleType.Time },
                y: {
                    type: TimeseriesScaleType.Linear,
                    properties: { axisUnits: "percent" },
                },
            },
            units: "percent",
            projectType: TimeseriesWidgetProjectType.PerfstackApp,
        } satisfies ITimeseriesWidgetConfig);
        fixture.componentRef.setInput("widgetData", {
            series: [
                {
                    id: "cpu",
                    name: "CPU",
                    description: "",
                    data: [{ x: new Date("2026-01-01T00:00:00Z"), y: 37 / 16 }],
                    legendValueMultiplier: 16,
                },
                {
                    id: "remaining",
                    name: "Remaining",
                    description: "",
                    data: [
                        {
                            x: new Date("2026-01-01T00:00:00Z"),
                            y: (7 * 50) / 16,
                        },
                    ],
                    legendValueMultiplier: 16 / 7,
                },
            ],
        });
        fixture.detectChanges();
    });

    it("renders per-series multipliers through the stacked-area legend", () => {
        const [cpu, remaining] = component.chartAssist.legendSeriesSet;
        component.chartAssist.highlightedDataPoints = {
            [cpu.id]: {
                seriesId: cpu.id,
                dataSeries: cpu,
                index: 0,
                data: cpu.data[0],
            },
            [remaining.id]: {
                seriesId: remaining.id,
                dataSeries: remaining,
                index: 0,
                data: remaining.data[0],
            },
        };
        fixture.detectChanges();

        const tileValues: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll(
                ".nui-rich-legend-tile__tilebox-value"
            );
        const values = Array.from(tileValues).map(value =>
            value.textContent?.trim()
        );

        expect(values).toEqual(["37 %", "50 %"]);
    });
});
