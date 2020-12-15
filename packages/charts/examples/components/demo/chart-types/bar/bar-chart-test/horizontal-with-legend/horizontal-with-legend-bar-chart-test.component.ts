import { Component, OnInit } from "@angular/core";
import { barAccessors, barGrid, BarRenderer, barScales, BarSeriesHighlightStrategy, Chart, ChartAssist } from "@nova-ui/charts";

@Component({
    selector: "nui-horizontal-with-legend-bar-chart-test",
    templateUrl: "./horizontal-with-legend-bar-chart-test.component.html",
})

export class HorizontalWithLegendBarChartTestComponent implements OnInit {
    public barConfig = { horizontal: true };
    public grid = barGrid(this.barConfig);
    public chartAssist = new ChartAssist(new Chart(this.grid));

    ngOnInit() {
        this.grid.config().axis.left.visible = false;
        this.grid.config().dimension.margin.left = 0;

        const accessors = barAccessors(this.barConfig, this.chartAssist.palette.standardColors);
        const renderer = new BarRenderer({ highlightStrategy: new BarSeriesHighlightStrategy("y") });
        const scales = barScales(this.barConfig);

        this.chartAssist.update(getData().map(s => ({
            ...s,
            accessors,
            scales,
            renderer,
        })));
    }
}

/* Chart data */
function getData() {
    return [
        { id: "chrome", name: "Chrome", data: [66] },
        { id: "safari", name: "Safari", data: [14] },
        { id: "firefox", name: "Firefox", data: [5] },
        { id: "uc", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
