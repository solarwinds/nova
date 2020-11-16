import { Component, OnInit } from "@angular/core";
import {
    barAccessors, barGrid, BarHighlightStrategy, BarRenderer, barScales, BarTooltipsPlugin, Chart, ChartAssist, InteractionLabelPlugin, stack,
} from "@solarwinds/nova-charts";

@Component({
    selector: "nui-bar-chart-percentage-example",
    templateUrl: "./bar-chart-percentage.example.component.html",
})
export class BarChartPercentageExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public tooltipsPlugin = new BarTooltipsPlugin();
    private mbpsUnit = $localize `Mbps`;

    constructor() {
    }

    ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(barGrid()), stack);

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        this.chartAssist.chart.addPlugin(new InteractionLabelPlugin());
        this.chartAssist.chart.addPlugin(this.tooltipsPlugin);

        const accessors = barAccessors();
        // Note changed data accessor matching value.percentageValue instead of just value
        // accessors.data.value = (data: any) => data.percentageValue;

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });
        const scales = barScales();

        const dataSeriesSet = getData();

        // TODO: make the calculation to be a part of data preprocessing

        // Preprocess data to have both percentage and real values
        // 1. Gather sum of all items per category
        // const sums = dataSeriesSet.reduce((acc: number[], next: any) => acc.map((v: any, i: number) => v + next.data[i].value), [0, 0, 0, 0]);
        // 2. Normalize data using the sum
        // dataSeriesSet.forEach((dataSeries: any) => {
        //     dataSeries.data.forEach((d: any, i: number) => {
        //         d.percentageValue = d.value / sums[i] * 100;
        //     });
        // });

        const chartSeriesSet = dataSeriesSet.map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chartAssist.update(chartSeriesSet);
    }

    public getTitleFromDataPoint(dataPoint: any) {
        // This generates content for a tooltip.
        // Both seriesId and the data of the corresponding bar are available in the tooltip.
        return `${dataPoint.seriesId}: ${dataPoint.data.value}${this.mbpsUnit} (${Math.round(dataPoint.data.percentageValue)}%)`;
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
                { "category": "Q2 2018", "value": 198 },
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
