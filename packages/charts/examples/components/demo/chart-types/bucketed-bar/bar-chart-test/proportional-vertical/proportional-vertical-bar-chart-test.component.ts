import { Component, OnInit } from "@angular/core";
import {
    BandScale, barAccessors, barGrid, BarHighlightStrategy, BarRenderer, Chart, ChartAssist, InteractionLabelPlugin, LinearScale, Scales, stack,
} from "@solarwinds/nova-charts";

@Component({
    selector: "nui-proportional-vertical-bar-chart-test",
    templateUrl: "./proportional-vertical-bar-chart-test.component.html",
})

export class ProportionalVerticalBarChartTestComponent implements OnInit {
    public chartAssist: ChartAssist;
    private mbpsUnit = "Mbps";

    constructor() {}

    ngOnInit() {
        this.chartAssist = new ChartAssist(new Chart(barGrid()), stack);

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        this.chartAssist.chart.addPlugin(new InteractionLabelPlugin());

        const accessors = barAccessors();
        accessors.data.category = (data: any) => data.name;
        // Note changed data accessor matching value.percentageValue instead of just value
        accessors.data.value = (data: any) => data.percentageValue;

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });

        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        const scales: Scales = {
            x: bandScale,
            y: linearScale,
        };

        const dataSeriesSet = getData();
        // Preprocess data to have both percentage and real values
        // 1. Gather sum of all items per category
        const sums = dataSeriesSet.reduce((acc: number[], next: any) => acc.map((v: any, i: number) => v + next.data[i].value), [0, 0, 0, 0]);
        // 2. Normalize data using the sum
        dataSeriesSet.forEach((dataSeries: any) => {
            dataSeries.data.forEach((d: any, i: number) => {
                d.percentageValue = d.value / sums[i] * 100;
            });
        });

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
                {
                    "name": "Q2 2018",
                    "value": 198,
                },
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
