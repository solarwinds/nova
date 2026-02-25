// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, OnInit, inject } from "@angular/core";

import {
    IUnitConversionResult,
    UnitBase,
    UnitConversionService,
} from "@nova-ui/bits";

@Component({
    selector: "unit-conversion-service-separate-unit-display-example",
    templateUrl: "./unit-conversion-service-separate-unit-display.example.component.html",
    styleUrls: [
        "./unit-conversion-service-separate-unit-display.example.component.less",
    ],
    standalone: false,
})
export class UnitConversionServiceSeparateUnitDisplayExampleComponent
    implements OnInit
{
    unitConversionService = inject(UnitConversionService);


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
