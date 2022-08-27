import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import { Moment } from "moment/moment";

import {
    BandScale,
    BarRenderer,
    Chart,
    ChartAssist,
    ChartPalette,
    ChartTooltipsPlugin,
    CHART_PALETTE_CS_S,
    getAutomaticDomainWithIncludedInterval,
    IAccessors,
    IChartAssistSeries,
    IChartSeries,
    IDataSeries,
    ILineAccessors,
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
    UtilityService,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-thresholds-summary-test",
    templateUrl: "./thresholds-summary-test.component.html",
})
export class ThresholdsSummaryTestComponent implements OnChanges, OnInit {
    @Input() data: Record<string, number[]>;
    @Input() zones: ISimpleThresholdZone[];
    @Input() startDate: Moment;

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
            x: new TimeScale(),
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
                    error: CHART_PALETTE_CS_S[1],
                    warning: CHART_PALETTE_CS_S[2],
                    ok: CHART_PALETTE_CS_S[4],
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

    public ngOnInit() {
        this.update(this.data);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"] || changes["zones"]) {
            this.update(this.data);
        }
    }

    private update(data: Record<string, number[]>) {
        const seriesSet: IChartSeries<ILineAccessors>[] = getDataSeriesSet(
            data,
            this.accessors,
            this.startDate
        ).map((d: any) => ({
            ...d,
            renderer: this.renderer,
            scales: this.scales,
        }));

        const summarySeriesSet: IChartAssistSeries<IAccessors>[] = [
            ...seriesSet,
        ].map((s) => {
            const summaryZoneDefs = [...this.zones, { status: "ok" }];
            const zones = this.thresholdsService.getThresholdZones(
                s,
                summaryZoneDefs,
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

function getDataSeriesSet(
    data: Record<string, number[]>,
    accessors: LineAccessors,
    startDate: Moment
): IDataSeries<LineAccessors>[] {
    const toDataPoint = (y: number, i: number) => ({
        x: startDate.clone().add(i, "d"),
        y,
    });

    return Object.keys(data).map((seriesId) => {
        const seriesData = data[seriesId];
        const dataValues = seriesData.map(toDataPoint);

        return {
            id: seriesId,
            name: seriesId,
            data: dataValues,
            accessors,
        };
    });
}
