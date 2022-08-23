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
    selector: "nui-bar-chart-with-legend-example",
    templateUrl: "./bar-chart-with-legend.example.component.html",
})
export class BarChartWithLegendExampleComponent implements OnInit {
    public barConfig = { horizontal: false };

    // the usage of ChartAssist helps with connecting the chart with the legend
    public chartAssist = new ChartAssist(new Chart(barGrid(this.barConfig)));

    ngOnInit() {
        const accessors = barAccessors(
            this.barConfig,
            this.chartAssist.palette.standardColors
        );
        const renderer = new BarRenderer({
            // highlightStrategy determines how the bar chart should manage highlighting.
            // BarSeriesHighlightStrategy emphasizes the entire series on hovering a single bar,
            // which also triggers emphasis on the legend tile.
            highlightStrategy: new BarSeriesHighlightStrategy(
                "x" /* "x" determines which scale the highlight should be driven by */
            ),
        });
        const scales = barScales(this.barConfig);

        // it is important to update the chart via the chartAssist so that the legend is also updated
        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                scales,
                renderer,
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
        { id: "uc", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
