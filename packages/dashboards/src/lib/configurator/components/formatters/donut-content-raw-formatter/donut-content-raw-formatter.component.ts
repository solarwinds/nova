import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import sumBy from "lodash/sumBy";

import { IProportionalWidgetConfig } from "../../../../components/public-api";
import { IFormatterData } from "../types";


@Component({
    template: `<ng-container>
                    <nui-icon *ngIf="config?.chartDonutContentIcon"
                              [icon]="config?.chartDonutContentIcon"
                              iconSize="medium"></nui-icon>
                    <div class="nui-text-page">
                        {{sum | number:'1.0-3'}}
                    </div>
                    <div *ngIf="config?.chartDonutContentLabel" class="nui-text-secondary">
                        {{config?.chartDonutContentLabel}}
                    </div>
               </ng-container>`,
})

export class DonutContentRawFormatterComponent implements OnChanges {
    static lateLoadKey = "DonutContentRawFormatterComponent";

    public sum: number;

    constructor(public changeDetector: ChangeDetectorRef) { }

    @Input() data: IFormatterData[];
    @Input() config: IProportionalWidgetConfig;

    ngOnChanges() {
        this.sum = sumBy(this.data, s => s.data[0]);
    }
}
