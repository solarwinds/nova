import { IScale, LinearScale, TimeIntervalScale, TimeScale } from "@nova-ui/charts";
import { duration } from "moment/moment";

import { ITimeseriesScaleConfig, TimeseriesScaleType } from "./types";

/**
 * This service handles scale creation and configuration for the timeseries widget
 */
export class TimeseriesScalesService {

    /**
     * Creates a scale based on given configuration
     *
     * @param scaleConfig
     */
    public getScale(scaleConfig: ITimeseriesScaleConfig): IScale<any> {
        let scale: IScale<any>;

        switch (scaleConfig.type) {
            case TimeseriesScaleType.Time: {
                scale = new TimeScale();
                break;
            }
            case TimeseriesScaleType.Linear: {
                scale = new LinearScale();
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
    public updateConfiguration(scale: IScale<any>, scaleConfig: ITimeseriesScaleConfig) {
        if (scaleConfig.type === TimeseriesScaleType.TimeInterval && scale instanceof TimeIntervalScale) {
            const interval = scaleConfig.properties?.interval;
            if (typeof interval === "number") {
                if (interval <= 0) {
                    throw new Error("Interval value must be greater than zero.");
                }
                scale.interval(duration(interval, "seconds"));
            }
        }
    }
}
