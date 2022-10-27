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

import { Moment } from "moment/moment";
/** @ignore */
export const datePickerDefaults: IDatePickerConfig = {
    locale: "en",
    datepickerMode: "day",
    startingDay: 0,
    yearRange: 20,
    minMode: "day",
    maxMode: "year",
    showWeeks: false,
    dateFormat: "DD MMM YYYY",
    formatDay: "D",
    formatMonth: "MMM",
    formatYear: "YYYY",
    formatDayHeader: "dd",
    formatDayTitle: "MMMM YYYY",
    formatMonthTitle: "YYYY",
    onlyCurrentMonth: false,
    inline: false,
    isDisabled: false,
    isInErrorState: false,
};
/** @ignore */
export interface IDatePickerConfig {
    locale: string;
    datepickerMode: string;
    startingDay: number;
    yearRange: number;
    minMode: string;
    maxMode: string;
    showWeeks: boolean;
    dateFormat: string;
    formatDay: string;
    formatMonth: string;
    formatYear: string;
    formatDayHeader: string;
    formatDayTitle: string;
    formatMonthTitle: string;
    onlyCurrentMonth: boolean;
    inline: boolean;
    isDisabled: boolean;
    isInErrorState: boolean;
    dateDisabled?: IDatePickerDisabledDate[];
}
/** @ignore */
export interface IDatePickerDisabledDate {
    date: Moment;
    mode: string;
}
/** @ignore */
export const datePickerDateFormats = [
    "D MMM YY",
    "D MMM YYYY",
    "DD MMM YY",
    "DD MMM YYYY",
    "Do MMM YY",
    "Do MMM YYYY",

    "MMM D, YY",
    "MMM D, YYYY",
    "MMM DD, YY",
    "MMM DD, YYYY",
    "MMM Do, YY",
    "MMM Do, YYYY",

    "M/D/YY",
    "M/D/YYYY",
    "MM/DD/YY",
    "MM/DD/YYYY",

    "M-D-YY",
    "M-D-YYYY",
    "MM-DD-YY",
    "MM-DD-YYYY",

    "M D YY",
    "M D YYYY",
    "MM DD YY",
    "MM DD YYYY",

    "M.D.YY",
    "M.D.YYYY",
    "MM.DD.YY",
    "MM.DD.YYYY",
];
