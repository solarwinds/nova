import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import {
    Chart,
    ChartAssist,
    IChartAssistSeries,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MissingDataLineRendererConfig,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "line-chart-interrupted-basic-example",
    templateUrl: "./line-chart-interrupted-basic-example.component.html",
})
export class LineChartInterruptedBasicExampleComponent implements OnInit {
    // XYGrid is used for rendering axes as well as other grid elements
    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public ngOnInit() {
        // In case of a line chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const incomingSeries = getData();

        // Here we assemble the complete chart series.
        const seriesSet: IChartAssistSeries<ILineAccessors>[] = [];

        // The line renderer will make the chart look like a line chart.
        const renderer = new LineRenderer();
        // Line accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );

        // Renderer for the missing dataSeries
        const rendererMissing = new LineRenderer(
            new MissingDataLineRendererConfig()
        );
        const accessorsMissing = new LineAccessors();
        // We need to store the original value of the 'defined' accessor
        const origDefinedAccessor = accessorsMissing.data.defined;
        // We're calling the original 'defined' accessor implementation, but inverting it's logic because, from the missing data
        // series point of view, the undefined data are actually visualized as defined.
        accessorsMissing.data.defined = (d, i, data, dataSeries) =>
            !origDefinedAccessor?.(d, i, data, dataSeries) ?? true;

        for (const s of incomingSeries) {
            // The first data series is for rendering the valid data
            const cs: IChartSeries<ILineAccessors> = {
                ...s,
                accessors,
                renderer,
                scales,
            };
            seriesSet.push(cs);

            // This series will be used to visualize the missing data points
            seriesSet.push({
                // This naming convention will connect these two series and their interaction will be synchronized
                id: s.id + "__missing",
                data: s.data,
                accessors: accessorsMissing,
                renderer: rendererMissing,
                scales,
                showInLegend: false, // We don't want to show this in the legend
            });
        }

        // Finally, pass the series set to the chart's update method
        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    x: moment("2016-12-25T15:14:29.909Z", format).toDate(),
                    y: 30,
                },
                {
                    x: moment("2016-12-27T15:14:29.909Z", format).toDate(),
                    y: 95,
                },

                // missing data segment
                {
                    x: moment("2016-12-27T15:14:29.909Z", format).toDate(),
                    y: 95,
                    defined: false,
                },
                {
                    x: moment("2016-12-29T15:14:29.909Z", format).toDate(),
                    y: 30,
                    defined: false,
                },

                // single defined data point surrounded by missing data segments
                {
                    x: moment("2016-12-29T15:14:29.909Z", format).toDate(),
                    y: 30,
                },

                // missing data segment
                {
                    x: moment("2016-12-29T15:14:29.909Z", format).toDate(),
                    y: 30,
                    defined: false,
                },
                {
                    x: moment("2016-12-31T15:14:29.909Z", format).toDate(),
                    y: 60,
                    defined: false,
                },

                {
                    x: moment("2016-12-31T15:14:29.909Z", format).toDate(),
                    y: 60,
                },
                {
                    x: moment("2017-01-03T15:14:29.909Z", format).toDate(),
                    y: 35,
                },

                // missing data segment
                {
                    x: moment("2017-01-03T15:14:29.909Z", format).toDate(),
                    y: 35,
                    defined: false,
                },
                {
                    x: moment("2017-01-04T15:14:29.909Z", format).toDate(),
                    y: 20,
                    defined: false,
                },

                {
                    x: moment("2017-01-04T15:14:29.909Z", format).toDate(),
                    y: 20,
                },
                {
                    x: moment("2017-01-05T15:14:29.909Z", format).toDate(),
                    y: 35,
                },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                {
                    x: moment("2016-12-25T15:14:29.909Z", format).toDate(),
                    y: 60,
                },
                {
                    x: moment("2016-12-27T15:14:29.909Z", format).toDate(),
                    y: 40,
                },
                {
                    x: moment("2016-12-29T15:14:29.909Z", format).toDate(),
                    y: 70,
                },
                {
                    x: moment("2016-12-31T15:14:29.909Z", format).toDate(),
                    y: 45,
                },
                {
                    x: moment("2017-01-03T15:14:29.909Z", format).toDate(),
                    y: 90,
                },
            ],
        },
    ];
}
