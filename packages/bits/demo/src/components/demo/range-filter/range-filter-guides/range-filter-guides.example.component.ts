import { Component } from "@angular/core";

import { RangeValue } from "@nova-ui/bits";

@Component({
    selector: "nui-range-filter-guides-example",
    templateUrl: "./range-filter-guides.example.component.html",
    styleUrls: ["./range-filter-guides.example.component.less"],
    standalone: false,
})
export class RangeFilterGuidesExampleComponent {
    public selectedRange: RangeValue = {
        low: 125,
        high: 350,
    };

    public onRangeChange(value: RangeValue): void {
        this.selectedRange = value;
    }
}
