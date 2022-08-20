import moment from "moment/moment";

import { datetimeFormatter } from "./datetime-formatter";

describe("datetime formatter >", () => {
    it("uses seconds format", () => {
        const date = moment("2019-01-08 09:31:45");
        expect(datetimeFormatter(date.toDate())).toEqual("9:31:45 AM");
    });

    it("uses minutes format", () => {
        const date1 = moment("2019-01-08 09:31:00");
        expect(datetimeFormatter(date1.toDate())).toEqual("9:31 AM");

        const date2 = moment("2019-01-08 09:00:00");
        expect(datetimeFormatter(date2.toDate())).toEqual("9:00 AM");
    });

    it("uses day format", () => {
        const date = moment("2019-02-08 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("Feb 08");
    });

    it("uses month format", () => {
        const date = moment("2019-02-01 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("Feb");
    });

    it("uses year format", () => {
        const date = moment("2019-01-01 00:00:00");
        expect(datetimeFormatter(date.toDate())).toEqual("2019");
    });
});
