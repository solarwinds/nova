import { Component, OnInit } from "@angular/core";
import {
    barAccessors, barGrid, BarRenderer, barScales, BarSeriesHighlightStrategy, Chart, ChartAssist, ChartPopoverPlugin, InteractionLabelPlugin, XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-with-popover-example",
    templateUrl: "./bar-chart-with-popover.example.component.html",
})
export class BarChartWithPopoverExampleComponent implements OnInit {
    public chartAssist = new ChartAssist(new Chart(barGrid()));
    public popoverPlugin = new ChartPopoverPlugin();

    ngOnInit() {
        // plugin setup (absence of InteractionLinePlugin setup will result in no interaction line)
        this.chartAssist.chart.addPlugin(new InteractionLabelPlugin());
        this.chartAssist.chart.addPlugin(this.popoverPlugin);

        // grid configuration
        const gridConfig = <XYGridConfig>this.chartAssist.chart.getGrid().config();
        gridConfig.interactionPlugins = false;

        const accessors = barAccessors();
        const renderer = new BarRenderer({ highlightStrategy: new BarSeriesHighlightStrategy("x") });
        const scales = barScales();

        // tell the chart assist to populate the chart
        this.chartAssist.update(getData().map(s => ({
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
        { id: "chrome", name: "Chrome", data: [20] },
        { id: "safari", name: "Safari", data: [14] },
        { id: "firefox", name: "Firefox", data: [5] },
        { id: "uc ", name: "UC Browser", data: [4] },
        { id: "opera", name: "Opera", data: [3] },
        { id: "edge", name: "Edge", data: [3] },
        { id: "other", name: "Other", data: [5] },
    ];
}
