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

import noop from "lodash/noop";

import { LoggerService } from "./log-service";
import { UnitConversionService } from "./unit-conversion.service";
import {
    UnitBase,
    unitConversionBases,
    UnitOption,
} from "../constants/unit-conversion.constants";

describe("services >", () => {
    describe("unit conversion >", () => {
        let logger: LoggerService;
        let subject: UnitConversionService;

        beforeEach(() => {
            logger = new LoggerService();
            spyOnProperty(logger, "error").and.returnValue(noop);
            spyOnProperty(logger, "warn").and.returnValue(noop);

            subject = new UnitConversionService(logger);
        });

        describe("convert > ", () => {
            it("should handle UnitBase.Standard properly", () => {
                expect(subject.convert(1000)).toEqual({
                    value: "1",
                    order: 1,
                    scientificNotation: "1.0e+3",
                    scale: 1,
                });
            });
            it("should handle UnitBase.Bytes properly", () => {
                expect(subject.convert(1024, UnitBase.Bytes)).toEqual({
                    value: "1",
                    order: 1,
                    scientificNotation: "1.0e+3",
                    scale: 1,
                });
            });
            it("should handle default scale properly", () => {
                expect(subject.convert(1500)).toEqual({
                    value: "1.5",
                    order: 1,
                    scientificNotation: "1.5e+3",
                    scale: 1,
                });
            });
            it("should handle provided scale properly", () => {
                expect(subject.convert(1506, UnitBase.Standard, 2)).toEqual({
                    value: "1.51",
                    order: 1,
                    scientificNotation: "1.51e+3",
                    scale: 2,
                });
            });
            it("should handle higher orders properly", () => {
                expect(subject.convert(7300000000001)).toEqual({
                    value: "7.3",
                    order: 4,
                    scientificNotation: "7.3e+12",
                    scale: 1,
                });
            });
            it("should handle negative values properly", () => {
                expect(subject.convert(-1000)).toEqual({
                    value: "-1",
                    order: 1,
                    scientificNotation: "-1.0e+3",
                    scale: 1,
                });
            });
            it("should handle zero value, return order 0", () => {
                expect(subject.convert(0, UnitBase.Bytes)).toEqual({
                    value: "0",
                    order: 0,
                    scientificNotation: "0.0e+0",
                    scale: 1,
                });
            });

            it("should handle negative value with a higher order", () => {
                expect(subject.convert(-2248, UnitBase.Bytes)).toEqual({
                    value: "-2.2",
                    order: 1,
                    scientificNotation: "-2.2e+3",
                    scale: 1,
                });
            });

            it("should handle negative value with a custom scale (3)", () => {
                expect(subject.convert(-2848, UnitBase.Bytes, 3)).toEqual({
                    value: "-2.781",
                    order: 1,
                    scientificNotation: "-2.848e+3",
                    scale: 3,
                });
            });

            it("should handle a value with only decimals", () => {
                expect(subject.convert(0.314)).toEqual({
                    value: "0.3",
                    order: 0,
                    scientificNotation: "3.1e-1",
                    scale: 1,
                });
            });

            it("should remove trailing zeros", () => {
                expect(
                    subject.convert(998_900, UnitBase.Standard, 2).value
                ).toEqual("998.9");
            });
        });

        describe("getValueDisplay >", () => {
            it("should use the 'nanDisplay' if the input is not a valid number", () => {
                const nanDisplay = "000";
                expect(
                    subject.getValueDisplay(
                        { value: "NaN", order: -1, scientificNotation: "NaN" },
                        false,
                        nanDisplay
                    )
                ).toEqual(nanDisplay);
            });

            it("should prefix the output with a plus sign for positive values", () => {
                expect(
                    subject.getValueDisplay(
                        { value: "1", order: 1, scientificNotation: "1.0e+0" },
                        true
                    )
                ).toEqual("+1");
            });

            it("should not prefix the output with a plus sign for negative values", () => {
                expect(
                    subject.getValueDisplay(
                        {
                            value: "-1",
                            order: 1,
                            scientificNotation: "-1.0e+0",
                        },
                        true
                    )
                ).toEqual("-1");
            });

            it("should localize the output", () => {
                const scale = 3;
                const spy = spyOn(Number.prototype, "toLocaleString");
                const conversion = subject.convert(
                    1000,
                    UnitBase.Standard,
                    scale
                );
                subject.getValueDisplay(conversion);
                expect(spy).toHaveBeenCalledWith(undefined, {
                    maximumFractionDigits: scale,
                });
            });

            it("should disable localization of the output", () => {
                const scale = 3;
                const spy = spyOn(Number.prototype, "toLocaleString");
                const conversion = subject.convert(
                    1000,
                    UnitBase.Standard,
                    scale
                );
                subject.getValueDisplay(conversion, false, "---", false);
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe("getScientificDisplay >", () => {
            it("should use the 'nanDisplay' if the input is not a valid number", () => {
                const nanDisplay = "000";
                expect(
                    subject.getScientificDisplay(
                        { value: "NaN", order: -1, scientificNotation: "NaN" },
                        false,
                        nanDisplay
                    )
                ).toEqual(nanDisplay);
            });

            it("should prefix the output with a plus sign for positive values", () => {
                expect(
                    subject.getScientificDisplay(
                        { value: "1", order: 1, scientificNotation: "1.0e+0" },
                        true
                    )
                ).toEqual("+1.0e+0");
            });

            it("should not prefix the output with a plus sign for negative values", () => {
                expect(
                    subject.getScientificDisplay(
                        {
                            value: "-1",
                            order: 1,
                            scientificNotation: "-1.0e+0",
                        },
                        true
                    )
                ).toEqual("-1.0e+0");
            });
        });

        describe("getUnitDisplay >", () => {
            it("should output the correct unit based on the conversion result", () => {
                expect(
                    subject.getUnitDisplay(
                        { value: "1", order: 3, scientificNotation: "1.0e+9" },
                        "bitsPerSecond"
                    )
                ).toEqual("Gbps");
            });
        });

        describe("getFullDisplay >", () => {
            interface IConversionFilterTestCase {
                name: string;
                inputValue: number;
                unit: UnitOption;
                expectedValue: string;
                scale?: number;
                plusSign?: boolean;
            }

            const testCases: IConversionFilterTestCase[] = [
                {
                    name: "0 as 0",
                    inputValue: 0,
                    unit: "generic",
                    expectedValue: "0",
                },
                {
                    name: "1 as 1",
                    inputValue: 1,
                    unit: "generic",
                    expectedValue: "1",
                },
                {
                    name: "1000 as 1K",
                    inputValue: 1000,
                    unit: "generic",
                    expectedValue: "1K",
                },
                {
                    name: "1000^2 as 1M",
                    inputValue: 1000 ** 2,
                    unit: "generic",
                    expectedValue: "1M",
                },
                {
                    name: "1000^3 as 1B",
                    inputValue: 1000 ** 3,
                    unit: "generic",
                    expectedValue: "1B",
                },
                {
                    name: "1000^4 as 1T",
                    inputValue: 1000 ** 4,
                    unit: "generic",
                    expectedValue: "1T",
                },
                {
                    name: "1000^5 as 1Qa",
                    inputValue: 1000 ** 5,
                    unit: "generic",
                    expectedValue: "1Qa",
                },
                {
                    name: "1000^6 as 1Qi",
                    inputValue: 1000 ** 6,
                    unit: "generic",
                    expectedValue: "1Qi",
                },
                {
                    name: "1000^7 as 1Sx",
                    inputValue: 1000 ** 7,
                    unit: "generic",
                    expectedValue: "1Sx",
                },
                {
                    name: "1000^8 as 1Sp",
                    inputValue: 1000 ** 8,
                    unit: "generic",
                    expectedValue: "1Sp",
                },
                {
                    name: "1000^11 as 1Sp",
                    inputValue: 1000 ** 11,
                    unit: "generic",
                    expectedValue: "1.0e+33",
                },
                {
                    name: "0 B as 0 B",
                    inputValue: 0,
                    unit: "bytes",
                    expectedValue: "0 B",
                },
                {
                    name: "1 B as 1 B",
                    inputValue: 1,
                    unit: "bytes",
                    expectedValue: "1 B",
                },
                {
                    name: "1024 B as 1 KB",
                    inputValue: 1024,
                    unit: "bytes",
                    expectedValue: "1 KB",
                },
                {
                    name: "1024^2 B as 1 MB",
                    inputValue: 1024 ** 2,
                    unit: "bytes",
                    expectedValue: "1 MB",
                },
                {
                    name: "1024^3 B as 1 GB",
                    inputValue: 1024 ** 3,
                    unit: "bytes",
                    expectedValue: "1 GB",
                },
                {
                    name: "1024^4 B as 1 TB",
                    inputValue: 1024 ** 4,
                    unit: "bytes",
                    expectedValue: "1 TB",
                },
                {
                    name: "1024^5 B as 1 PB",
                    inputValue: 1024 ** 5,
                    unit: "bytes",
                    expectedValue: "1 PB",
                },
                {
                    name: "1024^6 B as 1 EB",
                    inputValue: 1024 ** 6,
                    unit: "bytes",
                    expectedValue: "1 EB",
                },
                {
                    name: "1024^7 B as 1 ZB",
                    inputValue: 1024 ** 7,
                    unit: "bytes",
                    expectedValue: "1 ZB",
                },
                {
                    name: "1024^8 B as 1 YB",
                    inputValue: 1024 ** 8,
                    unit: "bytes",
                    expectedValue: "1 YB",
                },
                {
                    name: "1568 B as 1.53 KB with scale 2",
                    inputValue: 1568,
                    unit: "bytes",
                    expectedValue: "1.53 KB",
                    scale: 2,
                },
                {
                    name: "1568 B as 1.5313 KB with scale 4",
                    inputValue: 1568,
                    unit: "bytes",
                    expectedValue: "1.5313 KB",
                    scale: 4,
                },
                {
                    name: "1024 B as 1 KB with scale 4 and without tailing zeros",
                    inputValue: 1024,
                    unit: "bytes",
                    expectedValue: "1 KB",
                    scale: 4,
                },
                {
                    name: "1024 B as +1 KB with plus sign",
                    inputValue: 1024,
                    unit: "bytes",
                    expectedValue: "+1 KB",
                    plusSign: true,
                },
                {
                    name: "-1024 B as -1 KB with minus sign",
                    inputValue: -1024,
                    unit: "bytes",
                    expectedValue: "-1 KB",
                },
                {
                    name: "null as ---",
                    // @ts-ignore: Suppressing error for testing purposes
                    inputValue: null,
                    unit: "bytes",
                    expectedValue: "---",
                },
                {
                    name: "0 bps as 0 bps",
                    inputValue: 0,
                    unit: "bitsPerSecond",
                    expectedValue: "0 bps",
                },
                {
                    name: "1 bps as 1 bps",
                    inputValue: 1,
                    unit: "bitsPerSecond",
                    expectedValue: "1 bps",
                },
                {
                    name: "1499 bps as 1 kbps",
                    inputValue: 1499,
                    unit: "bitsPerSecond",
                    scale: 0,
                    expectedValue: "1 kbps",
                },
                {
                    name: "1500 bps as 2 kbps",
                    inputValue: 1500,
                    unit: "bitsPerSecond",
                    scale: 0,
                    expectedValue: "2 kbps",
                },
                {
                    name: "1520 bps as 1.52 kbps",
                    inputValue: 1520,
                    unit: "bitsPerSecond",
                    expectedValue: "1.52 kbps",
                    scale: 2,
                },
                {
                    name: "0 Bps as 0 Bps",
                    inputValue: 0,
                    unit: "bytesPerSecond",
                    expectedValue: "0 Bps",
                },
                {
                    name: "1 Bps as 1 Bps",
                    inputValue: 1,
                    unit: "bytesPerSecond",
                    expectedValue: "1 Bps",
                },
                {
                    name: "1499 Bps as 1 kBps",
                    inputValue: 1499,
                    unit: "bytesPerSecond",
                    scale: 0,
                    expectedValue: "1 kBps",
                },
                {
                    name: "1000^2 Bps as 1 MBps",
                    inputValue: 1000 ** 2,
                    unit: "bytesPerSecond",
                    expectedValue: "1 MBps",
                },
                {
                    name: "0 Hz as 0 Hz",
                    inputValue: 0,
                    unit: "hertz",
                    expectedValue: "0 Hz",
                },
                {
                    name: "1 Hz as 1 Hz",
                    inputValue: 1,
                    unit: "hertz",
                    expectedValue: "1 Hz",
                },
                {
                    name: "1000 Hz as 1 kHz",
                    inputValue: 1000,
                    unit: "hertz",
                    expectedValue: "1 kHz",
                },
                {
                    name: "1000^2 Hz as 1 MHz",
                    inputValue: 1000 ** 2,
                    unit: "hertz",
                    expectedValue: "1 MHz",
                },
                {
                    name: "1000^3 Hz as 1 GHz",
                    inputValue: 1000 ** 3,
                    unit: "hertz",
                    expectedValue: "1 GHz",
                },
                {
                    name: "1000^4 Hz as 1 THz",
                    inputValue: 1000 ** 4,
                    unit: "hertz",
                    expectedValue: "1 THz",
                },
                {
                    name: "1000^5 Hz as 1 PHz",
                    inputValue: 1000 ** 5,
                    unit: "hertz",
                    expectedValue: "1 PHz",
                },
                {
                    name: "1000^6 Hz as 1 EHz",
                    inputValue: 1000 ** 6,
                    unit: "hertz",
                    expectedValue: "1 EHz",
                },
                {
                    name: "1000^7 Hz as 1 ZHz",
                    inputValue: 1000 ** 7,
                    unit: "hertz",
                    expectedValue: "1 ZHz",
                },
                {
                    name: "1000^8 Hz as 1 YHz",
                    inputValue: 1000 ** 8,
                    unit: "hertz",
                    expectedValue: "1 YHz",
                },
                {
                    name: "1568 Hz as 1.57 kHz with scale 2",
                    inputValue: 1568,
                    unit: "hertz",
                    scale: 2,
                    expectedValue: "1.57 kHz",
                },
                {
                    name: "1568 Hz as 1.568 kHz with scale 4",
                    inputValue: 1568,
                    unit: "hertz",
                    scale: 4,
                    expectedValue: "1.568 kHz",
                },
                {
                    name: "-1000 Hz as -1 kHz",
                    inputValue: -1000,
                    unit: "hertz",
                    expectedValue: "-1 kHz",
                },
                {
                    name: "1000 Hz as 1 kHz with scale 4 and without trailing zeros",
                    inputValue: 1000,
                    unit: "hertz",
                    scale: 4,
                    expectedValue: "1 kHz",
                },
                // Uncomment in the scope of NUI-6056
                /* {
                    name: "999994 Hz as 1.99 kHz with scale 2",
                    inputValue: 999_994,
                    unit: "hertz",
                    scale: 2,
                    expectedValue: "999.99 kHz",
                }, */ {
                    name: "999995 Hz as 1 MHz with scale 2",
                    inputValue: 999_995,
                    unit: "hertz",
                    scale: 2,
                    expectedValue: "1 MHz",
                },
                {
                    name: "1 ms as 1 ms",
                    inputValue: 1,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 ms",
                },
                {
                    name: "100 ms as 100 ms",
                    inputValue: 100,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "100 ms",
                },
                {
                    name: "1100 ms as 1 s",
                    inputValue: 1_100,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 s",
                },
                {
                    name: "1100 ms as 1.1 s",
                    inputValue: 1_100,
                    unit: "milliseconds",
                    scale: 1,
                    expectedValue: "1.1 s",
                },
                {
                    name: "5500 ms as 5.5 s",
                    inputValue: 5_500,
                    unit: "milliseconds",
                    scale: 2,
                    expectedValue: "5.5 s",
                },
                {
                    name: "60000 ms as 1 m",
                    inputValue: 60_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 m",
                },
                {
                    name: "60000 ms as 1 m",
                    inputValue: 60_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 m",
                },
                {
                    name: "66000 ms as 1 m",
                    inputValue: 66_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 m",
                },
                {
                    name: "72000 ms as 1.2 m",
                    inputValue: 72_000,
                    unit: "milliseconds",
                    scale: 1,
                    expectedValue: "1.2 m",
                },
                {
                    name: "1830000 ms as 30.5 m",
                    inputValue: 1_830_000,
                    unit: "milliseconds",
                    scale: 2,
                    expectedValue: "30.5 m",
                },
                {
                    name: "1835000 ms as 30.58 m",
                    inputValue: 1_835_000,
                    unit: "milliseconds",
                    scale: 2,
                    expectedValue: "30.58 m",
                },
                {
                    name: "3600000 ms as 1 h",
                    inputValue: 3_600_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 h",
                },
                {
                    name: "5400000 ms as 2 h",
                    inputValue: 5_400_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "2 h",
                },
                {
                    name: "5400000 ms as 1.5 h",
                    inputValue: 5_400_000,
                    unit: "milliseconds",
                    scale: 1,
                    expectedValue: "1.5 h",
                },
                {
                    name: "6330000 as 2 h",
                    inputValue: 6_330_000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "2 h",
                },
                {
                    name: "6330000 ms as 1.76 h",
                    inputValue: 6_330_000,
                    unit: "milliseconds",
                    scale: 2,
                    expectedValue: "1.76 h",
                },
                {
                    name: "6330000 ms as 1.758 h",
                    inputValue: 6_330_000,
                    unit: "milliseconds",
                    scale: 3,
                    expectedValue: "1.758 h",
                },
                {
                    name: "6330000 ms as 1.7583 h",
                    inputValue: 6_330_000,
                    unit: "milliseconds",
                    scale: 4,
                    expectedValue: "1.7583 h",
                },
                {
                    name: "86400000 ms as 1 d",
                    inputValue: 86400000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "1 d",
                },
                {
                    name: "129600000 ms as 2 d",
                    inputValue: 129600000,
                    unit: "milliseconds",
                    scale: 0,
                    expectedValue: "2 d",
                },
                {
                    name: "129600000 ms as 1.5 d",
                    inputValue: 129600000,
                    unit: "milliseconds",
                    scale: 1,
                    expectedValue: "1.5 d",
                },
                {
                    name: "131400000 ms as 1.5 d",
                    inputValue: 131400000,
                    unit: "milliseconds",
                    scale: 1,
                    expectedValue: "1.5 d",
                },
                {
                    name: "131400000 ms as 1.521 d",
                    inputValue: 131400000,
                    unit: "milliseconds",
                    scale: 3,
                    expectedValue: "1.521 d",
                },
            ];

            testCases.forEach((testCase) => {
                it(`should display ${testCase.name}`, () => {
                    const base = unitConversionBases[testCase.unit];
                    const conversion = subject.convert(
                        testCase.inputValue,
                        base,
                        testCase.scale
                    );
                    expect(
                        subject.getFullDisplay(
                            conversion,
                            testCase.unit,
                            testCase.plusSign
                        )
                    ).toEqual(testCase.expectedValue);
                });
            });
        });
    });
});
