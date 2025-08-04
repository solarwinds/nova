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

import { Injectable, inject } from "@angular/core";

import { LoggerService } from "./log-service";
import { IUnitConversionResult } from "./public-api";
import {
    UnitBase,
    unitConversionConstants,
    UnitOption,
} from "../constants/unit-conversion.constants";

/**
 * <example-url>./../examples/index.html#/common/unit-conversion-service</example-url>
 *
 * Service for converting a raw value to a larger unit approximation of the value--for example, 1024 B to 1 MB, 12345 Hz to 12.35 kHz, etc.
 */
@Injectable({ providedIn: "root" })
export class UnitConversionService {
    private logger = inject(LoggerService);


    /**
     * Converts a raw value to a larger unit approximation of the value. For example, 1024 B to 1 KB, 12345 Hz to 12.35 kHz, etc.
     *
     * @param value The value to convert
     * @param base The base to use for the exponential expression when calculating the conversion result
     *
     * @returns {{ [Key in keyof Pick<IUnitConversionResult, "value" | "order">]: number }} The value and order of conversion
     */
    private convertLinear(
        value: number,
        base: number
    ): { [Key in keyof Pick<IUnitConversionResult, "value" | "order">]: number } {
        let resultValue: number;
        let resultOrder: number;

        if (value === 0) {
            return {
                value: 0,
                order: 0,
            };
        }

        resultOrder = Math.floor(
            Math.log(Math.abs(value)) / Math.log(base)
        );
        resultValue = value / Math.pow(base, Math.floor(resultOrder));

        if (Math.abs(value) > 0 && Math.abs(value) < 1) {
            return {
                value: value,
                order: 0,
            };
        }

        // fix the precision edge case
        const valueCeiled = Math.ceil(resultValue);
        if (valueCeiled % base === 0) {
            resultValue = valueCeiled / base;
            resultOrder += 1;
        }

        return {
            value: resultValue,
            order: resultOrder,
        };
    }

    /**
     * Converts a raw value to a larger unit approximation of the value. For example, 1100ms to 1.1s, 66000ms to 1.1m, etc.
     *
     * @param value The value to convert
     * @param factors Array of factors to use for calculating smallest possible not zero result
     *
     * @returns {{ [Key in keyof Pick<IUnitConversionResult, "value" | "order">]: number }} The value and order of conversion
     */
    private convertNonLinear(
        value: number,
        factors: number[]
    ): { [Key in keyof Pick<IUnitConversionResult, "value" | "order">]: number } {
        const sortedFactors = factors.sort((a, b) => a > b ? -1 : a < b ? 1 : 0);
        const highestFactorIndex = sortedFactors.findIndex((factor) => value / factor >= 1);
        const highestFactor = factors[highestFactorIndex];

        if (Math.abs(value) > 0 && Math.abs(value) < 1) {
            return {
                value: value,
                order: 0,
            };
        }

        return {
            value: value / highestFactor,
            order: highestFactorIndex === -1 ? 0 : factors.length - highestFactorIndex - 1,
        };
    }

    /**
     * Converts a raw value to a larger unit approximation of the value. For example, 1024 B to 1 KB, 12345 Hz to 12.35 kHz, 66000ms to 1.1m, etc.
     *
     * @param value The value to convert
     * @param base The base or array of factors to use for calculating the conversion result
     * @param scale The number of significant digits to the right of the decimal to include in the resulting converted value
     *
     * @returns {IUnitConversionResult} The conversion result
     */
    convert(
        value: number,
        base: number | number[] = UnitBase.Standard,
        scale: number = 1
    ): IUnitConversionResult {
        const result = Array.isArray(base) ?
            this.convertNonLinear(value, base) :
            this.convertLinear(value, base);

        let strValue: string;

        if (value !== 0) {
            strValue = parseFloat(result.value.toFixed(scale)).toString();
        } else {
            result.order = 0;
            strValue = value.toString();
        }

        return {
            value: strValue,
            order: result.order,
            scientificNotation: value?.toExponential(scale),
            scale,
        };
    }

    /**
     * Gets the display string of a conversion result
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param unit The unit used in the conversion
     * @param plusSign Whether to prepend the display string with a '+'
     * @param nanDisplay The string to display in case the conversion result is NaN or Infinity
     *
     * @returns {string} The display string of the conversion result
     */
    public getFullDisplay(
        conversion: IUnitConversionResult,
        unit: UnitOption,
        plusSign = false,
        nanDisplay = "---"
    ): string {
        const isValidNumber = this.isValidNumber(conversion.value);
        const spacing = unit !== "generic" && isValidNumber ? " " : "";
        let unitDisplay = isValidNumber
            ? this.getUnitDisplay(conversion, unit)
            : "";

        // The generic unit is not currently i18n friendly
        const localizeValue = unit !== "generic";

        let displayValue: string;

        if (!unitDisplay && isValidNumber && conversion.order) {
            unitDisplay = this.getUnitDisplayBaseValue(unit);
            displayValue = this.getScientificDisplay(
                conversion,
                plusSign,
                nanDisplay
            );
        } else {
            displayValue = this.getValueDisplay(
                conversion,
                plusSign,
                nanDisplay,
                localizeValue
            );
        }
        return `${displayValue}${spacing}${unitDisplay}`;
    }

    /**
     * Gets the converted value display string
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param plusSign Whether to prepend the display string with a '+'
     * @param nanDisplay The string to display in case the conversion result is NaN or Infinity
     * @param localize Whether to localize the value for display. Note: It's not recommended to localize values for
     *                 the "generic" unit, e.g. "1.1K" for 1100, as the "generic" unit is currently not i18n friendly
     *
     * @returns {string} The converted value display string
     */
    public getValueDisplay(
        conversion: IUnitConversionResult,
        plusSign = false,
        nanDisplay = "---",
        localize = true
    ): string {
        if (!this.isValidNumber(conversion.value)) {
            return nanDisplay;
        }

        const outputValue = localize
            ? parseFloat(conversion.value).toLocaleString(undefined, {
                  maximumFractionDigits: conversion.scale,
              })
            : conversion.value;
        const prefix =
            plusSign && parseInt(conversion.value, 10) > 0 ? "+" : "";
        return `${prefix}${outputValue}`;
    }

    /**
     * Gets the converted unit display string
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param unit The basic unit used in the conversion
     *
     * @returns {string} The converted unit display string
     */
    public getUnitDisplay(
        conversion: IUnitConversionResult,
        unit: UnitOption
    ): string {
        return unitConversionConstants[unit][conversion.order];
    }

    /**
     * Gets the base value of the converted unit
     *
     * @param unit The basic unit used in the conversion
     *
     * @returns {string} The abbreviation for the smallest unit of the provided UnitOption
     */
    public getUnitDisplayBaseValue(unit: UnitOption): string {
        return unitConversionConstants[unit][0];
    }

    /**
     * Gets the converted value display string in scientific notation
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param plusSign Whether to prepend the display string with a '+'
     * @param nanDisplay The string to display in case the conversion result is NaN or Infinity
     *
     * @returns {string} The converted value display string in scientific notation
     */
    public getScientificDisplay(
        conversion: IUnitConversionResult,
        plusSign = false,
        nanDisplay = "---"
    ): string {
        if (!this.isValidNumber(conversion.value)) {
            return nanDisplay;
        }
        const prefix =
            plusSign && parseInt(conversion.value, 10) > 0 ? "+" : "";

        return `${prefix}${conversion.scientificNotation}`;
    }

    private isValidNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(parseInt(value, 10));
    }
}
