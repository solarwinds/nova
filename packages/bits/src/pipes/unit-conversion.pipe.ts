import { Pipe, PipeTransform } from "@angular/core";

import { UnitOption } from "../constants/unit-conversion.constant";
import { UnitConversionService } from "../services/unit-conversion.service";

/**
 * Pipe used for formatting value based on the specified unit. Unit suffix is automatically added based on value.
 * Units that are supported: generic (k, M, B, etc.), bytes, bytes per second, bits per second, and hertz.
 *
 * __Parameters :__
 *
 * value - value to be converted
 *
 * precision - precision of formatted value. Extra trailing zeros are removed independently of the precision.
 *
 * plusSign - If true and source value is positive, plus sign prefix is added.
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

        const result = this.unitConversionService.convert(value as number, scale, precision);
        return this.unitConversionService.getDisplayString(result, unit, plusSign);
    }
}
