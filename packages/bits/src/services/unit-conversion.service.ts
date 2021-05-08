import { Injectable } from "@angular/core";

import { UnitBase, unitConversionConstants, UnitOption } from "../constants";

import { LoggerService } from "./log-service";
import { IUnitConversionResult } from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/unit-conversion-service</example-url>
 *
 * Service for converting a raw value to a larger unit approximation of the value--for example, 1024 B to 1 MB, 12345 Hz to 12.35 kHz, etc.
 */
@Injectable({ providedIn: "root" })
export class UnitConversionService {
    constructor(private logger: LoggerService) { }

    /**
     * Converts a raw value to a larger unit approximation of the value. For example, 1024 B to 1 KB, 12345 Hz to 12.35 kHz, etc.
     *
     * @param value The value to convert
     * @param base The base to use for the exponential expression when calculating the conversion result
     * @param scale The number of significant digits to the right of the decimal to include in the resulting converted value
     *
     * @returns {IUnitConversionResult} The conversion result
     */
    convert(value: number, base: number = UnitBase.Standard, scale: number = 1): IUnitConversionResult {
        let resultValue: number;
        let resultOrder: number;
        let strValue: string;

        if (value !== 0) {
            resultOrder = Math.floor(Math.log(Math.abs(value)) / Math.log(base));
            resultValue = value / Math.pow(base, Math.floor(resultOrder));

            if (value > 0 && value < 1) {
                this.logger.warn("unit conversion service does not support conversion to negative order of magnitude");
            }

            // fix the precision edge case
            const valueCeiled = Math.ceil(resultValue);
            if (valueCeiled % base === 0) {
                resultValue = valueCeiled / base;
                resultOrder += 1;
            }

            strValue = (resultValue).toFixed(scale);

            // remove trailing zeros
            strValue = parseFloat(strValue).toString();
        } else {
            resultOrder = 0;
            strValue = value.toString();
        }

        return {
            value: strValue,
            order: resultOrder,
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
    public getFullDisplay(conversion: IUnitConversionResult, unit: UnitOption, plusSign = false, nanDisplay = "---"): string {
        const isValidNumber = this.isValidNumber(conversion.value);
        const spacing = unit !== "generic" && isValidNumber ? " " : "";
        const unitDisplay = isValidNumber ? this.getUnitDisplay(conversion, unit) : "";

        return `${this.getValueDisplay(conversion, plusSign, nanDisplay)}${spacing}${unitDisplay}`;
    }

    /**
     * Gets the converted value display string
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param plusSign Whether to prepend the display string with a '+'
     * @param nanDisplay The string to display in case the conversion result is NaN or Infinity
     *
     * @returns {string} The converted value display string
     */
    public getValueDisplay(conversion: IUnitConversionResult, plusSign = false, nanDisplay = "---"): string {
        if (!this.isValidNumber(conversion.value)) {
            return nanDisplay;
        }

        const prefix = plusSign && parseInt(conversion.value, 10) > 0 ? "+" : "";
        return `${prefix}${conversion.value}`;
    }

    /**
     * Gets the converted unit display string
     *
     * @param conversion The result of an invocation of this service's convert method
     * @param unit The basic unit used in the conversion
     *
     * @returns {string} The converted unit display string
     */
    public getUnitDisplay(conversion: IUnitConversionResult, unit: UnitOption): string {
        return unitConversionConstants[unit][conversion.order];
    }

    private isValidNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(parseInt(value, 10));
    }
}
