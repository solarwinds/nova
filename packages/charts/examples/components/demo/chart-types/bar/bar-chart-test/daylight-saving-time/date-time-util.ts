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

import moment from "moment/moment";

/** Class with common time utilities */
export class DateTimeUtil {
    /**
     * Gets the local midnight date-time of the day containing the start of daylight saving time for the provided year
     *
     * @param year The year to get the midnight date-time for the start of daylight saving time
     *
     * @returns {Date} The local midnight date-time of the day containing the start of daylight saving time for the provided year
     */
    public static getStartDstMidnight(year: number): Date {
        const datesInYear = [];
        for (let i = 1; i <= 365; i++) {
            const d = new Date(year, 0, 1);
            d.setDate(i);
            datesInYear.push(d);
        }

        let foundStart = false;
        return datesInYear.reduce((prev: Date, curr: Date) => {
            if (curr.getTimezoneOffset() < prev.getTimezoneOffset()) {
                foundStart = true;
                return prev;
            }
            return foundStart ? prev : curr;
        });
    }

    /**
     * Gets the exact local date-time of the start of daylight saving time for the provided year
     *
     * @param year The year to get the exact date-time for the start of daylight saving time
     *
     * @returns {Date} The exact local date-time of the day containing the start of daylight saving time for the provided year
     */
    public static getStartDstHour(year: number): Date {
        const startDstMidnight = DateTimeUtil.getStartDstMidnight(year);
        const hoursInDstStartDay = [];
        for (let i = 0; i < 24; i++) {
            const d = new Date(startDstMidnight);
            d.setHours(i);
            hoursInDstStartDay.push(d);
        }

        let foundStart = false;
        return hoursInDstStartDay.reduce((prev: Date, curr: Date) => {
            if (curr.getTimezoneOffset() < prev.getTimezoneOffset()) {
                foundStart = true;
                return curr;
            }
            return foundStart ? prev : curr;
        });
    }

    /**
     * Gets the local midnight date-time of the day containing the end of daylight saving time for the provided year
     *
     * @param year The year to get the midnight date-time for the end of daylight saving time
     *
     * @returns {Date} The local midnight date-time of the day containing the end of daylight saving time for the provided year
     */
    public static getEndDstMidnight(year: number): Date {
        const datesInYear = [];
        for (let i = 1; i <= 365; i++) {
            const d = new Date(year, 0, 1);
            d.setDate(i);
            datesInYear.push(d);
        }

        return datesInYear.reduce((prev: Date, curr: Date) => {
            if (curr.getTimezoneOffset() > prev.getTimezoneOffset()) {
                return prev;
            }
            return curr;
        });
    }

    /**
     * Gets the exact local date-time of the end of daylight saving time for the provided year
     *
     * @param year The year to get the exact date-time for the end of daylight saving time
     *
     * @returns {Date} The exact local date-time of the day containing the end of daylight saving time for the provided year
     */
    public static getEndDstHour(year: number): Date {
        const endDstMidnight = DateTimeUtil.getEndDstMidnight(year);
        const hoursInDstEndDay = [];
        for (let i = 0; i < 24; i++) {
            const d = new Date(endDstMidnight);
            d.setHours(i);
            hoursInDstEndDay.push(d);
        }

        return hoursInDstEndDay.reduce((prev: Date, curr: Date) => {
            if (curr.getTimezoneOffset() > prev.getTimezoneOffset()) {
                return moment(curr).subtract(1, "hour").toDate();
            }
            return prev;
        });
    }
}
