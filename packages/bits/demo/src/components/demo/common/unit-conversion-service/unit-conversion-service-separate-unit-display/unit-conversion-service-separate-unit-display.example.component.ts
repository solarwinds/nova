import { Component, OnInit } from "@angular/core";
import {
    IUnitConversionResult,
    UnitBase,
    UnitConversionService,
} from "@nova-ui/bits";

@Component({
    selector: "unit-conversion-service-separate-unit-display-example",
    templateUrl:
        "./unit-conversion-service-separate-unit-display.example.component.html",
    styleUrls: [
        "./unit-conversion-service-separate-unit-display.example.component.less",
    ],
})
export class UnitConversionServiceSeparateUnitDisplayExampleComponent
    implements OnInit
{
    constructor(public unitConversionService: UnitConversionService) {}

    public num: number;
    public valueDisplay: string;
    public unitDisplay: string;

    public ngOnInit(): void {
        this.onNumberChange(1000);
    }

    public onNumberChange(num: number): void {
        this.num = num;
        const conversion: IUnitConversionResult =
            this.unitConversionService.convert(this.num, UnitBase.Standard, 2);
        this.unitDisplay = this.unitConversionService.getUnitDisplay(
            conversion,
            "hertz"
        );

        if (this.unitDisplay) {
            this.valueDisplay =
                this.unitConversionService.getValueDisplay(conversion);
        } else {
            // An undefined getUnitDisplay return value indicates the input value was too large to be converted,
            // so the base unit and scientific notation can be used as fallbacks.
            this.unitDisplay =
                this.unitConversionService.getUnitDisplayBaseValue("hertz");
            this.valueDisplay =
                this.unitConversionService.getScientificDisplay(conversion);
        }
    }
}
