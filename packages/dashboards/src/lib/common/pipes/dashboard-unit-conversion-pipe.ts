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
     * Transforms a large number value to its abbreviated counterpart
     *
     * @param value The value to convert
     *
     * @returns The string representation of the converted value
     */
    public transform = (value: string | number | undefined): string => {
        const valueAsNumber = typeof value === "string" ? parseInt(value, 10) : value;

        if (valueAsNumber === undefined || isNaN(valueAsNumber) || valueAsNumber < DEFAULT_UNIT_CONVERSION_THRESHOLD) {
            return value?.toString() || "";
        }

        const conversion = this.unitConversionService.convert(value as number, UnitBase.Standard, 1);
        return this.unitConversionService.getFullDisplay(conversion, "generic");
    }
}
