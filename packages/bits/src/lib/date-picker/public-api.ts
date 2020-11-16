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
