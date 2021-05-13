import { Component, OnChanges, SimpleChanges } from "@angular/core";

import { RawFormatterComponent } from "../raw-formatter/raw-formatter.component";

@Component({
    template: `
        <ng-container>
            {{displayValue}}%
        </ng-container>`,
})
export class PercentageFormatterComponent extends RawFormatterComponent implements OnChanges {
    static lateLoadKey = "PercentageFormatterComponent";
    public displayValue: string;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            const valueAsNumber = parseFloat(this.data?.value);
            this.displayValue = isNaN(valueAsNumber) ? this.data?.value : valueAsNumber.toLocaleString(undefined, { useGrouping: false });
        }
    }
}
