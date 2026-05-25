import { Component } from "@angular/core";

import { RangeValue } from "@nova-ui/bits";

@Component({
    selector: "nui-range-filter-basic-example",
    templateUrl: "./range-filter-basic.example.component.html",
    styleUrls: ["./range-filter-basic.example.component.less"],
    standalone: false,
})
export class RangeFilterBasicExampleComponent {
    public selectedRange: RangeValue = {
        low: 18,
        high: 72,
    };

    public onRangeChange(value: RangeValue): void {
        this.selectedRange = value;
    }
}
