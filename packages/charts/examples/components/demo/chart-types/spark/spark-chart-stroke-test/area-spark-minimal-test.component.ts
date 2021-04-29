import { Component, OnInit } from "@angular/core";
import {
    AreaRenderer,
    Chart,
    IChart,
    IChartSeries,
    ILineAccessors,
    IXYScales,
    LinearScale,
    stackedAreaAccessors,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-area-spark-minimal-test",
    templateUrl: "./area-spark-minimal-test.component.html",
    styleUrls: ["./area-spark-minimal-test.component.less"],
})
export class AreaSparkMinimalTestComponent implements OnInit {
    public chart: IChart;

    public ngOnInit() {
        const gridConfig = new XYGridConfig();
        gridConfig.axis.left.visible = false;
        gridConfig.axis.bottom.visible = false;
        gridConfig.axis.top.visible = false;
        gridConfig.axis.right.visible = false;
        gridConfig.borders.bottom.visible = false;
        gridConfig.dimension.padding.bottom = 0;
        gridConfig.interactive = false;
        gridConfig.dimension.margin.right = 0;
        gridConfig.dimension.margin.bottom = 0;
        gridConfig.dimension.margin.top = 0;
        gridConfig.dimension.margin.left = 0;
        gridConfig.axis.left.gridTicks = false;

        // Create an x-y grid by passing the spark chart grid config as an argument to the constructor
        const grid = new XYGrid(gridConfig);

        // Instantiate the chart using the configured spark chart grid as an argument to the chart's constructor
        this.chart = new Chart(grid);

        // Generate line accessors, x-y scales, and a line renderer to be included in the IChartSeries collection
        const accessors = stackedAreaAccessors();
        const renderer = new AreaRenderer({ strokeWidth: 0 });
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        // Assemble the series set
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // Invoke the chart's update method with the IChartSeries collection as the argument
        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [{
        id: "1",
        name: "Series 1",
        data: [
            { x: moment("2018-07-08T01:51:43.448Z", format), y: 62 },
            { x: moment("2018-07-21T17:35:10.344Z", format), y: 57 },
            { x: moment("2018-08-04T09:18:37.241Z", format), y: 99 },
            { x: moment("2018-08-18T01:02:04.137Z", format), y: 75 },
            { x: moment("2018-08-31T16:45:31.034Z", format), y: 55 },
            { x: moment("2018-09-14T08:28:57.931Z", format), y: 73 },
            { x: moment("2018-09-28T00:12:24.827Z", format), y: 69 },
            { x: moment("2018-10-11T15:55:51.724Z", format), y: 77 },
            { x: moment("2018-10-25T07:39:18.620Z", format), y: 57 },
            { x: moment("2018-11-07T23:22:45.517Z", format), y: 61 },
            { x: moment("2018-11-21T15:06:12.413Z", format), y: 68 },
            { x: moment("2018-12-05T06:49:39.310Z", format), y: 82 },
            { x: moment("2018-12-18T22:33:06.206Z", format), y: 81 },
            { x: moment("2019-01-01T14:16:33.103Z", format), y: 78 },
            { x: moment("2019-01-15T06:00:00.000Z", format), y: 90 },
        ],
    }];
}
