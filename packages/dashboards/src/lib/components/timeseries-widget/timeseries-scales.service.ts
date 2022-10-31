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

import { DashboardUnitConversionPipe } from "../../common/pipes/dashboard-unit-conversion-pipe";
import { ITimeseriesScaleConfig, TimeseriesScaleType } from "./types";

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
        units: UnitOption
    ): IScale<any> {
        let scale: IScale<any>;

        switch (scaleConfig.type) {
            case TimeseriesScaleType.Time: {
                scale = new TimeScale();
                break;
            }
            case TimeseriesScaleType.Linear: {
                scale = new LinearScale();
                scale.formatters.tick = (value: string | number | undefined) =>
                    this.unitConversionPipe.transform(
                        value,
                        units,
                        UnitBase.Standard
                    );
                break;
            }
            case TimeseriesScaleType.TimeInterval: {
                scale = new TimeIntervalScale(duration(1, "hour"));
                break;
            }
        }

        this.updateConfiguration(scale, scaleConfig);

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
        scaleConfig: ITimeseriesScaleConfig
    ): void {
        if (
            scaleConfig.type === TimeseriesScaleType.TimeInterval &&
            scale instanceof TimeIntervalScale
        ) {
            const interval = scaleConfig.properties?.interval;
            if (typeof interval === "number") {
                if (interval <= 0) {
                    throw new Error(
                        "Interval value must be greater than zero."
                    );
                }
                scale.interval(duration(interval, "seconds"));
            }
        }
    }
}
