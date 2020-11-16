import { Component, OnInit } from "@angular/core";
import {
    barAccessors, barGrid, BarHighlightStrategy, BarRenderer, barScales, BarTooltipsPlugin, Chart, ChartAssist, IBarChartConfig, InteractionLabelPlugin,
} from "@solarwinds/nova-charts";

@Component({
    selector: "nui-bar-chart-grouped-example",
    templateUrl: "./bar-chart-grouped.example.component.html",
})
export class BarChartGroupedExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public tooltipsPlugin = new BarTooltipsPlugin();
    public config = { grouped: true, horizontal: false } as IBarChartConfig;

    ngOnInit() {
        const chart = new Chart(barGrid(this.config));
        this.chartAssist = new ChartAssist(chart);

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());
        chart.addPlugin(this.tooltipsPlugin);

        // 1. Call the convenience function to create bar chart scales. Like this:
        const scales = barScales(this.config);

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });

        // 2. Make your category accessor to return the value like [ category, subCategory ]
        const accessors = barAccessors(this.config);
        accessors.data.category = (data, i, series, dataSeries) => [data.name, dataSeries.name];

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
        {
            "id": "Brno",
            "name": "Brno",
            "data": [
                { "name": "Q1 2018", "value": 167 },
                { "name": "Q2 2018", "value": 122 },
                { "name": "Q3 2018", "value": 141 },
                { "name": "Q4 2018", "value": 66 },
            ],
        },
        {
            "id": "Austin",
            "name": "Austin",
            "data": [
                { "name": "Q1 2018", "value": 167 },
                { "name": "Q2 2018", "value": 198 },
                { "name": "Q3 2018", "value": 208 },
                { "name": "Q4 2018", "value": 233 },
            ],
        },
        {
            "id": "Edinburgh",
            "name": "Edinburgh",
            "data": [
                { "name": "Q1 2018", "value": 167 },
                // sparse data is handled as well
                // { "name": "Q2 2018", "value": 15 },
                { "name": "Q3 2018", "value": 208 },
                { "name": "Q4 2018", "value": 123 },
            ],
        },
        {
            "id": "Newcastle",
            "name": "Newcastle",
            "data": [
                { "name": "Q1 2018", "value": 11 },
                { "name": "Q2 2018", "value": 99 },
                { "name": "Q3 2018", "value": 17 },
                { "name": "Q4 2018", "value": 25 },
            ],
        },
        {
            "id": "Kyiv",
            "name": "Kyiv",
            "data": [
                { "name": "Q1 2018", "value": 121 },
                { "name": "Q2 2018", "value": 222 },
                { "name": "Q3 2018", "value": 319 },
                { "name": "Q4 2018", "value": 328 },
            ],
        },
    ];
}
