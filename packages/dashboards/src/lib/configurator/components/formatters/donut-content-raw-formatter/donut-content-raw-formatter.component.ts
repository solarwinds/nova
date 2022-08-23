import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    LOCALE_ID,
    OnChanges,
} from "@angular/core";
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
                >{{ sum | number: "1.0-3" }}</span
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

    ngOnChanges(): void {
        this.sum = sumBy(this.data, (s) => s.data[0]);
        this.convertedValue = this.unitConversionPipe.transform(this.sum);
    }
}
