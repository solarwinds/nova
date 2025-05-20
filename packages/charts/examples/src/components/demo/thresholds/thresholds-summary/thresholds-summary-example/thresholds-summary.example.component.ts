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
import cloneDeep from "lodash/cloneDeep";
import moment from "moment/moment";

import {
    BandScale,
    BarRenderer,
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS_S_EXTENDED,
    getAutomaticDomainWithIncludedInterval,
    IAccessors,
    IChartAssistSeries,
    IChartSeries,
    ILineAccessors,
    IScale,
    ISimpleThresholdZone,
    IXYScales,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MappedValueProvider,
    StatusAccessors,
    ThresholdsService,
    thresholdsSummaryGridConfig,
    thresholdsTopGridConfig,
    THRESHOLDS_SUMMARY_RENDERER_CONFIG,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

enum Status {
    Error = "error",
    Warning = "warning",
    Ok = "ok",
}

@Component({
    selector: "nui-thresholds-summary-example",
    templateUrl: "./thresholds-summary.example.component.html",
})
export class ThresholdsSummaryExampleComponent implements OnInit {
    public chartAssist: ChartAssist;
    public summaryChartAssist: ChartAssist;

    private thresholdsPalette: ChartPalette;

    constructor(private thresholdsService: ThresholdsService) {}

    public ngOnInit(): void {
        // When instantiating the charts, use the provided grid configuration functions for the main grid and summary grid
        const mainChart = new Chart(new XYGrid(thresholdsTopGridConfig()));
        const summaryChart = new Chart(
            new XYGrid(thresholdsSummaryGridConfig())
        );

        // Instantiate a chart assist for the main chart and summary chart
        this.chartAssist = new ChartAssist(mainChart);
        this.summaryChartAssist = new ChartAssist(summaryChart);

        // Synchronize the legend interaction events between the chart assists
        this.summaryChartAssist.syncWithChartAssist(this.chartAssist);

        // Create scales for the main chart data series
        // Note that the x scale is shared between the main chart data series, main chart thresholds, and summary visualizations
        const sharedXScale = new TimeScale();
        const mainChartDataScales: IXYScales = {
            x: sharedXScale,
            y: new LinearScale(),
        };

        // Set the left scale ID on the main chart grid to let it know which scale to use for the left axis ticks
        (mainChart.getGrid() as XYGrid).leftScaleId = mainChartDataScales.y.id;

        // To give the data series visualization some vertical breathing room, set the y scale's
        // domainCalculator by invoking getAutomaticDomainWithIncludedInterval, where the
        // specified interval is larger than the expected domain of the visualized data
        mainChartDataScales.y.domainCalculator =
            getAutomaticDomainWithIncludedInterval([0, 100]);

        // Create a palette with a mapped value provider that maps status to color
        this.thresholdsPalette = new ChartPalette(
            new MappedValueProvider(
                {
                    [Status.Error]: CHART_PALETTE_CS_S_EXTENDED[2],
                    [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
                    [Status.Ok]: CHART_PALETTE_CS_S_EXTENDED[8],
                },
                "transparent"
            )
        );

        // Standard line renderer for the data series visualization
        const renderer = new LineRenderer();
        // Providing chartAssist colors and markers to LineAccessors will share them with the line chart
        const accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );

        // Here we define the data series on the main chart which will be visualized as lines.
        // These series are also used in the creation of the corresponding main chart threshold series
        // and summary chart series.
        const mainChartDataSeriesSet: IChartSeries<ILineAccessors>[] =
            getData().map((d) => ({
                ...d,
                accessors,
                renderer,
                scales: mainChartDataScales,
            }));

        // Zone definitions tell the threshold service where threshold zones begin and end
        const zoneDefinitions: ISimpleThresholdZone[] = getZoneDefinitions();

        // See the createMainChartThresholdSeriesSet method definition below for how to assemble
        // the required elements for thresholds on the main chart
        const mainChartThresholdSeriesSet =
            this.createMainChartThresholdSeriesSet(
                mainChartDataSeriesSet,
                mainChartDataScales,
                zoneDefinitions
            );

        // See the createSummarySeriesSet method definition below for how to assemble the required elements
        // for thresholds on the summary chart
        const summarySeriesSet = this.createSummarySeriesSet(
            mainChartDataSeriesSet,
            sharedXScale,
            zoneDefinitions
        );

        // Invoke the update method on each of the chart assists passing the appropriate series sets
        // ---
        // *Note:* The order in which these series sets are rendered on the chart corresponds to the order in which
        // the series are passed here. So, in this case, since the 'mainChartDataSeriesSet' appears after the
        // 'mainChartThresholdSeriesSet' in this array, the main data elements will be rendered in front of the
        // threshold-related elements on the chart.
        this.chartAssist.update([
            ...mainChartThresholdSeriesSet,
            ...mainChartDataSeriesSet,
        ]);
        this.summaryChartAssist.update(summarySeriesSet);
    }

    private createMainChartThresholdSeriesSet(
        mainChartDataSeriesSet: IChartSeries<ILineAccessors>[],
        mainChartDataScales: IXYScales,
        zoneDefinitions: ISimpleThresholdZone[]
    ) {
        // Create scales for the main chart thresholds.
        // Note that the same x scale from the data series scales is used here.
        // Also note that the y band scale fixes the domain to a single value of STATUS_DOMAIN
        const thresholdScales = {
            x: mainChartDataScales.x,
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        const thresholdSeriesSet: IChartAssistSeries<IAccessors>[] = [];
        for (const s of mainChartDataSeriesSet) {
            // It's possible to manually define zones by area-like data series with start/end values for every data point. We don't do that
            // here, but what we do instead is use simplified zones that are defined by a start value and/or an end value. (A missing
            // start or end value indicates an infinite zone.)
            // Those values are then converted into a set of data series in this step.
            const zones = this.thresholdsService.getThresholdZones(
                s,
                zoneDefinitions,
                this.thresholdsPalette.standardColors
            );

            // This injects threshold data into every data point of the source series. It is important, because later we can
            // access related threshold information from many different places like legend, tooltips or even when calculating
            // other threshold related data series, which we do in the following step.
            this.thresholdsService.injectThresholdsData(s, zones);

            // Here we create the threshold related visuals for this series. The methods on the thresholdService are broken down and
            // generate separate elements of the whole, because some situations only require, for example, the backgrounds to be applied.
            // In this case, we're creating backgrounds, side indicators, and threshold lines.
            // ---
            // *Note:* The order in which these elements are rendered on the chart corresponds to the order in which
            // the elements are defined here. So, in this case, since the threshold lines are defined after the
            // backgrounds in this array, the threshold lines will be rendered in front of the backgrounds on the chart.
            const seriesThresholds = [
                this.thresholdsService.getBackgrounds(
                    s,
                    zones,
                    thresholdScales,
                    this.thresholdsPalette.backgroundColors
                ),
                ...this.thresholdsService.getThresholdLines(zones),
                ...this.thresholdsService.getSideIndicators(
                    zones,
                    mainChartDataScales
                ),
            ];

            thresholdSeriesSet.push(...seriesThresholds);
        }
        return thresholdSeriesSet;
    }

    private createSummarySeriesSet(
        seriesSet: IChartSeries<ILineAccessors>[],
        xScale: IScale<any>,
        zoneDefinitions: ISimpleThresholdZone[]
    ) {
        // Zone definitions let the threshold service know where threshold zones begin and end.
        //
        // The summary zones use the same definitions as those on the main chart,
        // but they also include an "ok" zone for time periods during which a threshold is not exceeded.
        // The reason the main chart thresholds don't include an "ok" zone is that there just isn't
        // a need to visualize the data in an "ok" state there.
        //
        // On the summary, data falling within the "ok" zone is visualized as a thin green line.
        const summaryZoneDefs = [...zoneDefinitions, { status: Status.Ok }];

        // Create scales for the summary chart.
        // Note that the same x scale from the data series scales of the main chart is used here.
        // Also note that, similar to the main chart thresholds, the y band scale fixes the domain to a single value of STATUS_DOMAIN
        const summaryScales = {
            x: xScale,
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        // A thickness map can be provided to the thresholds service getBackgrounds method if you want to specify a custom
        // height for the threshold visualization. The default thickness is the full height of the grid.
        const thicknessMap = { [Status.Ok]: BarRenderer.THIN };

        const summarySeriesSet: IChartAssistSeries<IAccessors>[] = [
            ...seriesSet,
        ].map((s) => {
            // It's possible to manually define zones by area-like data series with start/end values for every data point. We don't do that
            // here, but what we do instead is use simplified zones that are defined by a start value and/or an end value. (A missing
            // start or end value indicates an infinite zone.)
            // Those values are then converted into a set of data series in this step.
            const zones = this.thresholdsService.getThresholdZones(
                s,
                summaryZoneDefs,
                this.thresholdsPalette.standardColors
            );

            // This injects threshold data into every data point of the source series. It's important, because later we can
            // access related threshold information from many different places like legend, tooltips or even when calculating
            // other threshold related data series, which we do in the following step.
            this.thresholdsService.injectThresholdsData(s, zones);

            // Finally, create the thresholds series by invoking the threshold service's getBackgrounds method
            // with arguments for the data series, the defined zones, the palette's standard colors
            // and the predefined THRESHOLDS_SUMMARY_RENDERER_CONFIG.
            // The renderer config defines the behavior of series when they are emphasized, hidden, etc.
            return this.thresholdsService.getBackgrounds(
                s,
                zones,
                summaryScales,
                this.thresholdsPalette.standardColors,
                thicknessMap,
                cloneDeep(THRESHOLDS_SUMMARY_RENDERER_CONFIG)
            );
        });

        return summarySeriesSet;
    }
}

/** Chart data */
function getZoneDefinitions() {
    return [
        { status: Status.Error, start: 80 },
        { status: Status.Warning, start: 60, end: 80 },
    ];
}

function getData(): any[] {
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
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
    ];
}
