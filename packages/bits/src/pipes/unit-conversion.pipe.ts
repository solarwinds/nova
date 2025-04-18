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

import {
    unitConversionBases,
    UnitOption,
} from "../constants/unit-conversion.constants";
import { UnitConversionService } from "../services/unit-conversion.service";

/**
 * <example-url>./../examples/index.html#/pipes/unit-conversion</example-url>
 *
 * Pipe for converting a large quantity of a small basic unit to a smaller approximation of the same quantity in a larger unit. This can be useful for
 * displaying larger values in a limited amount of space.
 */
@Pipe({
    name: "unitConversion",
    standalone: false
})
export class UnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) {}

    /**
     * Gets a string representation of the conversion of a large quantity of a small basic unit to a smaller quantity of a larger unit.
     * For example, a quantity of 1024 in bytes is output as "1 KB".
     *
     * @param value The value to convert
     * @param scale The number of significant digits to the right of the decimal to include in the converted value
     * @param plusSign Specify whether to prefix positive values with a '+'
     * @param unit The basic unit to use for the conversion result's unit label
     *
     * @returns {string} The conversion result appended with the converted unit label
     */
    transform(
        value: any,
        scale: number = 0,
        plusSign: boolean = false,
        unit: UnitOption = "bytes"
    ): string {
        const base = unitConversionBases[unit];
        const result = this.unitConversionService.convert(
            value as number,
            base,
            scale
        );

        return this.unitConversionService.getFullDisplay(
            result,
            unit,
            plusSign
        );
    }
}
