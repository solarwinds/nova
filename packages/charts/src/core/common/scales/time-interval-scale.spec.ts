import moment, { duration } from "moment/moment";

import { TimeIntervalScale } from "./time-interval-scale";
import { EMPTY_CONTINUOUS_DOMAIN } from "./types";

describe("TimeIntervalScale >", () => {
    describe("domain", () => {
        it("assignment should maintain an empty domain as-is", () => {
            const scale = new TimeIntervalScale(duration(1, "days"));
            scale.domain(EMPTY_CONTINUOUS_DOMAIN as unknown as Date[]);
            expect(scale.domain()).toEqual([new Date(EMPTY_CONTINUOUS_DOMAIN[0]), new Date(EMPTY_CONTINUOUS_DOMAIN[1])]);
        });

        it("should set the domain based on the provided dates", () => {
            const startDate = new Date(2000, 0, 0);
            const endDate = new Date(2001, 0, 0);
            const scale = new TimeIntervalScale(duration(1, "week"));
            scale.domain([startDate, endDate]);
            expect(scale.domain()).toEqual([startDate, moment(endDate).add(1, "week").toDate()]);
        });
    });
});
