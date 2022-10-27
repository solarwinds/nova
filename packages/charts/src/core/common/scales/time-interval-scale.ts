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

import { ScaleBand, scaleBand } from "d3-scale";
import isEqual from "lodash/isEqual";
import moment, { duration, Duration } from "moment/moment";

import { BAND_CENTER } from "./constants";
import { datetimeFormatter } from "./formatters/datetime-formatter";
import { TimeScale } from "./time-scale";
import { EMPTY_CONTINUOUS_DOMAIN, IBandScale } from "./types";

// algorithm found here: https://stackoverflow.com/a/30280636/5108336
export function isDaylightSavingTime(d: Date) {
    const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== d.getTimezoneOffset();
}

/**
 * Scale designed to support regular interval based data.
 */
export class TimeIntervalScale extends TimeScale implements IBandScale<Date> {
    private _bandScale: ScaleBand<Date>;
    private _interval: Duration;

    constructor(interval: Duration, id?: string) {
        super(id);

        this.interval(interval);

        this._bandScale = scaleBand<Date>();

        this.formatters.title = this.defaultTitleFormatter;
    }

    public interval(): Duration;
    public interval(value: Duration): TimeIntervalScale;
    public interval(value?: Duration): Duration | TimeIntervalScale {
        if (value) {
            this._interval = value;
            return this;
        }
        return this._interval;
    }

    public domain(domain?: Date[]): any {
        if (domain) {
            if (domain.length === 0 || domain.length % 2 !== 0) {
                throw new Error(
                    "TimeIntervalScale domain has to be defined as a pair of [from, to] time values."
                );
            }

            const isDomainEmpty = isEqual(domain, EMPTY_CONTINUOUS_DOMAIN);
            const bands: Date[] = [];
            // only try to determine bands if the domain is not empty
            if (!isDomainEmpty) {
                for (let i = 0; i + 1 < domain.length; i += 2) {
                    bands.push(
                        ...this.getBandsForInterval(domain[i], domain[i + 1])
                    );
                }
            }
            this._bandScale.domain(bands);

            // maintain the same domain if it's empty
            const d = isDomainEmpty
                ? domain
                : [domain[0], moment(domain[1]).add(this.interval()).toDate()];
            return super.domain(d);
        }
        return super.domain();
    }

    public range(range?: [number, number]): any {
        if (range) {
            this._bandScale.range(range);
        } else {
            return super.range();
        }
        return super.range(range);
    }

    public getBands(): Date[] {
        return this._bandScale.domain();
    }

    public convert(value: Date, position: number = BAND_CENTER): number {
        const truncatedDate: Date | undefined = this.truncToInterval(
            value,
            this.interval()
        );
        if (!truncatedDate) {
            throw new Error("Could not convert interval");
        }
        const bandValue = this._bandScale(truncatedDate);
        if (typeof bandValue === "number") {
            return bandValue + position * this.bandwidth();
        }
        return super.convert(value);
    }

    /**
     * Converts the specified coordinate into the value of the closest band data point
     *
     * @param {number} coordinate The coordinate to convert
     * @returns {string} The value of the closest band data point
     */
    public invert(coordinate: number): Date | undefined {
        const exactTime = super.invert(coordinate);
        return this.truncToInterval(exactTime, this.interval());
    }

    public bandwidth(): number {
        return this._bandScale.bandwidth();
    }

    public truncToInterval(
        datetime: Date | undefined,
        interval: Duration,
        isDomainChange = false
    ): Date | undefined {
        if (!datetime) {
            return datetime;
        }

        const isDst = isDaylightSavingTime(datetime);
        const isDomainStartDst = isDomainChange
            ? isDst
            : isDaylightSavingTime(this.domain()[0]);

        const isTransFromDst = isDomainStartDst && !isDst;
        const isTransToDst = !isDomainStartDst && isDst;

        const intervalDays = this.interval().asDays();
        const transToDstAdjustment =
            intervalDays >= 1 && isTransToDst
                ? duration(1, "hour").asMilliseconds()
                : 0;
        const adjustedDt = new Date(datetime.getTime() + transToDstAdjustment);

        let standardTimeOffsetMinutes = 0;
        if (isTransFromDst || isTransToDst) {
            standardTimeOffsetMinutes = isTransFromDst ? -60 : 60;
        }

        const timeZoneOffsetMs =
            (adjustedDt.getTimezoneOffset() + standardTimeOffsetMinutes) *
            60000;
        const timestamp = adjustedDt.getTime() - timeZoneOffsetMs;
        const intervalMs = interval.asMilliseconds();
        const remainder = timestamp % intervalMs;

        if (remainder === 0) {
            return adjustedDt;
        }

        // round to interval
        const truncatedTimestamp = timestamp - remainder;

        return new Date(truncatedTimestamp + timeZoneOffsetMs);
    }

    public isContinuous(): boolean {
        return true;
    }

    public defaultTitleFormatter = (inputDate: Date) => {
        const intervalDays = this.interval().asDays();
        const isDst = isDaylightSavingTime(inputDate);
        const isDomainStartDst = isDaylightSavingTime(this.domain()[0]);

        const isTransFromDst = !isDst && isDomainStartDst;
        const isTransToDst = isDst && !isDomainStartDst;

        let standardTimeOffsetMs = 0;
        if ((isTransFromDst || isTransToDst) && intervalDays >= 1) {
            // if transitioning from/to daylight saving time and interval >= 1 day, add/subtract an hour to/from
            // the time to format the day as "mmm d" instead of "11:00pm" or "1:00am" respectively
            standardTimeOffsetMs = isTransFromDst ? 3600000 : -3600000;
        }
        const adjustedDate = new Date(
            inputDate.getTime() + standardTimeOffsetMs
        );
        const endDate =
            intervalDays >= 1
                ? moment(adjustedDate).add(intervalDays, "days").toDate()
                : moment(adjustedDate).add(this.interval()).toDate();
        return (
            datetimeFormatter(adjustedDate) + " - " + datetimeFormatter(endDate)
        );
    };

    private getBandsForInterval(from: Date, to: Date): Date[] {
        const bands: Date[] = [];
        let bandDate = this.truncToInterval(from, this.interval(), true);
        if (!bandDate) {
            throw new Error("Could not get bands for interval");
        }

        const intervalMs = this.interval().asMilliseconds();
        const intervalDays = this.interval().asDays();
        const isDomainStartDst = isDaylightSavingTime(from);
        const isDomainEndDst = isDaylightSavingTime(to);

        // Add one hour to the "to" date if:
        // 1) we're transitioning to daylight saving time and 2) the interval is >= one day.
        // This ensures that the last day in the domain, which starts an hour later, is included in the generated bands.
        const dstAdjustment =
            !isDomainStartDst && isDomainEndDst
                ? duration(1, "hour").asMilliseconds()
                : 0;
        const adjustedToDate =
            intervalDays >= 1 ? new Date(to.getTime() + dstAdjustment) : to;

        while (bandDate <= adjustedToDate) {
            bands.push(bandDate);
            bandDate = new Date(bandDate.getTime() + intervalMs);
        }
        return bands;
    }
}
