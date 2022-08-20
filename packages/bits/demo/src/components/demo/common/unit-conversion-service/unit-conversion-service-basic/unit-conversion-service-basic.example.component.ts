import { Component, OnInit } from "@angular/core";
import {
    IUnitConversionResult,
    UnitBase,
    UnitConversionService,
} from "@nova-ui/bits";

@Component({
    selector: "unit-conversion-service-basic-example",
    templateUrl: "./unit-conversion-service-basic.example.component.html",
    styleUrls: ["./unit-conversion-service-basic.example.component.less"],
})
export class UnitConversionServiceBasicExampleComponent implements OnInit {
    constructor(public unitConversionService: UnitConversionService) {}

    public num: number;
    public conversionDisplay: string;

    public ngOnInit(): void {
        this.onNumberChange(110000);
    }

    public onNumberChange(num: number): void {
        this.num = num;
        const conversionResult: IUnitConversionResult =
            this.unitConversionService.convert(this.num, UnitBase.Bytes, 2);
        this.conversionDisplay = this.unitConversionService.getFullDisplay(
            conversionResult,
            "bytes"
        );
    }
}
