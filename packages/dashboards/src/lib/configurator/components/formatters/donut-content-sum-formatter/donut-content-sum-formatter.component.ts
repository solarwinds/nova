import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import sumBy from "lodash/sumBy";

import { IFormatterData } from "../types";

@Component({
    template: `<ng-container
        ><div class="nui-text-page">{{ this.sum }}</div></ng-container
    >`,
})
export class DonutContentSumFormatterComponent implements OnChanges {
    static lateLoadKey = "DonutContentSumFormatterComponent";

    public sum: number;

    constructor(public changeDetector: ChangeDetectorRef) {}

    @Input() data: IFormatterData[];

    ngOnChanges() {
        this.sum = sumBy(this.data, (s) => s.data[0]);
    }
}
