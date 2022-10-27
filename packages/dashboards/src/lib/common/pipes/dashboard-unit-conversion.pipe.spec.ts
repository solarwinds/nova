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

import { LoggerService, UnitBase, UnitConversionService } from "@nova-ui/bits";

import { DEFAULT_UNIT_CONVERSION_THRESHOLD } from "../constants";
import { DashboardUnitConversionPipe } from "./dashboard-unit-conversion-pipe";

describe("DashboardUnitConversionPipe >", () => {
    let pipe: DashboardUnitConversionPipe;
    const unitConversionService = new UnitConversionService(
        new LoggerService()
    );

    beforeEach(() => {
        pipe = new DashboardUnitConversionPipe(unitConversionService);
    });

    it(`should not abbreviate the value if it's less than DEFAULT_UNIT_CONVERSION_THRESHOLD`, () => {
        expect(pipe.transform(DEFAULT_UNIT_CONVERSION_THRESHOLD - 1)).toEqual(
            (DEFAULT_UNIT_CONVERSION_THRESHOLD - 1).toString()
        );
    });

    it(`should abbreviate the value if it's greater than or equal to DEFAULT_UNIT_CONVERSION_THRESHOLD`, () => {
        const conversion = unitConversionService.convert(
            DEFAULT_UNIT_CONVERSION_THRESHOLD,
            UnitBase.Standard,
            1
        );
        const expectedDisplayValue = unitConversionService.getFullDisplay(
            conversion,
            "generic"
        );

        expect(pipe.transform(DEFAULT_UNIT_CONVERSION_THRESHOLD)).toEqual(
            expectedDisplayValue
        );
    });
});
