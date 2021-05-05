import { Pipe, PipeTransform } from "@angular/core";
import { UnitBase, UnitConversionService } from "@nova-ui/bits";

@Pipe({ name: "nuiDashboardUnitConversion" })
export class DashboardUnitConversionPipe implements PipeTransform {
    constructor(private unitConversionService: UnitConversionService) { }

    transform(value: string | number | undefined): string | number | undefined {
        const valueAsNumber = typeof value === "string" ? parseInt(value, 10) : value;

        if (valueAsNumber === undefined || valueAsNumber < 10000) {
            return value;
        }

        const conversion = this.unitConversionService.convert(valueAsNumber, UnitBase.Standard, 1);
        return this.unitConversionService.getFullDisplay(conversion, "generic");
    }
}
