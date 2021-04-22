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
        let datesInYear = [];
        for (let i = 1; i <= 365; i++) {
            let d = new Date(year, 0, 1);
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
        let hoursInDstStartDay = [];
        for (let i = 0; i < 24; i++) {
            let d = new Date(startDstMidnight);
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
        let datesInYear = [];
        for (let i = 1; i <= 365; i++) {
            let d = new Date(year, 0, 1);
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
        let hoursInDstEndDay = [];
        for (let i = 0; i < 24; i++) {
            let d = new Date(endDstMidnight);
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
