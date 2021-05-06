import { Component, OnInit } from "@angular/core";
import {
    AreaAccessors,
    areaGrid,
    AreaRenderer,
    Chart,
    ChartAssist,
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    stackedArea,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "area-chart-bi-directional-stacked-example",
    templateUrl: "./area-chart-bi-directional-stacked-example.component.html",
})
export class AreaChartBiDirectionalStackedExampleComponent implements OnInit {
    public chartTop: Chart;
    public chartAssistTop: ChartAssist;

    public chartBottom: Chart;
    public chartAssistBottom: ChartAssist;

    public ngOnInit() {
        // areaGrid returns an XYGrid configured for displaying an area chart's axes and other grid elements.
        this.chartTop = new Chart(new XYGrid(topChartConfig()));
        this.chartAssistTop = new ChartAssist(this.chartTop, stackedArea);

        this.chartBottom = new Chart(new XYGrid(bottomChartConfig()));
        this.chartAssistBottom = new ChartAssist(this.chartBottom, stackedArea);

        // Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new AreaAccessors();
        // 'x' defines access for values in the data that correspond to the horizontal axis
        accessors.data.x = (d) => d.timeStamp;
        // 'y0' defines the baseline, in other words, where the area starts
        accessors.data.y0 = () => 0;
        // 'y1' defines access to the numeric values we want to visualize, in other words, where the area ends
        accessors.data.y1 = (d) => d.value;
        // 'x' and 'y' accessors define the position of the marker. 'x' was already defined, so now we need to define 'y' as well.
        // Notice that the 'y' is assigned the 'absoluteY1' accessor which takes into account areas that may be stacked below
        // the current area and retrieves the absolute distance from the baseline to the area's value line.
        accessors.data.y = accessors.data.absoluteY1;
        // Even though we're using different accessor instances for each series, we want to use the same marker
        // accessor so that each series is assigned a different marker shape from the same marker sequence.
        // Take a look also at the marker assignment for the second accessors instance below.
        accessors.series.marker = this.chartAssistTop.markers.get;

        // The area renderer will make the chart look like an area chart.
        const renderer = new AreaRenderer();

        const xScale = new TimeScale();

        // In case of an area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scalesTop: IXYScales = {
            x: xScale,
            y: new LinearScale(),
        };

        const scalesBottom: IXYScales = {
            x: xScale,
            y: new LinearScale().reverse(),
        };

        // Here we assemble the complete chart series.
        const seriesSetTop: Partial<IChartSeries<IAreaAccessors>>[] = getData().map(d => ({
            ...d,
            renderer,
            accessors,
            scales: scalesTop,
        }));
        this.chartAssistTop.update(seriesSetTop as IChartSeries<IAreaAccessors>[]);

        const seriesSetBottom: Partial<IChartSeries<IAreaAccessors>>[] = getData().map(d => ({
            ...d,
            renderer,
            accessors,
            scales: scalesBottom,
        }));
        this.chartAssistBottom.update(seriesSetBottom as IChartSeries<IAreaAccessors>[]);
    }
}

function topChartConfig(c: XYGridConfig = new XYGridConfig()): XYGridConfig {
    c.dimension.margin.bottom = 0;
    c.dimension.padding.bottom = 0;
    c.borders.bottom.visible = false;

    return c;
}

function bottomChartConfig(c: XYGridConfig = new XYGridConfig()): XYGridConfig {
    c.dimension.padding.top = 0;
    c.dimension.margin.top = 0;

    return c;
}


/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "up",
            name: "Up Speed",
            data: [
                { timeStamp: moment("2016-12-25T11:45:29.909Z", format), value: 6 },
                { timeStamp: moment("2016-12-25T12:10:29.909Z", format), value: 33 },
                { timeStamp: moment("2016-12-25T12:50:29.909Z", format), value: 15 },
                { timeStamp: moment("2016-12-25T13:15:29.909Z", format), value: 20 },
                { timeStamp: moment("2016-12-25T13:40:29.909Z", format), value: 30 },
                { timeStamp: moment("2016-12-25T13:55:29.909Z", format), value: 12 },
                { timeStamp: moment("2016-12-25T14:20:29.909Z", format), value: 6 },
                { timeStamp: moment("2016-12-25T14:40:29.909Z", format), value: 35 },
                { timeStamp: moment("2016-12-25T15:00:29.909Z", format), value: 23 },
                { timeStamp: moment("2016-12-25T15:25:29.909Z", format), value: 25 },
                { timeStamp: moment("2016-12-25T15:45:29.909Z", format), value: 38 },
                { timeStamp: moment("2016-12-25T16:10:29.909Z", format), value: 25 },
                { timeStamp: moment("2016-12-25T16:30:29.909Z", format), value: 43 },
                { timeStamp: moment("2016-12-25T16:45:29.909Z", format), value: 28 },
            ],
        },
        {
            id: "down",
            name: "Dn Speed",
            data: [
                { timeStamp: moment("2016-12-25T11:45:29.909Z", format), value: 12 },
                { timeStamp: moment("2016-12-25T12:10:29.909Z", format), value: 65 },
                { timeStamp: moment("2016-12-25T12:50:29.909Z", format), value: 30 },
                { timeStamp: moment("2016-12-25T13:15:29.909Z", format), value: 40 },
                { timeStamp: moment("2016-12-25T13:40:29.909Z", format), value: 60 },
                { timeStamp: moment("2016-12-25T13:55:29.909Z", format), value: 23 },
                { timeStamp: moment("2016-12-25T14:20:29.909Z", format), value: 12 },
                { timeStamp: moment("2016-12-25T14:40:29.909Z", format), value: 70 },
                { timeStamp: moment("2016-12-25T15:00:29.909Z", format), value: 45 },
                { timeStamp: moment("2016-12-25T15:25:29.909Z", format), value: 50 },
                { timeStamp: moment("2016-12-25T15:45:29.909Z", format), value: 75 },
                { timeStamp: moment("2016-12-25T16:10:29.909Z", format), value: 50 },
                { timeStamp: moment("2016-12-25T16:30:29.909Z", format), value: 85 },
                { timeStamp: moment("2016-12-25T16:45:29.909Z", format), value: 55 },
            ],
        },
    ];
}
