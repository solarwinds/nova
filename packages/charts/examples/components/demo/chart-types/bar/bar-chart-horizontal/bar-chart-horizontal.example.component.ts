import { Component, OnInit } from "@angular/core";

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    Chart,
    IBarChartConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-horizontal-example",
    templateUrl: "./bar-chart-horizontal.example.component.html",
})
export class BarChartHorizontalExampleComponent implements OnInit {
    public barConfig: IBarChartConfig = { horizontal: true };
    public chart = new Chart(barGrid(this.barConfig));

    ngOnInit() {
        const accessors = barAccessors(this.barConfig);
        const renderer = new BarRenderer();
        const scales = barScales(this.barConfig);

        this.chart.update(
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
