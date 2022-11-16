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

import { timeDay, timeMinute, timeMonth, timeYear } from "d3";
import moment from "moment/moment";

import { Formatter } from "../types";

const intlFormat = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(moment.locale(), options).format(date);

const formatSecond = (d: Date) =>
    intlFormat(d, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });

const formatMinute = (d: Date) =>
    intlFormat(d, { hour: "numeric", minute: "2-digit" });

const formatWeek = (d: Date) =>
    intlFormat(d, { month: "short", day: "2-digit" });

const formatMonth = (d: Date) => intlFormat(d, { month: "short" });

const formatYear = (d: Date) => intlFormat(d, { year: "numeric" });

/**
 * Formatter for dates
 */
export const datetimeFormatter: Formatter<Date> = (date: Date): string => {
    if (timeMinute(date) < date) {
        return formatSecond(date);
    }
    if (timeDay(date) < date) {
        return formatMinute(date);
    }
    if (timeMonth(date) < date) {
        return formatWeek(date);
    }
    if (timeYear(date) < date) {
        return formatMonth(date);
    }
    return formatYear(date);
};
