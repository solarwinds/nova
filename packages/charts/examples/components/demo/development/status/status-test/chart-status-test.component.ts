import { AfterViewInit, Component } from "@angular/core";
import { IconService } from "@nova-ui/bits";
import {
    BandScale,
    BarRenderer,
    BarStatusGridConfig,
    Chart,
    CHART_PALETTE_CS_S,
    IChartSeries,
    IStatusAccessors,
    IValueProvider,
    MappedValueProvider,
    RenderState,
    statusAccessors,
    StatusAccessors,
    SvgMarker,
    TimeIntervalScale,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";
import range from "lodash/range";
import moment from "moment/moment";

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
}

@Component({
    selector: "nui-status-chart-test-example",
    templateUrl: "./chart-status-test.component.html",
})
export class ChartStatusTestComponent implements AfterViewInit {
    public chartThreshold = new Chart(new XYGrid(new BarStatusGridConfig()));
    public chartBand = new Chart(new XYGrid(new BarStatusGridConfig()));

    public customMarkers: IValueProvider<SvgMarker>;

    private thresholdScales: { x: TimeScale; y: BandScale };
    private bandScales: { x: TimeIntervalScale; y: BandScale };

    constructor(private iconService: IconService) {
        const getStatusMarker = (status: string) =>
            new SvgMarker(this.iconService.getStatusIcon(status));

        this.customMarkers = new MappedValueProvider({
            [Status.Up]: getStatusMarker(Status.Up),
            [Status.Warning]: getStatusMarker(Status.Warning),
            [Status.Critical]: getStatusMarker(Status.Critical),
        });
    }

    public ngAfterViewInit() {
        this.chartThreshold.updateDimensions();
        this.chartBand.updateDimensions();

        const bandScale = new BandScale();
        bandScale.fixDomain(StatusAccessors.STATUS_DOMAIN);

        const timeIntervalScale = new TimeIntervalScale(
            moment.duration(100, "hours")
        );
        timeIntervalScale.fixDomain([
            moment().toDate(),
            moment().add(1000, "hours").toDate(),
        ]);

        const timeScale = new TimeScale();
        // This formats label in interaction label plugin
        timeScale.formatters.labelFormatter = (d: any) =>
            moment(d).format("LL");

        this.thresholdScales = {
            y: bandScale,
            x: timeScale,
        };
        this.bandScales = {
            y: bandScale,
            x: timeIntervalScale,
        };

        const renderer = new BarRenderer();
        const accessors = statusAccessors(
            new MappedValueProvider<string>(getStatusValueMap())
        );

        // Thickness accessor should be used to specify which status corresponds to a thin bar or thick
        accessors.data.thickness = (data: any) =>
            data.status === Status.Up ? BarRenderer.THIN : BarRenderer.THICK;

        // Here we assemble the complete chart series.
        const thresholdSeriesSet: IChartSeries<IStatusAccessors>[] = getData({
            numberOfSeries: 10,
            isRandom: true,
        }).map((d) => ({
            ...d,
            accessors,
            renderer,
            scales: this.thresholdScales,
        }));
        // Here we assemble the complete chart series.
        const bandSeriesSet: IChartSeries<IStatusAccessors>[] = getData({
            numberOfSeries: 1,
            isRandom: false,
        }).map((d) => ({
            ...d,
            accessors,
            renderer,
            scales: this.thresholdScales,
        }));

        this.chartThreshold.update(thresholdSeriesSet);
        this.chartThreshold.setSeriesStates(
            thresholdSeriesSet.map((series) => ({
                seriesId: series.id,
                state: RenderState.deemphasized,
            }))
        );

        this.chartBand.update(bandSeriesSet);
    }
}

function getStatusValueMap() {
    return {
        [Status.Up]: CHART_PALETTE_CS_S[4],
        [Status.Warning]: CHART_PALETTE_CS_S[2],
        [Status.Critical]: CHART_PALETTE_CS_S[1],
    };
}

/* Chart data */
function getData(
    config: { numberOfSeries: number; isRandom: boolean } = {
        numberOfSeries: 1,
        isRandom: true,
    }
) {
    const getDate = (hours: number) => moment().add({ hours }).toDate();

    const generateThresholdData = (isRandom: boolean) => () => {
        let nextStart = 0;
        const thresholds: any[] = [];
        while (nextStart < 1000) {
            let nextFinish = nextStart + (isRandom ? Math.random() * 100 : 100);
            if (nextFinish >= 1000) {
                nextFinish = 1000;
            }
            const statusSeed = Math.random();
            thresholds.push({
                start: nextStart,
                end: nextFinish,
                status:
                    statusSeed > 0.5
                        ? Status.Up
                        : statusSeed > 0.2
                        ? Status.Warning
                        : Status.Critical,
            });
            nextStart = nextFinish;
        }
        return thresholds;
    };

    const seriesData = range(config.numberOfSeries);

    return seriesData
        .map(generateThresholdData(config.isRandom))
        .map((series, i) => ({
            id: "series-" + i,
            name: "Series " + i,
            data: series.map((d) => ({
                value: d.end - d.start,
                status: d.status,
                start: getDate(d.start),
                end: getDate(d.end),
            })),
        }));
}
