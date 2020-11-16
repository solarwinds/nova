import { Pipe, PipeTransform } from "@angular/core";
import isFinite from "lodash/isFinite";
import isNaN from "lodash/isNaN";

import { unitConversionConstants, UnitOption } from "../constants/unit-conversion.constant";
import { IUnitConversionResult } from "../services/public-api";
import { UnitConversionService } from "../services/unit-conversion.service";

/**
 * Filter used for formatting value of different units. Unit suffix is automatically added based on value.
 * Units that are supported: bytes, bits per second, hertz.
 *
 * __Parameters :__
 *
 * value - value to be converted
 *
 * precision - precision of formatted value. Extra trailing zeros are removed independently of the precision.
 *
 * plusSignIf - true and source value is positive, plus sign prefix is added.
 *
 * unit - type of unit: bytes, bits per second or hertz. Effects scale and unit shortcut value in the function output.
 *
 * __Usage :__
 *   value | unitConversion:precision:plusSign:unit
 *
 * __Example :__
 *   <code>{{ 1200 | unitConversion:2:false:"bitsPerSecond" }}</code>
 *
 */
@Pipe({
    name: "unitConversion",
})
export class UnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) {}

    transform(value: any, precision: number = 0, plusSign: boolean = false, unit: UnitOption = "bytes"): string {
        const scale = unit === "bytes" ? 1024 : 1000;

        if (isNaN(parseFloat(value)) || !isFinite(value)) {
            return "---";
        }

        if (value === 0) {
            return value + " " + unitConversionConstants[unit][0];
        }
        const convResult: IUnitConversionResult = this.unitConversionService.convert(value as number, scale, precision);
        const prefix = plusSign && value > 0 ? "+" : "";

        return prefix + convResult.value + " " + unitConversionConstants[unit][convResult.order];
    }
}
