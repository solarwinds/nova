import { Component, OnInit } from "@angular/core";
import { barAccessors, barGrid, BarRenderer, barScales, Chart, IBarChartConfig } from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-example",
    templateUrl: "./bar-chart.example.component.html",
})
export class BarChartExampleComponent implements OnInit {
    // this configuration passed to barGrid, barAccessors, barScales determines the orientation of the bar chart
    public config = { horizontal: false } as IBarChartConfig;

    public chart = new Chart(barGrid(this.config));

    ngOnInit() {
        const accessors = barAccessors(this.config);
        const renderer = new BarRenderer();
        const scales = barScales(this.config);

        this.chart.update(getData().map(s => ({
            ...s,
            accessors,
            renderer,
            scales,
        })));
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
