import { Component, OnInit } from "@angular/core";
import {
    BandScale, BarHighlightStrategy, BarHorizontalGridConfig, BarRenderer, BarTooltipsPlugin, Chart, ChartAssist, HorizontalBarAccessors, LinearScale, Scales,
    stack, XYGrid,
} from "@solarwinds/nova-charts";

@Component({
    selector: "nui-bar-chart-stacked-horizontal-example",
    templateUrl: "./bar-chart-stacked-horizontal.example.component.html",
})
export class BarChartStackedHorizontalExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public tooltipsPlugin = new BarTooltipsPlugin();

    ngOnInit() {
        const gridConfig = new BarHorizontalGridConfig();

        const chart = new Chart(new XYGrid(gridConfig));
        chart.addPlugin(this.tooltipsPlugin);
        this.chartAssist = new ChartAssist(chart, stack);

        const accessors = new HorizontalBarAccessors();
        // This matches field in data by which chart preprocessor will gather categories to build stacks
        accessors.data.category = (data: any) => data.name;

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("y") });

        const scales: Scales = {
            y: new BandScale(),
            x: new LinearScale(),
        };

        const seriesSet = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            "id": "Brno",
            "name": "Brno",
            "data": [
                {
                    "name": "Q1 2018",
                    "value": 167,
                },
                {
                    "name": "Q2 2018",
                    "value": 122,
                },
                {
                    "name": "Q3 2018",
                    "value": 141,
                },
                {
                    "name": "Q4 2018",
                    "value": 66,
                },
            ],
        },
        {
            "id": "Austin",
            "name": "Austin",
            "data": [
                {
                    "name": "Q1 2018",
                    "value": 167,
                },
                // Please note the fact that not all categories are required to be present in every data point.
                // Sparse data is ok too.
                // {
                //     "name": "Q2 2018",
                //     "value": 198,
                // },
                {
                    "name": "Q3 2018",
                    "value": 208,
                },
                {
                    "name": "Q4 2018",
                    "value": 233,
                },
            ],
        },
        {
            "id": "Edinburgh",
            "name": "Edinburgh",
            "data": [
                {
                    "name": "Q1 2018",
                    "value": 167,
                },
                {
                    "name": "Q2 2018",
                    "value": 15,
                },
                {
                    "name": "Q3 2018",
                    "value": 208,
                },
                {
                    "name": "Q4 2018",
                    "value": 123,
                },
            ],
        },
        {
            "id": "Newcastle",
            "name": "Newcastle",
            "data": [
                {
                    "name": "Q1 2018",
                    "value": 11,
                },
                {
                    "name": "Q2 2018",
                    "value": 99,
                },
                {
                    "name": "Q3 2018",
                    "value": 17,
                },
                {
                    "name": "Q4 2018",
                    "value": 25,
                },
            ],
        },
        {
            "id": "Kyiv",
            "name": "Kyiv",
            "data": [
                {
                    "name": "Q1 2018",
                    "value": 121,
                },
                {
                    "name": "Q2 2018",
                    "value": 222,
                },
                {
                    "name": "Q3 2018",
                    "value": 319,
                },
                {
                    "name": "Q4 2018",
                    "value": 328,
                },
            ],
        },
    ];
}
