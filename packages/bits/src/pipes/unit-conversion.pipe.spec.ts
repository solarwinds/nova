import { TestBed } from "@angular/core/testing";

import { UnitOption } from "../constants";
import { LoggerService } from "../services/log-service";
import { UnitConversionService } from "../services/unit-conversion.service";

import { UnitConversionPipe } from "./unit-conversion.pipe";


describe("filters >", () => {
    describe("unit conversion filter >", () => {
        interface IConversionFilterTestCase {
            name: string;
            inputValue: number;
            unit: UnitOption;
            expectedValue: string;
            precision?: number;
            plusSign?: boolean;
        }
        let filter: UnitConversionPipe;
        const testCases: IConversionFilterTestCase[] = [
            {
                name: "0 B to 0 B",
                inputValue: 0,
                unit: "bytes",
                expectedValue: "0 B",
            }, {
                name: "1 B to 1 B",
                inputValue: 1,
                unit: "bytes",
                expectedValue: "1 B",
            }, {
                name: "1024 B to 1 KB",
                inputValue: 1024,
                unit: "bytes",
                expectedValue: "1 KB",
            }, {
                name: "1024^2 B to 1 MB",
                inputValue: 1024 ** 2,
                unit: "bytes",
                expectedValue: "1 MB",
            }, {
                name: "1024^3 B to 1 GB",
                inputValue: 1024 ** 3,
                unit: "bytes",
                expectedValue: "1 GB",
            }, {
                name: "1024^4 B to 1 TB",
                inputValue: 1024 ** 4,
                unit: "bytes",
                expectedValue: "1 TB",
            }, {
                name: "1024^5 B to 1 PB",
                inputValue: 1024 ** 5,
                unit: "bytes",
                expectedValue: "1 PB",
            }, {
                name: "1024^5 B to 1 EB",
                inputValue: 1024 ** 6,
                unit: "bytes",
                expectedValue: "1 EB",
            }, {
                name: "1024^5 B to 1 ZB",
                inputValue: 1024 ** 7,
                unit: "bytes",
                expectedValue: "1 ZB",
            }, {
                name: "1024^5 B to 1 YB",
                inputValue: 1024 ** 8,
                unit: "bytes",
                expectedValue: "1 YB",
            }, {
                name: "1568 B to 1.53 KB with precision 2",
                inputValue: 1568,
                unit: "bytes",
                expectedValue: "1.53 KB",
                precision: 2,
            }, {
                name: "1568 B to 1.5313 KB with precision 4",
                inputValue: 1568,
                unit: "bytes",
                expectedValue: "1.5313 KB",
                precision: 4,
            }, {
                name: "1024 B to 1 KB with precision 4 and without tailing zeros",
                inputValue: 1024,
                unit: "bytes",
                expectedValue: "1 KB",
                precision: 4,
            }, {
                name: "1024 B to +1 KB with plus sign",
                inputValue: 1024,
                unit: "bytes",
                expectedValue: "+1 KB",
                plusSign: true,
            }, {
                name: "-1024 B to -1 KB with minus sign",
                inputValue: -1024,
                unit: "bytes",
                expectedValue: "-1 KB",
            }, {
                name: "null to ---",
                // @ts-ignore: Suppressing error for testing purposes
                inputValue: null,
                unit: "bytes",
                expectedValue: "---",
            }, {
                name: "0 bps to 0 bps",
                inputValue: 0,
                unit: "bitsPerSecond",
                expectedValue: "0 bps",
            }, {
                name: "1 bps to 1 bps",
                inputValue: 1,
                unit: "bitsPerSecond",
                expectedValue: "1 bps",
            }, {
                name: "1499 bps to 1 kbps",
                inputValue: 1499,
                unit: "bitsPerSecond",
                expectedValue: "1 kbps",
            }, {
                name: "1500 bps to 2 kbps",
                inputValue: 1500,
                unit: "bitsPerSecond",
                expectedValue: "2 kbps",
            }, {
                name: "1520 bps to 1.52 kbps",
                inputValue: 1520,
                unit: "bitsPerSecond",
                expectedValue: "1.52 kbps",
                precision: 2,
            }, {
                name: "0 Bps to 0 Bps",
                inputValue: 0,
                unit: "bytesPerSecond",
                expectedValue: "0 Bps",
            }, {
                name: "1 Bps to 1 Bps",
                inputValue: 1,
                unit: "bytesPerSecond",
                expectedValue: "1 Bps",
            }, {
                name: "1499 Bps to 1 kBps",
                inputValue: 1499,
                unit: "bytesPerSecond",
                expectedValue: "1 kBps",
            }, {
                name: "1000^2 Bps to 1 MBps",
                inputValue: 1000 ** 2,
                unit: "bytesPerSecond",
                expectedValue: "1 MBps",
            }, {
                name: "0 Hz to 0 Hz",
                inputValue: 0,
                unit: "hertz",
                expectedValue: "0 Hz",
            }, {
                name: "1 Hz to 1 Hz",
                inputValue: 1,
                unit: "hertz",
                expectedValue: "1 Hz",
            }, {
                name: "1000 Hz to 1 kHz",
                inputValue: 1000,
                unit: "hertz",
                expectedValue: "1 kHz",
            }, {
                name: "1000^2 Hz to 1 MHz",
                inputValue: 1000 ** 2,
                unit: "hertz",
                expectedValue: "1 MHz",
            }, {
                name: "1000^3 Hz to 1 GHz",
                inputValue: 1000 ** 3,
                unit: "hertz",
                expectedValue: "1 GHz",
            }, {
                name: "1000^4 Hz to 1 THz",
                inputValue: 1000 ** 4,
                unit: "hertz",
                expectedValue: "1 THz",
            }, {
                name: "1000^5 Hz to 1 PHz",
                inputValue: 1000 ** 5,
                unit: "hertz",
                expectedValue: "1 PHz",
            }, {
                name: "1000^6 Hz to 1 EHz",
                inputValue: 1000 ** 6,
                unit: "hertz",
                expectedValue: "1 EHz",
            }, {
                name: "1000^7 Hz to 1 ZHz",
                inputValue: 1000 ** 7,
                unit: "hertz",
                expectedValue: "1 ZHz",
            }, {
                name: "1000^8 Hz to 1 YHz",
                inputValue: 1000 ** 8,
                unit: "hertz",
                expectedValue: "1 YHz",
            }, {
                name: "1568 Hz to 1.57 kHz with precision 2",
                inputValue: 1568,
                unit: "hertz",
                precision: 2,
                expectedValue: "1.57 kHz",
            }, {
                name: "1568 Hz to 1.5680 kHz with precision 4",
                inputValue: 1568,
                unit: "hertz",
                precision: 4,
                expectedValue: "1.5680 kHz",
            }, {
                name: "-1000 Hz to -1 kHz",
                inputValue: -1000,
                unit: "hertz",
                expectedValue: "-1 kHz",
            }, {
                name: "1000 Hz to 1 kHz with precision 4 and without tailing zeros",
                inputValue: 1000,
                unit: "hertz",
                precision: 4,
                expectedValue: "1 kHz",
            },
        ];

        beforeEach(() => {
            TestBed
                .configureTestingModule({
                    providers: [LoggerService, UnitConversionService],
                });

            filter = new UnitConversionPipe(TestBed.inject(UnitConversionService));
        });

        testCases.forEach(testCase => {
            it(`should convert ${testCase.name}`, () => {
                expect(filter.transform(testCase.inputValue, testCase.precision, testCase.plusSign, testCase.unit))
                    .toBe(testCase.expectedValue);
            });
        });
    });
});
