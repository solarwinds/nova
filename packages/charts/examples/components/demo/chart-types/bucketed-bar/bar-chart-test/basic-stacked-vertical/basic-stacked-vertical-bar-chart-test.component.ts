import { Component, OnInit } from "@angular/core";
import {
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    ChartAssist,
    InteractionLabelPlugin,
    LinearScale,
    Scales,
    stack,
} from "@nova-ui/charts";

@Component({
    selector: "nui-basic-stacked-vertical-bar-chart-test",
    templateUrl: "./basic-stacked-vertical-bar-chart-test.component.html",
})
export class BasicStackedVerticalBarChartTestComponent implements OnInit {
    public chartAssist: ChartAssist;

    ngOnInit() {
        const chart = new Chart(barGrid());

        // We're manually adding Interaction Label plugin (without Interaction Line plugin) to have only label
        chart.addPlugin(new InteractionLabelPlugin());
        this.chartAssist = new ChartAssist(chart, stack);

        const accessors = barAccessors();
        // This matches field in data by which chart preprocessor will gather categories to build stacks
        accessors.data.category = (data: any) => data.name;

        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        const scales: Scales = {
            x: new BandScale(),
            y: new LinearScale(),
        };

        const seriesSet = getData().map((d) => ({
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
            id: "Brno",
            name: "Brno",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                {
                    name: "Q2 2018 LONG NAME TEST LONG NAME TEST LONG NAME TEST",
                    value: 122,
                },
                {
                    name: "Q3 2018",
                    value: 141,
                },
                {
                    name: "Q4 2018",
                    value: 66,
                },
            ],
        },
        {
            id: "Austin",
            name: "Austin",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                // Please note the fact that not all categories are required to be present in every data point.
                // Sparse data is ok too.
                // {
                //     "name": "Q2 2018 LONG NAME TEST LONG NAME TEST LONG NAME TEST",
                //     "value": 198,
                // },
                {
                    name: "Q3 2018",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    value: 233,
                },
            ],
        },
        {
            id: "Edinburgh",
            name: "Edinburgh",
            data: [
                {
                    name: "Q1 2018",
                    value: 167,
                },
                {
                    name: "Q2 2018 LONG NAME TEST LONG NAME TEST LONG NAME TEST",
                    value: 15,
                },
                {
                    name: "Q3 2018",
                    value: 208,
                },
                {
                    name: "Q4 2018",
                    value: 123,
                },
            ],
        },
        {
            id: "Newcastle",
            name: "Newcastle",
            data: [
                {
                    name: "Q1 2018",
                    value: 11,
                },
                {
                    name: "Q2 2018 LONG NAME TEST LONG NAME TEST LONG NAME TEST",
                    value: 99,
                },
                {
                    name: "Q3 2018",
                    value: 17,
                },
                {
                    name: "Q4 2018",
                    value: 25,
                },
            ],
        },
        {
            id: "Kyiv",
            name: "Kyiv",
            data: [
                {
                    name: "Q1 2018",
                    value: 121,
                },
                {
                    name: "Q2 2018 LONG NAME TEST LONG NAME TEST LONG NAME TEST",
                    value: 222,
                },
                {
                    name: "Q3 2018",
                    value: 319,
                },
                {
                    name: "Q4 2018",
                    value: 328,
                },
            ],
        },
    ];
}
