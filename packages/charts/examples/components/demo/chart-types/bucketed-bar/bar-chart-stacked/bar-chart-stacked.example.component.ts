import { Component, OnInit } from "@angular/core";
import {
    barAccessors, barGrid, BarHighlightStrategy, BarRenderer, barScales, BarTooltipsPlugin, Chart, ChartAssist, InteractionLabelPlugin, stack,
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-stacked-example",
    templateUrl: "./bar-chart-stacked.example.component.html",
})
export class BarChartStackedExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public tooltipsPlugin = new BarTooltipsPlugin();

    ngOnInit() {
        const chart = new Chart(barGrid());

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());
        chart.addPlugin(this.tooltipsPlugin);

        // "stack" is a function that calls data preprocessor for recalculating stacks
        this.chartAssist = new ChartAssist(chart, stack);

        const accessors = barAccessors();
        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });
        const scales = barScales();

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
            "data": [
                { "category": "Q1 2018", "value": 167 },
                { "category": "Q2 2018", "value": 122 },
                { "category": "Q3 2018", "value": 141 },
                { "category": "Q4 2018", "value": 66 },
            ],
        },
        {
            "id": "Austin",
            "data": [
                { "category": "Q1 2018", "value": 167 },
                // Please note the fact that not all categories are required to be present in every data point.
                // Sparse data is ok too.
                // { "category": "Q2 2018", "value": 198 },
                { "category": "Q3 2018", "value": 208 },
                { "category": "Q4 2018", "value": 233 },
            ],
        },
        {
            "id": "Edinburgh",
            "data": [
                { "category": "Q1 2018", "value": 167 },
                { "category": "Q2 2018", "value": 15 },
                { "category": "Q3 2018", "value": 208 },
                { "category": "Q4 2018", "value": 123 },
            ],
        },
        {
            "id": "Newcastle",
            "data": [
                { "category": "Q1 2018", "value": 11 },
                { "category": "Q2 2018", "value": 99 },
                { "category": "Q3 2018", "value": 17 },
                { "category": "Q4 2018", "value": 25 },
            ],
        },
        {
            "id": "Kyiv",
            "data": [
                { "category": "Q1 2018", "value": 121 },
                { "category": "Q2 2018", "value": 222 },
                { "category": "Q3 2018", "value": 319 },
                { "category": "Q4 2018", "value": 328 },
            ],
        },
    ];
}
