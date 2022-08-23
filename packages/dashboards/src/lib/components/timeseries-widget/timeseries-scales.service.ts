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
