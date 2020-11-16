import { Component } from "@angular/core";
import moment from "moment/moment";

@Component({
    selector: "nui-thresholds-summary-visual-test",
    templateUrl: "./thresholds-summary-visual-test.component.html",
})
export class ThresholdsSummaryVisualTestComponent {
    public singleSeries = { "series-1": [30, 95, 15, 60, 35] };
    public thresholdEdges = { "series-1": [30, 80, 80, 80, 45, 60, 10, 35] };
    public singleSeriesNoHits = { "series-1": [30, 55, 25, 55, 35] };
    public multipleSeries = { "series-1": [30, 95, 15, 60, 35], "series-2": [100, 40, 70, 45, 90] };

    public zones = [
        { status: "error", start: 80 },
        { status: "error", start: -100, end: 10 },
        { status: "warning", start: 60, end: 80 },
        { status: "warning", start: 10, end: 20 },
    ];
    public startDate = moment([2016, 11, 25, 15, 14, 29]); // "2016-12-25T15:14:29.000Z"
}
