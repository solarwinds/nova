import { Component, OnInit } from "@angular/core";
import { IconService } from "@nova-ui/bits";
import {
    BandScale, BarHighlightStrategy, BarRenderer, BarStatusGridConfig, BarTooltipsPlugin, Chart, CHART_PALETTE_CS_S, HIGHLIGHT_DATA_POINT_EVENT,
    InteractionLabelPlugin, InteractionLinePlugin, IValueProvider, IXYScales, MappedValueProvider, SELECT_DATA_POINT_EVENT, statusAccessors, StatusAccessors,
    SvgMarker, TimeScale, XYGrid,
} from "@nova-ui/charts";
import moment from "moment/moment";

enum Status {
    Unknown = "unknown",
    Up = "up",
    Warning = "warning",
    Down = "down",
    Critical = "critical",
}

@Component({
    selector: "nui-status-chart-test",
    templateUrl: "./status-chart-test.component.html",
})
export class StatusChartTestComponent implements OnInit {
    public chart = new Chart(new XYGrid(new BarStatusGridConfig()));
    public tooltipsPlugin = new BarTooltipsPlugin({ horizontal: true });
    public statusMarkers: IValueProvider<SvgMarker>;

    constructor(private iconService: IconService) {
    }

    public ngOnInit() {
        this.statusMarkers = createMarkerProvider(this.iconService);
        this.chart.addPlugin(this.tooltipsPlugin);

        // In order to set interaction Label Formatter that is independent from bottom tick formatter,
        // it should be added separately with formatter name in a constructor
        this.chart.addPlugin(new InteractionLabelPlugin("labelFormatter"));
        this.chart.addPlugin(new InteractionLinePlugin());

        this.chart.updateDimensions();

        const statusColors = createColorProvider();
        const accessors = statusAccessors(statusColors);
        const iconSize: number = 10;
        const icons = new MappedValueProvider(getResizedIconsValueMap(this.iconService, iconSize));
        // Thickness accessor should be used to specify which status corresponds to a thin bar or thick
        accessors.data.thickness = (data: any) => data.status === Status.Up ? BarRenderer.THIN : BarRenderer.THICK;
        accessors.data.marker = (data: any) => icons.get(data.status);

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });

        const bandScale = new BandScale();
        const timeScale = new TimeScale();
        // This formats label in interaction label plugin
        timeScale.formatters.labelFormatter = (d: any) => moment(d).format("LL");
        bandScale.fixDomain(StatusAccessors.STATUS_DOMAIN);
        const scales: IXYScales = {
            y: bandScale,
            x: timeScale,
        };

        // Marker accessor is used to draw marker on a bar depending on the data point
        accessors.data.marker = (data: any) => icons.get(data.status);

        const seriesSet = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chart.update(seriesSet);

        // Sample events that can be used in order to handle click or highlighting of certain status
        this.chart.getEventBus().getStream(HIGHLIGHT_DATA_POINT_EVENT).subscribe(console.log);
        this.chart.getEventBus().getStream(SELECT_DATA_POINT_EVENT).subscribe(console.log);
    }
}

function createMarkerProvider(iconService: IconService): IValueProvider<SvgMarker> {
    const getStatusMarker = (status: string) => new SvgMarker(iconService.getStatusIcon(status));

    return new MappedValueProvider({
        [Status.Unknown]: getStatusMarker(Status.Unknown),
        [Status.Up]: getStatusMarker(Status.Up),
        [Status.Warning]: getStatusMarker(Status.Warning),
        [Status.Down]: getStatusMarker(Status.Down),
        [Status.Critical]: getStatusMarker(Status.Critical),
    });
}

function createColorProvider(): IValueProvider<string> {
    return new MappedValueProvider<string>({
        [Status.Unknown]: CHART_PALETTE_CS_S[3],
        [Status.Up]: CHART_PALETTE_CS_S[4],
        [Status.Warning]: CHART_PALETTE_CS_S[2],
        [Status.Down]: CHART_PALETTE_CS_S[0],
        [Status.Critical]: CHART_PALETTE_CS_S[1],
    });
}

function getResizedIconsValueMap(iconService: IconService, iconSize: number) {
    return {
        [Status.Unknown]: iconService.getIconResized(iconService.getStatusIcon(Status.Unknown), iconSize),
        [Status.Up]: iconService.getIconResized(iconService.getStatusIcon(Status.Up), iconSize),
        [Status.Warning]: iconService.getIconResized(iconService.getStatusIcon(Status.Warning), iconSize),
        [Status.Down]: iconService.getIconResized(iconService.getStatusIcon(Status.Down), iconSize),
        [Status.Critical]: iconService.getIconResized(iconService.getStatusIcon(Status.Critical), iconSize),
    };
}

/* Chart data */
function getData() {
    return [{
        id: "1",
        name: "Series 1",
        data: [
            {
                status: Status.Up,
                start: 0, // in days from today
                end: 22,
            },
            {
                status: Status.Warning,
                start: 22,
                end: 39,
            },
            {
                status: Status.Unknown,
                start: 39,
                end: 59,
            },
            {
                status: Status.Down,
                start: 59,
                end: 109,
            },
            {
                status: Status.Critical,
                start: 109,
                end: 178,
            },
            {
                status: Status.Up,
                start: 178,
                end: 877,
            },
            {
                status: Status.Critical,
                start: 877,
                end: 980,
            },
            {
                status: Status.Warning,
                start: 980,
                end: 1000,
            },
        ].map(d => ({
            value: d.end - d.start,
            status: d.status,
            start: getDate(d.start),
            end: getDate(d.end),
        })),
    }];
}

function getDate(hours: number) {
    return moment("1986-02-17").add({ hours }).toDate();
}
