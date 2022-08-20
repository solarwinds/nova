import moment, { duration } from "moment/moment";

import { TimeIntervalScale } from "./time-interval-scale";
import { EMPTY_CONTINUOUS_DOMAIN, Formatter } from "./types";

describe("TimeIntervalScale >", () => {
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const testedTimeZone = "America/Chicago";

    describe("domain", () => {
        it("assignment should maintain an empty domain as-is", () => {
            const scale = new TimeIntervalScale(duration(1, "days"));
            scale.domain(EMPTY_CONTINUOUS_DOMAIN as unknown as Date[]);
            expect(scale.domain()).toEqual([
                new Date(EMPTY_CONTINUOUS_DOMAIN[0]),
                new Date(EMPTY_CONTINUOUS_DOMAIN[1]),
            ]);
        });

        it("should set the domain based on the provided dates", () => {
            const startDate = new Date(2000, 0, 0);
            const endDate = new Date(2001, 0, 0);
            const scale = new TimeIntervalScale(duration(1, "week"));
            scale.domain([startDate, endDate]);
            expect(scale.domain()).toEqual([
                startDate,
                moment(endDate).add(1, "week").toDate(),
            ]);
        });

        // These tests are tailored to the 'testedTimeZone'
        if (testedTimeZone === localTimezone) {
            describe("daylight saving time transitions", () => {
                it("should include bands for all intervals if transitioning to daylight saving time with a one day or longer interval", () => {
                    const startDate = new Date(2021, 2, 14);
                    const endDate = new Date(2021, 2, 18);
                    const scale = new TimeIntervalScale(duration(1, "day"));
                    scale.domain([startDate, endDate]);
                    expect((<any>scale)._bandScale.domain().length).toEqual(5);
                });

                it("should include bands for all intervals if transitioning to daylight saving time with an interval shorter than a day", () => {
                    const startDate = new Date(2021, 2, 14, 1);
                    const endDate = new Date(2021, 2, 14, 6);
                    const scale = new TimeIntervalScale(duration(1, "hour"));
                    scale.domain([startDate, endDate]);
                    expect((<any>scale)._bandScale.domain().length).toEqual(5);
                });
            });
        }
    });

    describe("title formatter", () => {
        describe("outside daylight saving time", () => {
            it(`should not add an hour to the output`, () => {
                const startDate = new Date(2020, 11);
                const endDate = new Date(2021, 3);
                const scale = new TimeIntervalScale(duration(1, "day"));
                scale.domain([startDate, endDate]);
                expect(
                    (scale.formatters.title as Formatter<Date>)(
                        new Date(2021, 1, 15)
                    )
                ).toEqual("Feb 15 - Feb 16");
            });
        });

        describe("inside daylight saving time", () => {
            it(`should not add an hour to the output`, () => {
                const startDate = new Date(2020, 6);
                const endDate = new Date(2020, 11);
                const scale = new TimeIntervalScale(duration(1, "day"));
                scale.domain([startDate, endDate]);
                expect(
                    (scale.formatters.title as Formatter<Date>)(
                        new Date(2020, 7, 15)
                    )
                ).toEqual("Aug 15 - Aug 16");
            });
        });

        // These tests are tailored to the 'testedTimeZone'
        if (testedTimeZone === localTimezone) {
            describe("daylight saving time transitions", () => {
                describe("transition to daylight saving time", () => {
                    it("should subtract an hour from the output if the interval is a day or longer", () => {
                        const startDate = new Date(2021, 2, 14);
                        const endDate = new Date(2021, 2, 18);
                        const scale = new TimeIntervalScale(duration(1, "day"));
                        scale.domain([startDate, endDate]);
                        expect(
                            (scale.formatters.title as Formatter<Date>)(
                                new Date(2021, 2, 16, 1)
                            )
                        ).toEqual("Mar 16 - Mar 17");
                    });

                    it("should not subtract an hour from the output if the interval is shorter than a day", () => {
                        const startDate = new Date(2021, 2, 14, 1);
                        const endDate = new Date(2021, 2, 14, 6);
                        const scale = new TimeIntervalScale(
                            duration(1, "hour")
                        );
                        scale.domain([startDate, endDate]);
                        expect(
                            (scale.formatters.title as Formatter<Date>)(
                                new Date(2021, 2, 14, 3)
                            )
                        ).toEqual("3:00 AM - 4:00 AM");
                    });
                });

                describe("transition from daylight saving time", () => {
                    it("should add an hour to the output if the interval is a day or longer", () => {
                        const startDate = new Date(2020, 9, 31);
                        const endDate = new Date(2020, 10, 4);
                        const scale = new TimeIntervalScale(duration(1, "day"));
                        scale.domain([startDate, endDate]);
                        expect(
                            (scale.formatters.title as Formatter<Date>)(
                                new Date(2020, 10, 2, 23)
                            )
                        ).toEqual("Nov 03 - Nov 04");
                    });

                    it("should not add an hour to the output if the interval is shorter than a day", () => {
                        const startDate = new Date(2020, 10, 1, 1);
                        const endDate = new Date(2020, 10, 1, 6);
                        const scale = new TimeIntervalScale(
                            duration(1, "hour")
                        );
                        scale.domain([startDate, endDate]);
                        expect(
                            (scale.formatters.title as Formatter<Date>)(
                                new Date(2020, 10, 1, 5)
                            )
                        ).toEqual("5:00 AM - 6:00 AM");
                    });
                });
            });
        }
    });

    describe("truncToInterval", () => {
        let scale: TimeIntervalScale;

        beforeEach(() => {
            scale = new TimeIntervalScale(duration(1, "day"));
        });

        describe("outside daylight saving time", () => {
            it(`should not subtract an hour from the output`, () => {
                const startDate = new Date(2020, 11);
                const endDate = new Date(2021, 3);
                scale.domain([startDate, endDate]);
                const testDatetime = new Date(2021, 1, 15);
                expect(
                    scale.truncToInterval(testDatetime, scale.interval())
                ).toEqual(testDatetime);
            });

            describe("domain changes", () => {
                it(`should not subtract an hour from the output`, () => {
                    const testDatetime = new Date(2020, 11);
                    expect(
                        scale.truncToInterval(
                            testDatetime,
                            scale.interval(),
                            true
                        )
                    ).toEqual(testDatetime);
                });
            });
        });

        describe("inside daylight saving time", () => {
            it(`should not subtract an hour from the output`, () => {
                const startDate = new Date(2020, 6);
                const endDate = new Date(2020, 11);
                scale.domain([startDate, endDate]);
                const testDatetime = new Date(2020, 7, 15);
                expect(
                    scale.truncToInterval(testDatetime, scale.interval())
                ).toEqual(testDatetime);
            });

            describe("domain changes", () => {
                it(`should not subtract an hour from the output`, () => {
                    const testDatetime = new Date(2020, 6);
                    expect(
                        scale.truncToInterval(
                            testDatetime,
                            scale.interval(),
                            true
                        )
                    ).toEqual(testDatetime);
                });
            });
        });

        // These tests are tailored to the 'testedTimeZone'
        if (testedTimeZone === localTimezone) {
            describe("daylight saving time transitions", () => {
                describe("transition to daylight saving time", () => {
                    it("should add one hour to the output date", () => {
                        const startDate = new Date(2021, 2, 14);
                        const endDate = new Date(2021, 2, 18);
                        scale.domain([startDate, endDate]);
                        const testDatetime = new Date(2020, 2, 15);
                        const oneHourInMs = 60 * 60 * 1000;
                        const expectedDate = new Date(
                            testDatetime.getTime() + oneHourInMs
                        );
                        expect(
                            scale.truncToInterval(
                                testDatetime,
                                scale.interval()
                            )
                        ).toEqual(expectedDate);
                    });
                });

                describe("transition from daylight saving time", () => {
                    it("should subtract one hour from the output date", () => {
                        const startDate = new Date(2020, 9, 31);
                        const endDate = new Date(2020, 10, 4);
                        scale.domain([startDate, endDate]);
                        const testDatetime = new Date(2020, 10, 3);
                        const oneHourInMs = 60 * 60 * 1000;
                        const expectedDate = new Date(
                            testDatetime.getTime() - oneHourInMs
                        );
                        expect(
                            scale.truncToInterval(
                                testDatetime,
                                scale.interval()
                            )
                        ).toEqual(expectedDate);
                    });
                });
            });
        }
    });
});
