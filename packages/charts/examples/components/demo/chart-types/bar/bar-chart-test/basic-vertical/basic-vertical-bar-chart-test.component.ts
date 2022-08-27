import { Component, OnInit } from "@angular/core";

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    Chart,
    ChartAssist,
} from "@nova-ui/charts";

@Component({
    selector: "nui-basic-vertical-bar-chart-test",
    templateUrl: "./basic-vertical-bar-chart-test.component.html",
})
export class BasicVerticalBarChartTestComponent implements OnInit {
    public chartAssist = new ChartAssist(new Chart(barGrid()));

    ngOnInit() {
        const accessors = barAccessors();
        const renderer = new BarRenderer({
            highlightStrategy: new BarSeriesHighlightStrategy("x"),
        });
        const scales = barScales();

        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                renderer,
                scales,
            }))
        );
    }
}

/* Chart data */
function getData() {
    return [
        { id: "chrome", name: "Chrome", data: [66] },
        { id: "safari", name: "Safari", data: [14] },
        { id: "firefox", name: "Firefox", data: [5] },
        { id: "uc ", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
