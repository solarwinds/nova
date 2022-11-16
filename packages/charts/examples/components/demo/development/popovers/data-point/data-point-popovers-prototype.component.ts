// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import {
    Chart,
    ChartAssist,
    ChartPopoverPlugin,
    DATA_POINT_INTERACTION_RESET,
    IChartSeries,
    IDataPoint,
    IInteractionDataPointEvent,
    ILineAccessors,
    InteractionType,
    INTERACTION_DATA_POINT_EVENT,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    templateUrl: "./data-point-popovers-prototype.component.html",
})
export class DataPointPopoversPrototypeComponent implements OnInit {
    public chart: Chart;
    public renderer = new LineRenderer({
        markerInteraction: { enabled: true },
    });
    public scales: IXYScales = {
        x: new TimeScale(),
        y: new LinearScale(),
    };
    public accessors: LineAccessors;

    public chartAssist: ChartAssist;
    public popoverPlugin: ChartPopoverPlugin;

    public ngOnInit(): void {
        this.buildChart();
        this.updateChart();
    }

    public onReset(): void {
        // send INTERACTION_DATA_POINT_EVENT with index DATA_POINT_INTERACTION_RESET to hide popover if its displayed
        const data: IInteractionDataPointEvent = {
            interactionType: InteractionType.Click,
            dataPoint: { index: DATA_POINT_INTERACTION_RESET } as IDataPoint,
        };
        this.chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINT_EVENT)
            .next({ data });
    }

    public onToggleClickHandling(enable: boolean): void {
        // enable the pointer cursor when the data point markers are hovered
        const markerInteraction = this.renderer.config?.markerInteraction;
        if (markerInteraction) {
            markerInteraction.clickable = enable;
        }
        this.buildChart(enable ? InteractionType.Click : InteractionType.Hover);
        this.updateChart();
    }

    private buildChart(
        dataPointInteractionType: InteractionType = InteractionType.Hover
    ) {
        // set the desired interaction type for popover handling
        this.popoverPlugin = new ChartPopoverPlugin({
            eventStreamId: INTERACTION_DATA_POINT_EVENT,
            interactionType: dataPointInteractionType,
        });

        this.chart = new Chart(new XYGrid());
        this.chartAssist = new ChartAssist(this.chart);
        this.accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
        this.chart.addPlugin(this.popoverPlugin);
    }

    private updateChart() {
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (s) => ({
                ...s,
                scales: this.scales,
                renderer: this.renderer,
                accessors: this.accessors,
            })
        );

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
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 15 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 60 },
                { x: moment("2016-12-26T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-28T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-01T15:14:29.909Z", format), y: 80 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
    ];
}
