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

import { Pipe, PipeTransform } from "@angular/core";

import { UnitBase, UnitConversionService, UnitOption } from "@nova-ui/bits";

import { DEFAULT_UNIT_CONVERSION_THRESHOLD } from "../constants";

/**
 * Pipe for transforming large values to their abbreviated counterparts.
 * Conversions are applied for values 10000 or greater
 */
@Pipe({ name: "nuiDashboardUnitConversion" })
export class DashboardUnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) {}

    /**
     * Transforms a large number value to its abbreviated counterpart
     *
     * @param value The value to convert
     *
     * @returns The string representation of the converted value
     */
    public transform = (
        value: string | number | undefined,
        units: UnitOption = "generic",
        defaultThreshold: number = DEFAULT_UNIT_CONVERSION_THRESHOLD
    ): string => {
        const valueAsNumber =
            typeof value === "string" ? parseFloat(value) : value;

        if (
            valueAsNumber === undefined ||
            isNaN(valueAsNumber) ||
            (valueAsNumber < defaultThreshold && units !== "percent")
        ) {
            return value?.toString() || "";
        }

        const conversion = this.unitConversionService.convert(
            valueAsNumber,
            units === "bytes" ? UnitBase.Bytes : UnitBase.Standard,
            1
        );
        return this.unitConversionService.getFullDisplay(conversion, units);
    };
}
