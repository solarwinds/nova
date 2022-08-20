import { Component, OnInit } from "@angular/core";
import {
    calculateMissingData,
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
    TimeIntervalScale,
    XYGrid,
} from "@nova-ui/charts";
import { duration } from "moment/moment";

@Component({
    selector: "line-chart-interrupted-calculated-example",
    templateUrl: "./line-chart-interrupted-calculated-example.component.html",
})
export class LineChartInterruptedCalculatedExampleComponent implements OnInit {
    // XYGrid is used for rendering axes as well as other grid elements
    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public ngOnInit() {
        // In case of a line chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const interval = duration(1, "hour");
        const xScale = new TimeIntervalScale(interval);
        const scales: IXYScales = {
            x: xScale,
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
        const accessorsMissing = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        // Link the colors from 'parent' series
        const origColorAccessor = accessorsMissing.series.color;
        accessorsMissing.series.color = (seriesId, series) =>
            origColorAccessor?.(seriesId.split("__")[0], series);

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
            // We're using this convenience function to calculate the missing data according to the scale's interval
            const data = calculateMissingData(cs, "x", xScale.interval());
            // We have to use data that includes the missing data points for the first series as well
            cs.data = data;
            seriesSet.push(cs);

            // This series will be used to visualize the missing data points
            seriesSet.push({
                // This naming convention will connect these two series and their interaction will be synchronized
                id: s.id + "__missing",
                data: data,
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
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: new Date(2016, 11, 25, 5), y: 30 },
                { x: new Date(2016, 11, 25, 6), y: 95 },
                { x: new Date(2016, 11, 25, 7), y: 60 },
                { x: new Date(2016, 11, 25, 10), y: 75 },
                { x: new Date(2016, 11, 25, 12), y: 35 },
                { x: new Date(2016, 11, 25, 13), y: 20 },
            ],
        },
    ];
}
