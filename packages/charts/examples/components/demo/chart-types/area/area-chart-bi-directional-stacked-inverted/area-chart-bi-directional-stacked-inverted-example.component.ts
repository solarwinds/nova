import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import {
    AreaAccessors,
    AreaRenderer,
    Chart,
    ChartAssist,
    domainWithAuxiliarySeries,
    getAutomaticDomain,
    IAreaAccessors,
    IChartAssistSeries,
    IChartSeries,
    IXYScales,
    LinearScale,
    stackedArea,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "area-chart-bi-directional-stacked-inverted-example",
    templateUrl:
        "./area-chart-bi-directional-stacked-inverted-example.component.html",
})
export class AreaChartBiDirectionalStackedInvertedExampleComponent
    implements OnInit
{
    public chartTop: Chart;
    public chartAssistTop: ChartAssist;

    public chartBottom: Chart;
    public chartAssistBottom: ChartAssist;

    public ngOnInit(): void {
        this.chartTop = new Chart(new XYGrid(topChartConfig()), {
            updateDomainForEmptySeries: true,
        });
        this.chartAssistTop = new ChartAssist(this.chartTop, stackedArea);

        this.chartBottom = new Chart(new XYGrid(bottomChartConfig()), {
            updateDomainForEmptySeries: true,
        });
        this.chartAssistBottom = new ChartAssist(
            this.chartBottom,
            stackedArea,
            this.chartAssistTop.palette,
            this.chartAssistTop.markers
        );
        const accessors = this.createAccessors();
        const renderer = new AreaRenderer();
        const xScale = new TimeScale();

        /**
         * Scale Reversal for Inverted Stacks
         */
        const scalesTop: IXYScales = {
            x: xScale,
            // Invoke 'reverse' on the top chart's y-axis scale to stack the chart's series in a downward direction starting at the top.
            y: new LinearScale().reverse(),
        };

        const scalesBottom: IXYScales = {
            x: xScale,
            // Use the standard y-axis scale orientation on the bottom chart to stack the chart's series in an upward direction starting at the bottom.
            y: new LinearScale(),
        };

        // Here we assemble a complete chart series set for each chart.
        const seriesSetTop: IChartSeries<IAreaAccessors>[] = getDataTop().map(
            (d) => ({
                ...d,
                renderer,
                accessors,
                scales: scalesTop,
            })
        );

        const seriesSetBottom: IChartSeries<IAreaAccessors>[] =
            getDataBottom().map((d) => ({
                ...d,
                renderer,
                accessors,
                scales: scalesBottom,
            }));

        // We need to replace the default domain calculators to have each chart take the series
        // on the opposite chart into account when calculating the domains.
        const topChartDomainCalculator = domainWithAuxiliarySeries(
            () => seriesSetBottom,
            getAutomaticDomain
        );
        scalesTop.y.domainCalculator = topChartDomainCalculator;
        scalesTop.x.domainCalculator = topChartDomainCalculator;

        const bottomChartDomainCalculator = domainWithAuxiliarySeries(
            () => seriesSetTop,
            getAutomaticDomain
        );
        scalesBottom.y.domainCalculator = bottomChartDomainCalculator;
        scalesBottom.x.domainCalculator = bottomChartDomainCalculator;

        this.chartAssistTop.update(seriesSetTop);
        this.chartAssistBottom.update(seriesSetBottom);
    }

    /**
     * This function ensures the change in visibility of series is propagated to both charts. The chart that is directly
     * associated with the series has to be invoked first.
     */
    public onSelectedChange(
        legendSeries: IChartAssistSeries<any>,
        value: boolean,
        currentChartAssist: ChartAssist
    ): void {
        let chartAssists = [this.chartAssistTop, this.chartAssistBottom];
        if (currentChartAssist === this.chartAssistBottom) {
            chartAssists = chartAssists.reverse();
        }
        for (const ca of chartAssists) {
            ca.toggleSeries(legendSeries.id, value);
        }
    }

    private createAccessors() {
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

        return accessors;
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
function getDataTop() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "www-http-ingress",
            name: "World Wide Web HTTP",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 33,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 15,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 20,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 35,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 25,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 38,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 25,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 43,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 28,
                },
            ],
        },
        {
            id: "mssql-server-ingress",
            name: "MSSQL-Server",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 65,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 40,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 60,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 70,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 45,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 75,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 85,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 55,
                },
            ],
        },
    ];
}

function getDataBottom() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "www-http-egress",
            name: "World Wide Web HTTP",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 33,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 15,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 20,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 6,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 35,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 95,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 38,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 25,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 43,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 28,
                },
            ],
        },
        {
            id: "mssql-server-egress",
            name: "MSSQL-Server",
            data: [
                {
                    timeStamp: moment("2016-12-25T11:45:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T12:10:29.909Z", format),
                    value: 65,
                },
                {
                    timeStamp: moment("2016-12-25T12:50:29.909Z", format),
                    value: 30,
                },
                {
                    timeStamp: moment("2016-12-25T13:15:29.909Z", format),
                    value: 40,
                },
                {
                    timeStamp: moment("2016-12-25T13:40:29.909Z", format),
                    value: 60,
                },
                {
                    timeStamp: moment("2016-12-25T13:55:29.909Z", format),
                    value: 23,
                },
                {
                    timeStamp: moment("2016-12-25T14:20:29.909Z", format),
                    value: 12,
                },
                {
                    timeStamp: moment("2016-12-25T14:40:29.909Z", format),
                    value: 250,
                },
                {
                    timeStamp: moment("2016-12-25T15:00:29.909Z", format),
                    value: 45,
                },
                {
                    timeStamp: moment("2016-12-25T15:25:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T15:45:29.909Z", format),
                    value: 75,
                },
                {
                    timeStamp: moment("2016-12-25T16:10:29.909Z", format),
                    value: 50,
                },
                {
                    timeStamp: moment("2016-12-25T16:30:29.909Z", format),
                    value: 85,
                },
                {
                    timeStamp: moment("2016-12-25T16:45:29.909Z", format),
                    value: 55,
                },
            ],
        },
    ];
}
