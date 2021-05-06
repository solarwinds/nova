import { Pipe, PipeTransform } from "@angular/core";
import { UnitBase, UnitConversionService } from "@nova-ui/bits";

/**
 * Pipe for transforming large values to their abbreviated counterparts.
 * Conversions are applied for values 10000 or greater
 */
@Pipe({ name: "nuiDashboardUnitConversion" })
export class DashboardUnitConversionPipe implements PipeTransform {
    private readonly conversionThreshold = 10000;

    constructor(private unitConversionService: UnitConversionService) { }

    transform(value: string | number | undefined): string | number | undefined {
        const valueAsNumber = typeof value === "string" ? parseInt(value, 10) : value;

        if (valueAsNumber === undefined || valueAsNumber < this.conversionThreshold) {
            return value;
        }

        const conversion = this.unitConversionService.convert(valueAsNumber, UnitBase.Standard, 1);
        return this.unitConversionService.getFullDisplay(conversion, "generic");
    }
}
