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

import { Injectable } from "@angular/core";
import { duration } from "moment/moment";

import { UnitBase, UnitConversionService, UnitOption } from "@nova-ui/bits";
import {
    IScale,
    LinearScale,
    TimeIntervalScale,
    TimeScale,
} from "@nova-ui/charts";

import { DashboardUnitConversionPipe } from "../../common/pipes/public-api";
import { 
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    TimeseriesScaleType,
    TimeseriesChartPreset 
} from "./types";

/**
 * This service handles scale creation and configuration for the timeseries widget
 */
@Injectable()
export class TimeseriesScalesService {
    private unitConversionPipe: DashboardUnitConversionPipe;

    constructor(private unitConversionService: UnitConversionService) {
        this.unitConversionPipe = new DashboardUnitConversionPipe(
            this.unitConversionService
        );
    }

    /**
     * Creates a scale based on given configuration
     *
     * @param scaleConfig
     */
    public getScale(
        scaleConfig: ITimeseriesScaleConfig,
        units: UnitOption,
        widgetConfig?: ITimeseriesWidgetConfig,
    ): IScale<any> {
        let scale: IScale<any>;

        switch (scaleConfig.type) {
            case TimeseriesScaleType.Time: {
                scale = new TimeScale();
                break;
            }
            case TimeseriesScaleType.Linear: {
                scale = new LinearScale();
                scale.formatters.tick = (value: string | number | undefined, isLabelFormatter?: boolean) =>
                    this.unitConversionPipe.transform(
                        value,
                        scaleConfig.properties?.axisUnits ?? units,
                        UnitBase.Standard
                    );
                break;
            }
            case TimeseriesScaleType.TimeInterval: {
                scale = new TimeIntervalScale(duration(1, "hour"));
                break;
            }
        }

        this.updateConfiguration(scale, scaleConfig, widgetConfig);

        return scale;
    }

    /**
     * Currently only TimeIntervalScale has configuration
     *
     * @param scale
     * @param scaleConfig
     */
    public updateConfiguration(
        scale: IScale<any>,
        scaleConfig: ITimeseriesScaleConfig,
        widgetConfig?: ITimeseriesWidgetConfig,
    ): void {

        switch (scaleConfig.type) {
            case TimeseriesScaleType.Time: {
                const interval = scaleConfig.properties?.timeInterval;
                if (interval?.startDatetime && interval?.endDatetime) {
                    scale.fixDomain([interval.startDatetime, interval.endDatetime]);
                }
                break;
            }
            case TimeseriesScaleType.TimeInterval: {
                const interval = scaleConfig.properties?.interval;
                if (typeof interval === "number") {
                    if (interval <= 0) {
                        throw new Error(
                            "Interval value must be greater than zero."
                        );
                    }
                    if (scale instanceof TimeIntervalScale) {
                        scale.interval(duration(interval, "seconds"));
                    }
                }
                break;
            }
            case TimeseriesScaleType.Linear: {
                if (scaleConfig.properties?.axisUnits) {
                    scale.scaleUnits = scaleConfig.properties.axisUnits;
                }
                
                if (scaleConfig.properties?.axisUnits === "percent" && scale.setFixDomainValues) {
                    scale.setFixDomainValues([0, 25, 50, 75, 100]);

                }
                if (scaleConfig.properties?.axisUnits !== "percent" && scaleConfig.properties?.domain && scale.setFixDomainValues) {
                    const domainAdjusted = widgetConfig?.preset ===  TimeseriesChartPreset.StackedBar ? this.getStackedBarScaleDomain(scaleConfig.properties.domain) 
                    : this.getLineScaleDomain(scaleConfig.properties.domain);
                    scale.setFixDomainValues(domainAdjusted);
                }
                break;
            }
        }
    }

    private getStackedBarScaleDomain({min, max}: {min: number, max: number}): number[] {
        if (max === 0 || max % 4 > 0) {
            max = (max + 4) - (max % 4);
        }
        const increment = (max - min) / 4;
        return [min, min + increment, min + 2 * increment, max - increment, max];
    }

    private getLineScaleDomain({min, max}: {min: number, max: number}): number[] {
        if (min > max) {
            const tmp = min;
            min = max;
            max = tmp;
        }

        const extentRange = Math.abs((max - min) / ((max + min) / 2));

        // for small domain ranges increase domain so that spikes are not exaggerated
        if (extentRange < 0.5) {
            min = min - (Math.abs(min) * 0.5);
            max = max + (Math.abs(max) * 0.5);
        }
    
        // handles zero case
        if (min === 0 && max === 0) {
            min = -1;
            max = 1;
        }

        // special case for real small number since not using si prefix anymore
        if (Math.abs(max - min) < 0.04) {
            max += 0.04;
        }

        const point = (max - min) / 4;
        return [min, min + point, min + 2 * point, max - point, max];;
    }
}
