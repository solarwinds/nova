import moment, { duration } from "moment/moment";

import { TimeIntervalScale } from "./time-interval-scale";
import { EMPTY_CONTINUOUS_DOMAIN, Formatter } from "./types";

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

    describe("title formatter", () => {
        let scale: TimeIntervalScale;

        beforeEach(() => {
            scale = new TimeIntervalScale(duration(1, "day"));
        });

        it(`should not add an hour to the output if both the input date and the start of the domain are inside daylight saving time`, () => {
            const startDate = new Date(2020, 6);
            const endDate = new Date(2020, 11);
            scale.domain([startDate, endDate]);
            expect((scale.formatters.title as Formatter<Date>)(new Date(2020, 7, 15))).toEqual("Aug 15 - Aug 16");
        });

        it(`should not add an hour to the output if both the input date and the start of the domain are outside of daylight saving time`, () => {
            const startDate = new Date(2020, 11);
            const endDate = new Date(2021, 3);
            scale.domain([startDate, endDate]);
            expect((scale.formatters.title as Formatter<Date>)(new Date(2021, 2, 15))).toEqual("Mar 15 - Mar 16");
        });
    });

    describe("truncToInterval", () => {
        let scale: TimeIntervalScale;

        beforeEach(() => {
            scale = new TimeIntervalScale(duration(1, "day"));
        });

        it(`should not subtract an hour from the output if both the input date and the start of the domain are inside daylight saving time`, () => {
            const startDate = new Date(2020, 6);
            const endDate = new Date(2020, 11);
            scale.domain([startDate, endDate]);
            const testDatetime = new Date(2020, 7, 15);
            expect(scale.truncToInterval(testDatetime, scale.interval())).toEqual(testDatetime);
        });

        it(`should not subtract an hour from the output if both the input date and the start of the domain are outside of daylight saving time`, () => {
            const startDate = new Date(2020, 11);
            const endDate = new Date(2021, 3);
            scale.domain([startDate, endDate]);
            const testDatetime = new Date(2021, 2, 15);
            expect(scale.truncToInterval(testDatetime, scale.interval())).toEqual(testDatetime);
        });

        describe("domain changes", () => {
            it(`should not subtract an hour from the output if the input date is inside daylight saving time`, () => {
                const testDatetime = new Date(2020, 6);
                expect(scale.truncToInterval(testDatetime, scale.interval(), true)).toEqual(testDatetime);
            });

            it(`should not subtract an hour from the output if the input date is outside of daylight saving time`, () => {
                const testDatetime = new Date(2020, 11);
                expect(scale.truncToInterval(testDatetime, scale.interval(), true)).toEqual(testDatetime);
            });
        });

    });


});
