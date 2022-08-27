import { Component, OnInit } from "@angular/core";
import moment, { duration } from "moment/moment";

import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    LinearScale,
    Scales,
    TimeIntervalScale,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-time-interval-example",
    templateUrl: "./bar-chart-time-interval.example.component.html",
})
export class BarChartTimeIntervalExampleComponent implements OnInit {
    public chart = new Chart(barGrid());

    ngOnInit(): void {
        const accessors = barAccessors();
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        const scales: Scales = {
            x: new TimeIntervalScale(duration(1, "days")),
            y: new LinearScale(),
        };

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
    const format = "YYYY-MM-DDTHH";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2020-07-01T0", format).toDate(), y: 30 },
                { x: moment("2020-07-02T0", format).toDate(), y: 95 },
                { x: moment("2020-07-03T0", format).toDate(), y: 15 },
                { x: moment("2020-07-04T0", format).toDate(), y: 60 },
                { x: moment("2020-07-05T0", format).toDate(), y: 35 },
            ],
        },
    ];
}
