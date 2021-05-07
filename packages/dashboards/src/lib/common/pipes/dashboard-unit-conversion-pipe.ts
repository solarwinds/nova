import { Pipe, PipeTransform } from "@angular/core";
import { UnitBase, UnitConversionService } from "@nova-ui/bits";
import { DEFAULT_UNIT_CONVERSION_THRESHOLD } from "../constants";

/**
 * Pipe for transforming large values to their abbreviated counterparts.
 * Conversions are applied for values 10000 or greater
 */
@Pipe({ name: "nuiDashboardUnitConversion" })
export class DashboardUnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) { }

    /**
     * Transforms a large value to its abbreviated counterpart
     *
     * @param value The value to convert
     * @returns The string representation of the converted value
     */
    transform(value: string | number | undefined): string | number | undefined {
        const valueAsNumber = typeof value === "string" ? parseInt(value, 10) : value;

        if (valueAsNumber === undefined || valueAsNumber < DEFAULT_UNIT_CONVERSION_THRESHOLD) {
            return valueAsNumber?.toLocaleString();
        }

        const conversion = this.unitConversionService.convert(valueAsNumber, UnitBase.Standard, 1);
        return this.unitConversionService.getFullDisplay(conversion, "generic");
    }
}
