import { Pipe, PipeTransform } from "@angular/core";

import { UnitBase, UnitOption } from "../constants/unit-conversion.constants";
import { UnitConversionService } from "../services/unit-conversion.service";

/**
 * <example-url>./../examples/index.html#/pipes/unit-conversion</example-url>
 *
 * Pipe for converting a large quantity of a small basic unit to a smaller approximation of the same quantity in a larger unit. This can be useful for
 * displaying larger values in a limited amount of space.
 */
@Pipe({
    name: "unitConversion",
})
export class UnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) {}

    /**
     * Gets a string representation of the conversion of a large quantity of a small basic unit to a smaller quantity of a larger unit.
     * For example, 1024 bytes is output as 1 KB
     *
     * @param value The value to convert
     * @param scale The number of significant digits to the right of the decimal to include in the resulting converted value
     * @param plusSign Specify whether to prefix positive values with a '+'
     * @param unit The basic unit to use for the conversion result's unit label
     *
     * @returns {string} The conversion result appended with the converted unit label
     */
    transform(value: any, scale: number = 0, plusSign: boolean = false, unit: UnitOption = "bytes"): string {
        const base = unit === "bytes" ? UnitBase.Bytes : UnitBase.Standard;
        const result = this.unitConversionService.convert(value as number, base, scale);

        return this.unitConversionService.getFullDisplay(result, unit, plusSign);
    }
}
