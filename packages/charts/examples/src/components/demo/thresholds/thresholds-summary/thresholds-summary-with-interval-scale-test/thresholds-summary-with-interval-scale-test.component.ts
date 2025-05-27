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
import moment, { duration } from "moment/moment";

import {
    BandScale,
    BarRenderer,
    Chart,
    ChartAssist,
    ChartPalette,
    ChartTooltipsPlugin,
    CHART_PALETTE_CS_S_EXTENDED,
    getAutomaticDomainWithIncludedInterval,
    IAccessors,
    IChartAssistSeries,
    IChartSeries,
    ILineAccessors,
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
    TimeIntervalScale,
    UtilityService,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-thresholds-summary-with-interval-scale-test",
    templateUrl: "./thresholds-summary-with-interval-scale-test.component.html",
})
export class ThresholdsSummaryWithIntervalScaleTestComponent implements OnInit {
    public zones = [
        { status: "error", start: 80 },
        { status: "error", start: -100, end: 10 },
        { status: "warning", start: 60, end: 80 },
        { status: "warning", start: 10, end: 20 },
    ];
    public summaryZones = [...this.zones, { status: "ok", start: 20, end: 60 }];
    public startDate = moment([2016, 11, 25, 15, 14, 29]); // "2016-12-25T15:14:29.000Z"
    public uid = UtilityService.uuid();

    public chart = new Chart(new XYGrid(thresholdsTopGridConfig()));
    public summaryChart = new Chart(new XYGrid(thresholdsSummaryGridConfig()));

    public chartAssist = new ChartAssist(this.chart);
    public summaryChartAssist = new ChartAssist(this.summaryChart);
    public tooltipsPlugin: ChartTooltipsPlugin;
    public thresholdsPalette: ChartPalette;
    public thicknessMap: Record<string, number>;

    private accessors: LineAccessors;
    private renderer: LineRenderer;
    private scales: IXYScales;
    private backgroundScales: IXYScales;
    private summaryScales: IXYScales;

    constructor(private thresholdsService: ThresholdsService) {
        this.scales = {
            x: new TimeIntervalScale(duration(5, "minutes")),
            y: new LinearScale(),
        };

        this.backgroundScales = {
            x: this.scales.x,
            y: new BandScale(),
        };

        this.summaryScales = {
            x: this.scales.x,
            y: new BandScale(),
        };

        this.configureGrids(this.scales.y.id);

        this.summaryChartAssist.syncWithChartAssist(this.chartAssist);

        this.scales.y.domainCalculator = getAutomaticDomainWithIncludedInterval(
            [0, 100]
        );
        this.backgroundScales.y.fixDomain(StatusAccessors.STATUS_DOMAIN);
        this.summaryScales.y.fixDomain(StatusAccessors.STATUS_DOMAIN);

        this.thresholdsPalette = new ChartPalette(
            new MappedValueProvider(
                {
                    error: CHART_PALETTE_CS_S_EXTENDED[2],
                    warning: CHART_PALETTE_CS_S_EXTENDED[4],
                    ok: CHART_PALETTE_CS_S_EXTENDED[8],
                },
                "transparent"
            )
        );
        this.thicknessMap = { ok: BarRenderer.THIN };

        this.renderer = new LineRenderer();
        this.accessors = new LineAccessors(
            this.chartAssist.palette.standardColors,
            this.chartAssist.markers
        );
    }

    public ngOnInit(): void {
        this.update();
    }

    private update() {
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d: any) => ({
                ...d,
                renderer: this.renderer,
                accessors: this.accessors,
                scales: this.scales,
            })
        );

        const summarySeriesSet: IChartAssistSeries<IAccessors>[] = [
            ...seriesSet,
        ].map((s) => {
            const zones = this.thresholdsService.getThresholdZones(
                s,
                this.summaryZones,
                this.thresholdsPalette.standardColors
            );
            this.thresholdsService.injectThresholdsData(s, zones);
            return this.thresholdsService.getBackgrounds(
                s,
                zones,
                this.summaryScales,
                this.thresholdsPalette.standardColors,
                this.thicknessMap,
                cloneDeep(THRESHOLDS_SUMMARY_RENDERER_CONFIG)
            );
        });
        const thresholdSeriesSet: IChartAssistSeries<IAccessors>[] = [];
        for (const s of seriesSet) {
            const zones = this.thresholdsService.getThresholdZones(
                s,
                this.zones,
                this.thresholdsPalette.standardColors
            );
            this.thresholdsService.injectThresholdsData(s, zones);
            thresholdSeriesSet.push(
                ...[
                    this.thresholdsService.getBackgrounds(
                        s,
                        zones,
                        this.backgroundScales,
                        this.thresholdsPalette.backgroundColors
                    ),
                    ...this.thresholdsService.getThresholdLines(zones),
                    ...this.thresholdsService.getSideIndicators(
                        zones,
                        this.scales
                    ),
                ]
            );
        }
        // chart assist needs to be used to update data
        this.chartAssist.update([...thresholdSeriesSet, ...seriesSet]);
        this.summaryChartAssist.update(summarySeriesSet);
    }

    private configureGrids(mainChartLeftScaleId: string) {
        const topGrid = this.chart.getGrid() as XYGrid;
        topGrid.leftScaleId = mainChartLeftScaleId;
        const topGridConfig = topGrid.config();
        topGridConfig.dimension.width(400);
        topGridConfig.dimension.height(110);
        topGridConfig.dimension.autoWidth = false;
        topGridConfig.dimension.autoHeight = false;

        const summaryGridConfig = this.summaryChart.getGrid().config();
        summaryGridConfig.dimension.width(400);
        summaryGridConfig.dimension.autoWidth = false;
    }
}

function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:05:00Z", format).toDate(), y: 30 },
                { x: moment("2016-12-25T15:10:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:15:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:20:00Z", format).toDate(), y: 80 },
                { x: moment("2016-12-25T15:25:00Z", format).toDate(), y: 45 },
                { x: moment("2016-12-25T15:30:00Z", format).toDate(), y: 60 },
                { x: moment("2016-12-25T15:35:00Z", format).toDate(), y: 10 },
                { x: moment("2016-12-25T15:40:00Z", format).toDate(), y: 35 },
            ],
        },
    ];
}
