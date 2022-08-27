import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import { ISimpleThresholdZone } from "@nova-ui/charts";

@Component({
    selector: "nui-thresholds-summary-test-harness",
    templateUrl: "./thresholds-summary-test-harness.component.html",
})
export class ThresholdsSummaryTestHarnessComponent implements OnInit {
    public data = {
        "series-1": [10, 30, 70, 30, 10],
        "series-2": [0, 40, 60, 40, 0],
    };
    public zones: ISimpleThresholdZone[] = [
        { status: "error", start: 50 },
        { status: "warning", start: 20, end: 50 },
    ];
    public startDate = moment([2016, 11, 25, 15, 14, 29]); // "2016-12-25T15:14:29.000Z"

    public ngOnInit() {}

    public dataChanged(value: string) {
        this.data = this.validateInput(value) || this.data;
    }

    public zonesChanged(value: string) {
        this.zones = this.validateInput(value) || this.zones;
    }

    private validateInput(value: string) {
        let validatedInput: any;
        try {
            validatedInput = JSON.parse(value);
        } catch {}
        return validatedInput;
    }
}
