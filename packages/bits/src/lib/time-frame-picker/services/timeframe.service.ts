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
import extend from "lodash/extend";
import isUndefined from "lodash/isUndefined";
import moment, { Duration, Moment } from "moment/moment";

import { ITimeframe, ITimeFramePresetDictionary } from "../public-api";

/**
 * __Name : __
 * Timeframe service
 *
 * __Usage :__
 * Used to get time frames via time patterns or presets
 */
/**
 * @ignore
 */
@Injectable()
export class TimeframeService {
    public static cloneTimeFrame(timeFrame: ITimeframe): ITimeframe {
        return {
            ...timeFrame,
            startDatetime: timeFrame.startDatetime.clone(),
            endDatetime: timeFrame.endDatetime.clone(),
        };
    }

    public defaultPresets: ITimeFramePresetDictionary = {
        lastHour: {
            name: $localize`Last hour`,
            startDatetimePattern: { hours: -1 },
            endDatetimePattern: {},
        },
        last12Hours: {
            name: $localize`Last 12 hours`,
            startDatetimePattern: { hours: -12 },
            endDatetimePattern: {},
        },
        last24Hours: {
            name: $localize`Last 24 hours`,
            startDatetimePattern: { hours: -24 },
            endDatetimePattern: {},
        },
        last5Days: {
            name: $localize`Last 5 days`,
            startDatetimePattern: { days: -5 },
            endDatetimePattern: {},
        },
        last7Days: {
            name: $localize`Last 7 days`,
            startDatetimePattern: { days: -7 },
            endDatetimePattern: {},
        },
        last30Days: {
            name: $localize`Last 30 days`,
            startDatetimePattern: { days: -30 },
            endDatetimePattern: {},
        },
    };

    public currentPresets: ITimeFramePresetDictionary = extend(
        {},
        this.defaultPresets
    );

    constructor() {}

    /**
     *
     * __Description:__ Get timeframe from patterns of start and end points in time
     * @param startDatetimePattern
     * @param endDatetimePattern
     * @param baseDatetime
     */
    public getTimeframe(
        startDatetimePattern: any,
        endDatetimePattern: any,
        baseDatetime?: string
    ): ITimeframe {
        // check input parameters
        if (isUndefined(startDatetimePattern)) {
            throw new Error("Parameter 'startDatetimePattern' is undefined");
        }

        if (isUndefined(endDatetimePattern)) {
            throw new Error("Parameter 'endDateTimePattern' is undefined");
        }

        const startDatetime = moment(baseDatetime).add(startDatetimePattern);
        const endDatetime = moment(baseDatetime).add(endDatetimePattern);

        return {
            startDatetime: startDatetime,
            endDatetime: endDatetime,
            // @ts-ignore: preventing breaking default flow;
            selectedPresetId: null,
        };
    }

    /**
     * __Description:__ Get timeframe by preset id, using the list of pre-defined presets

     */
    public getTimeframeByPresetId(
        id: string | undefined,
        baseDatetime?: string
    ): ITimeframe {
        // check input parameters
        if (isUndefined(id)) {
            throw new Error("Parameter 'id' is undefined");
        }

        const startDatetime = moment(baseDatetime).add(
            this.currentPresets[id].startDatetimePattern
        );
        const endDatetime = moment(baseDatetime).add(
            this.currentPresets[id].endDatetimePattern
        );

        return {
            startDatetime: startDatetime,
            endDatetime: endDatetime,
            selectedPresetId: id,
            title: this.currentPresets[id].name,
        };
    }

