import { Component } from "@angular/core";

import { RangeValue } from "@nova-ui/bits";

@Component({
    selector: "nui-range-filter-vertical-example",
    templateUrl: "./range-filter-vertical.example.component.html",
    styleUrls: ["./range-filter-vertical.example.component.less"],
    standalone: false,
})
export class RangeFilterVerticalExampleComponent {
    public threshold: RangeValue = {
        low: 0,
        high: 7,
    };

    public get thresholdLabel(): string {
        if (this.threshold.high >= 8) {
            return "Critical";
        }
        if (this.threshold.high >= 5) {
            return "Warning";
        }
        return "Healthy";
    }

    public onRangeChange(value: RangeValue): void {
        this.threshold = value;
    }
}
