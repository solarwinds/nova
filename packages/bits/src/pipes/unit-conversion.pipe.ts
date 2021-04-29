import { Pipe, PipeTransform } from "@angular/core";

import { UnitBase, UnitOption } from "../constants/unit-conversion.constants";
import { UnitConversionService } from "../services/unit-conversion.service";

/**
 * <example-url>./../examples/index.html#/pipes/unit-conversion</example-url>
 */

@Pipe({
    name: "unitConversion",
})
export class UnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) {}

    transform(value: any, precision: number = 0, plusSign: boolean = false, unit: UnitOption = "bytes"): string {
        const scale = unit === "bytes" ? UnitBase.Bytes : UnitBase.Standard;

        const result = this.unitConversionService.convert(value as number, scale, precision);
        return this.unitConversionService.getFullDisplay(result, unit, plusSign);
    }
}