    /**
     * __Description:__ Updates start and end time of timeframe according to preset if selected
     *
     * @param timeFrame timeframe to be updated
     * @param presets presets to look at. Defaults to service's currentPresets
     * @param baseDatetime date that should be used for relative time calculations. Defaults to now.
     * @returns updated clone of timeframe with startDatetime and endDatetime reconciled with selectedPresetId
     */
    public reconcileTimeframe = (
        timeFrame: ITimeframe,
        presets?: ITimeFramePresetDictionary,
        baseDatetime?: Moment
    ): ITimeframe => {
        if (!presets) {
            presets = this.currentPresets;
        }
        if (!baseDatetime) {
            baseDatetime = moment();
        }

        const preset =
            timeFrame.selectedPresetId && presets[timeFrame.selectedPresetId];
        return preset
            ? {
                  ...timeFrame,
                  startDatetime: baseDatetime
                      .clone()
                      .add(preset.startDatetimePattern),
                  endDatetime: baseDatetime
                      .clone()
                      .add(preset.endDatetimePattern),
              }
            : TimeframeService.cloneTimeFrame(timeFrame);
    };

    /**
     * __Description:__ Get the list of all default presets

     */
    public getDefaultPresets(): ITimeFramePresetDictionary {
        return this.defaultPresets;
    }

    /**
     * __Description:__ Add custom presets to existing list of default presets
     * @param presets
     */
    public extendCurrentPresets(presets: ITimeFramePresetDictionary): void {
        extend(this.currentPresets, presets);
    }

    /**
     * __Description:__ Compare two timeframes, return false if they are not equal
     */
    public isEqual(
        firstTimeFrame: ITimeframe,
        secondTimeFrame: ITimeframe,
        units: moment.unitOfTime.Base = "minutes"
    ): boolean {
        return (
            firstTimeFrame &&
            secondTimeFrame &&
            firstTimeFrame.endDatetime.isSame(
                secondTimeFrame.endDatetime,
                units
            ) &&
            firstTimeFrame.startDatetime.isSame(
                secondTimeFrame.startDatetime,
                units
            )
        );
    }

    /**
     * __Description:__ Compare two timeframe durations, return false if they are not equal
     */
    public isEqualDuration(
        firstTimeFrame: ITimeframe,
        secondTimeFrame: ITimeframe,
        units: moment.unitOfTime.Base = "minutes"
    ): boolean {
        return (
            firstTimeFrame &&
            secondTimeFrame &&
            firstTimeFrame.startDatetime.diff(
                firstTimeFrame.endDatetime,
                units
            ) ===
                secondTimeFrame.startDatetime.diff(
                    secondTimeFrame.endDatetime,
                    units
                )
        );
    }

    /**
     * __Description:__
     * Adds the specified duration to startDatetime and endDatetime and returns a new timeframe.
     * Note: Input timeframe is not mutated.
     *
     * @param {ITimeframe} timeFrame The timeframe to shift
     * @param {Duration} duration The duration of the timeframe shift
     * @returns {ITimeframe} The shifted timeframe
     */
    public shiftTimeFrame(
        timeFrame: ITimeframe,
        duration: Duration
    ): ITimeframe {
        return {
            startDatetime: timeFrame.startDatetime.clone().add(duration),
            endDatetime: timeFrame.endDatetime.clone().add(duration),
            // @ts-ignore: preventing breaking default flow;
            selectedPresetId: null,
        };
    }

    /**
     * __Description:__
     * Returns the difference between timeFrame's startDatetime and endDatetime as moment.Duration
     *
     * @param {ITimeframe} timeFrame
     * @returns {Duration}
     */
    public getDuration(timeFrame: ITimeframe): Duration {
        return moment.duration(
            timeFrame.endDatetime.diff(timeFrame.startDatetime)
        );
    }

    /**
     * __Description:__
     * Checks timeFrame "startDatetime" and "endDatetime" attributes for moment validity
     *
     * @param {ITimeframe} tf
     * @returns {Boolean}
     */
    public areTimeFrameDatesValid(tf: ITimeframe) {
        const { startDatetime, endDatetime } = tf;
        const startValid = startDatetime && startDatetime.isValid();
        const endValid = endDatetime && endDatetime.isValid();

        return startValid && endValid;
    }
}
