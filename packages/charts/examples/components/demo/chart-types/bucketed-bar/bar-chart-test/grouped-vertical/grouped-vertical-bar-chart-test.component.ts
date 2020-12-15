import { Component, OnInit } from "@angular/core";
import {
    BandScale, barAccessors, barGrid, BarHighlightStrategy, BarRenderer, Chart, ChartAssist, INTERACTION_DATA_POINTS_EVENT, InteractionLabelPlugin, LinearScale,
    Scales,
    SELECT_DATA_POINT_EVENT
} from "@nova-ui/charts";

@Component({
    selector: "nui-grouped-vertical-bar-chart-test",
    templateUrl: "./grouped-vertical-bar-chart-test.component.html",
})

export class GroupedVerticalBarChartTestComponent implements OnInit {
    public chartAssist: ChartAssist;
    public accessors = barAccessors();

    ngOnInit() {
        const chart = new Chart(barGrid());

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());

        const bandScale = new BandScale();
        bandScale.padding(0.25);
        bandScale.innerScale = new BandScale();

        const linearScale = new LinearScale();
        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });

        this.accessors.data.category = (data: any) => [data.name, data.subCategory];

        this.chartAssist = new ChartAssist(chart);

        const scales: Scales = {
            x: bandScale,
            y: linearScale,
        };

        const mappedSeries = getData().map(d => ({
            ...d,
            accessors: this.accessors,
            renderer,
            scales,
        }));

        // Sample events that can be used in order to handle click or highlighting of certain status
        chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).subscribe(console.log);
        chart.getEventBus().getStream(SELECT_DATA_POINT_EVENT).subscribe(console.log);

        this.chartAssist.update(mappedSeries);
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
                    "subCategory": "Brno",
                    "value": 167,
                },
                {
                    "name": "Q2 2018",
                    "subCategory": "Brno",
                    "value": 122,
                },
                {
                    "name": "Q3 2018",
                    "subCategory": "Brno",
                    "value": 141,
                },
                {
                    "name": "Q4 2018",
                    "subCategory": "Brno",
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
                    "subCategory": "Austin",
                    "value": 167,
                },
                {
                    "name": "Q2 2018",
                    "subCategory": "Austin",
                    "value": 198,
                },
                {
                    "name": "Q3 2018",
                    "subCategory": "Austin",
                    "value": 208,
                },
                {
                    "name": "Q4 2018",
                    "subCategory": "Austin",
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
                    "subCategory": "Edinburgh",
                    "value": 167,
                },
                // sparse data is handled as well
                // {
                //     "name": "Q2 2018",
                //     "subCategory": "Edinburgh",
                //     "value": 15,
                // },
                {
                    "name": "Q3 2018",
                    "subCategory": "Edinburgh",
                    "value": 208,
                },
                {
                    "name": "Q4 2018",
                    "subCategory": "Edinburgh",
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
                    "subCategory": "Newcastle",
                    "value": 11,
                },
                {
                    "name": "Q2 2018",
                    "subCategory": "Newcastle",
                    "value": 99,
                },
                {
                    "name": "Q3 2018",
                    "subCategory": "Newcastle",
                    "value": 17,
                },
                {
                    "name": "Q4 2018",
                    "subCategory": "Newcastle",
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
                    "subCategory": "Kyiv",
                    "value": 121,
                },
                {
                    "name": "Q2 2018",
                    "subCategory": "Kyiv",
                    "value": 222,
                },
                {
                    "name": "Q3 2018",
                    "subCategory": "Kyiv",
                    "value": 319,
                },
                {
                    "name": "Q4 2018",
                    "subCategory": "Kyiv",
                    "value": 328,
                },
            ],
        },
    ];
}
