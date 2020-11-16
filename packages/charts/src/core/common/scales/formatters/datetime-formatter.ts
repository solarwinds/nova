import { timeDay, timeMinute, timeMonth, timeYear } from "d3-time";
import moment from "moment/moment";

import { Formatter } from "../types";

const intlFormat = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(moment.locale(), options).format(date);

const formatSecond = (d: Date) => intlFormat(d, {hour: "numeric", minute: "2-digit", second: "2-digit"}),
    formatMinute = (d: Date) => intlFormat(d, {hour: "numeric", minute: "2-digit"}),
    formatWeek = (d: Date) => intlFormat(d, {month: "short", day: "2-digit"}),
    formatMonth = (d: Date) => intlFormat(d, {month: "short"}),
    formatYear = (d: Date) => intlFormat(d, {year: "numeric"});

/**
 * Formatter for dates
 */
export const datetimeFormatter: Formatter<Date> = (date: Date): string =>
    (timeMinute(date) < date ? formatSecond
        : timeDay(date) < date ? formatMinute
            : timeMonth(date) < date ? formatWeek
                : timeYear(date) < date ? formatMonth
                    : formatYear)(date);
