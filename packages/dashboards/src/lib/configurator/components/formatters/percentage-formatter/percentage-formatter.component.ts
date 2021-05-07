import { Component } from "@angular/core";

import { RawFormatterComponent } from "../raw-formatter/raw-formatter.component";

@Component({
    template: `
        <ng-container>
            {{displayValue}}%
        </ng-container>`,
})
export class PercentageFormatterComponent extends RawFormatterComponent {
    static lateLoadKey = "PercentageFormatterComponent";
}
