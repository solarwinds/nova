import { Component, OnInit } from "@angular/core";

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    BarTooltipsPlugin,
    Chart,
    ChartAssist,
    InteractionLabelPlugin,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-with-tooltips-example",
    templateUrl: "./bar-chart-with-tooltips.example.component.html",
})
export class BarChartWithTooltipsExampleComponent implements OnInit {
    public grid = barGrid();

    public chartAssist = new ChartAssist(new Chart(this.grid));
    public tooltipsPlugin = new BarTooltipsPlugin();

    ngOnInit() {
        // plugin setup (absence of InteractionLinePlugin setup will result in no interaction line)
        this.chartAssist.chart.addPlugin(new InteractionLabelPlugin());
        this.chartAssist.chart.addPlugin(this.tooltipsPlugin);

        // grid configuration
        this.grid.config().interactionPlugins = false;

        // map each category to a specific color
        const accessors = barAccessors(
            undefined,
            this.chartAssist.palette.standardColors
        );

        const renderer = new BarRenderer({
            highlightStrategy: new BarSeriesHighlightStrategy("x"),
        });
        const scales = barScales();

        // tell the chart assist to populate the chart
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
        { id: "chrome", name: "Chrome", data: [20] },
        { id: "safari", name: "Safari", data: [14] },
        { id: "firefox", name: "Firefox", data: [5] },
        { id: "uc ", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "edge", name: "Edge", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
