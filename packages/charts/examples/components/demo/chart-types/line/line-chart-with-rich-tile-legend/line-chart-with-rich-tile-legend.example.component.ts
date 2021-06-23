import { Component, OnInit } from "@angular/core";
import {
    Chart, ChartAssist, IChartSeries, ILineAccessors, IXYScales, LineAccessors, LinearScale, LineRenderer, LineSelectSeriesInteractionStrategy, TimeScale,
    XYGrid,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-line-chart-with-rich-tile-legend-example",
    templateUrl: "./line-chart-with-rich-tile-legend.example.component.html",
})
export class LineChartWithRichTileLegendExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public ngOnInit() {
        // providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors(this.chartAssist.palette.standardColors, this.chartAssist.markers);
        const renderer = new LineRenderer({
            // for series interaction and ability to handle click configure renderer with interactionStrategy
            interactionStrategy: new LineSelectSeriesInteractionStrategy(),
        });
        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            scales,
            renderer,
            accessors,
        }));

        // chart assist needs to be used to update data
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
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 130 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 195 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 115 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 160 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 135 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 60 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
    ];
}
