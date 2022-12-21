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

import { TestBed } from "@angular/core/testing";
import { UnitConversionService } from "@nova-ui/bits";

import { IScale, LinearScale } from "@nova-ui/charts";

import {
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    TimeseriesChartPreset,
    TimeseriesScaleType,
    LegendPlacement,
} from "@nova-ui/dashboards";

import { TimeseriesScalesService } from "./timeseries-scales.service";

describe("TimeseriesScalesService > ", () => {
    let service: TimeseriesScalesService;
    let scale: IScale<any>;
    let widgetConfig: ITimeseriesWidgetConfig;
    let scaleConfig: ITimeseriesScaleConfig;

    beforeEach(() => {
        scale = new LinearScale();
        scale.isTimeseriesScale = true;
        widgetConfig = {
            interaction: null,
            displayedSeries: [],
            enableZoom: true,
            preset: TimeseriesChartPreset.Line,
            scales: {
                x: { type: TimeseriesScaleType.Time },
                y: { type: TimeseriesScaleType.Linear },
            },
            units: "bytes",
            legendPlacement: LegendPlacement.Right,
        };
        scaleConfig = {
            type: TimeseriesScaleType.Linear,
            properties: {
                axisUnits: "percent",
            },
        };

        TestBed.configureTestingModule({
            providers: [TimeseriesScalesService, UnitConversionService],
        });
        service = TestBed.inject(TimeseriesScalesService);
    });

    describe("updateConfiguration", () => {
        it("should set scale units according to scale config", () => {
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.scaleUnits).toBe("percent");
        });

        it("shouldn't set domain for status bar chart", () => {
            widgetConfig.preset = TimeseriesChartPreset.StatusBar;
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([]);
            expect(scale.isDomainFixed).toEqual(undefined);
        });

        it("shouldn't set domain for stacked aread chart", () => {
            widgetConfig.preset = TimeseriesChartPreset.StackedArea;
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([]);
            expect(scale.isDomainFixed).toEqual(undefined);
        });

        it("should set fix domain for percent axis", () => {
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([0, 25, 50, 75, 100]);
            expect(scale.isDomainFixed).toEqual(true);
        });

        it("should adjust domain for stacked bar chart", () => {
            widgetConfig.preset = TimeseriesChartPreset.StackedBar;
            scaleConfig.properties = {
                domain: {
                    min: 0,
                    max: 2,
                },
            };
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([0, 1, 2, 3, 4]);
            expect(scale.isDomainFixed).toEqual(true);
        });

        it("should avoid decimal domain increments for stacked bar chart", () => {
            widgetConfig.preset = TimeseriesChartPreset.StackedBar;
            scaleConfig.properties = {
                domain: {
                    min: 0,
                    max: 1,
                },
            };
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([0, 1, 2, 3, 4]);
            expect(scale.isDomainFixed).toEqual(true);
        });

        it("should adjust domain for line chart to avoid big spikes in the chart", () => {
            scaleConfig.properties = {
                domain: {
                    min: 19405910016,
                    max: 20796321792,
                },
            };
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([
                9702955008, 15075836928, 20448718848, 25821600768, 31194482688,
            ]);
            expect(scale.isDomainFixed).toEqual(true);
        });

        it("should adjust domain for zero min and max domain values", () => {
            scaleConfig.properties = {
                domain: {
                    min: 0,
                    max: 0,
                },
            };
            service.updateConfiguration(scale, scaleConfig, widgetConfig);

            expect(scale.fixDomainValues).toEqual([-1, -0.5, 0, 0.5, 1]);
            expect(scale.isDomainFixed).toEqual(true);
        });
    });
});
