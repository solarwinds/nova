import noop from "lodash/noop";

import { LoggerService } from "./log-service";
import {UnitConversionService} from "./unit-conversion.service";

describe("services >", () => {
    describe("unit conversion >", () => {
        let logger: LoggerService;
        let logWarnSpy: jasmine.Spy;
        let subject: UnitConversionService;

        beforeEach(() => {
            logger = new LoggerService();
            spyOnProperty(logger, "error").and.returnValue(noop);
            logWarnSpy = spyOnProperty(logger, "warn").and.returnValue(noop);

            subject = new UnitConversionService(logger);
        });

        describe("when convert() is called ", () => {
            it("should handle 1000 base properly", () => {
                expect(subject.convert(1000, 1000))
                    .toEqual({
                        value: "1",
                        order: 1,
                    });
            });
            it("should handle 1024 base properly", () => {
                expect(subject.convert(1024, 1024))
                    .toEqual({
                        value: "1",
                        order: 1,
                    });
            });
            it("should handle default precision properly", () => {
                expect(subject.convert(1500, 1000))
                    .toEqual({
                        value: "1.5",
                        order: 1,
                    });
            });
            it("should handle provided precision properly", () => {
                expect(subject.convert(1506, 1000, 2))
                    .toEqual({
                        value: "1.51",
                        order: 1,
                    });
            });
            it("should handle higher orders properly", () => {
                expect(subject.convert(7300000000001, 1000))
                    .toEqual({
                        value: "7.3",
                        order: 4,
                    });
            });
            it("should handle negative values properly", () => {
                expect(subject.convert(-1000, 1000))
                    .toEqual({
                        value: "-1",
                        order: 1,
                    });
            });
            it("should handle zero value, return order 0", () => {
                expect(subject.convert(0, 1024))
                    .toEqual({
                        value: "0",
                        order: 0,
                    });
            });

            it("should handle negative value with a higher order", () => {
                expect(subject.convert(-2248, 1024))
                    .toEqual({
                        value: "-2.2",
                        order: 1,
                    });
            });

            it("should handle negative value with a custom precision (3)", () => {
                expect(subject.convert(-2848, 1024, 3))
                    .toEqual({
                        value: "-2.781",
                        order: 1,
                    });
            });

            it("should handle with warning value from a restricted arrange (0; 1)", () => {
                expect(subject.convert(0.314, 1000))
                    .toEqual({
                        value: "314",
                        order: -1,
                    });
            });

            it("should send warning notification if value is NOT allowed (0; 1)", () => {
                subject.convert(0.314, 1000);

                expect(logWarnSpy).toHaveBeenCalled();
            });
        });
    });
});
