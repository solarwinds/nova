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

import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import sumBy from "lodash/sumBy";

import { UnitConversionService } from "@nova-ui/bits";

import { DEFAULT_UNIT_CONVERSION_THRESHOLD } from "../../../../common/constants";
import { DashboardUnitConversionPipe } from "../../../../common/pipes/dashboard-unit-conversion-pipe";
import { IProportionalWidgetConfig } from "../../../../components/public-api";
import { IFormatterData } from "../types";

@Component({
    template: `<ng-container>
        <nui-icon
            *ngIf="config?.chartDonutContentIcon"
            [icon]="config?.chartDonutContentIcon"
            iconSize="medium"
        ></nui-icon>
        <div class="nui-text-page">
            <span
                *ngIf="sum < conversionThreshold; else convertedValueDisplay"
                >{{ sum | number : "1.0-3" }}</span
            >
            <ng-template #convertedValueDisplay>{{
                convertedValue
            }}</ng-template>
        </div>
        <div *ngIf="config?.chartDonutContentLabel" class="nui-text-secondary">
            {{ config?.chartDonutContentLabel }}
        </div>
    </ng-container>`,
})
export class DonutContentRawFormatterComponent implements OnChanges {
    static lateLoadKey = "DonutContentRawFormatterComponent";

    public sum: number;
    public convertedValue: string;
    public conversionThreshold = DEFAULT_UNIT_CONVERSION_THRESHOLD;

    private unitConversionPipe: DashboardUnitConversionPipe;
    constructor(
        public changeDetector: ChangeDetectorRef,
        unitConversionService: UnitConversionService
    ) {
        this.unitConversionPipe = new DashboardUnitConversionPipe(
            unitConversionService
        );
    }

    @Input() data: IFormatterData[];
    @Input() config: IProportionalWidgetConfig;

    public ngOnChanges(): void {
        this.sum = sumBy(this.data, (s) => s.data[0]);
        this.convertedValue = this.unitConversionPipe.transform(this.sum);
    }
}
