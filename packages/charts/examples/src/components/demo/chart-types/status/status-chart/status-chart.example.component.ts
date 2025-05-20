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

import { IconService } from "@nova-ui/bits";
import {
    BandScale,
    BarHighlightStrategy,
    BarRenderer,
    BarStatusGridConfig,
    BarTooltipsPlugin,
    Chart,
    CHART_PALETTE_CS_S_EXTENDED,
    HIGHLIGHT_DATA_POINT_EVENT,
    InteractionLabelPlugin,
    InteractionLinePlugin,
    IValueProvider,
    IXYScales,
    MappedValueProvider,
    SELECT_DATA_POINT_EVENT,
    statusAccessors,
    StatusAccessors,
    SvgMarker,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

enum Status {
    Unknown = "unknown",
    Up = "up",
    Warning = "warning",
    Down = "down",
    Critical = "critical",
}

@Component({
    selector: "nui-status-chart-example",
    templateUrl: "./status-chart.example.component.html",
})
export class StatusChartExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid(new BarStatusGridConfig()));
    public tooltipsPlugin: BarTooltipsPlugin;
    public tooltipsStatusMarkers: IValueProvider<SvgMarker>;

    constructor(private iconService: IconService) {}

    public ngOnInit(): void {
        // Configure the tooltips plugin (if needed)
        this.tooltipsStatusMarkers = createTooltipMarkerProvider(
            this.iconService
        );
        this.tooltipsPlugin = new BarTooltipsPlugin({ horizontal: true });
        this.chart.addPlugin(this.tooltipsPlugin);

        // In order to set an interaction Label Formatter that is independent from bottom tick formatter,
        // it should be added separately with the formatter name in the constructor.
        // See timeScale.formatters.labelFormatter instance below.
        this.chart.addPlugin(new InteractionLabelPlugin("labelFormatter"));
        this.chart.addPlugin(new InteractionLinePlugin());

        // Create a MappedValueProvider to map the statuses to their corresponding colors and pass it to the
        // statusAccessors function to generate a StatusAccessors instance
        const statusColors = createColorProvider();
        const accessors = statusAccessors(statusColors);

        // Thickness accessor should be used to specify which status corresponds to a thin bar or thick
        accessors.data.thickness = (data: any) =>
            data.status === Status.Up ? BarRenderer.THIN : BarRenderer.THICK;

        // Configure the marker accessor to provide the symbols displayed at the center of each status bar
        // depending on the value of the datapoint.
        const iconSize: number = 10;
        const icons = new MappedValueProvider(
            getResizedIconsValueMap(this.iconService, iconSize)
        );
        accessors.data.marker = (data: any) => icons.get(data.status);

        // Create the bar renderer. The 'x' BarHighlightStrategy indicates that bars will be highlighted
        // as the mouse moves along the x-axis. This makes sense for the status chart since it's
        // horizontally oriented and all bars are aligned at the same y coordinate.
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        // Create the scales making sure that the scale for the y-axis is a band scale
        const bandScale = new BandScale();
        const timeScale = new TimeScale();
        const scales: IXYScales = {
            x: timeScale,
            y: bandScale,
        };

        // This formats label in interaction label plugin
        timeScale.formatters.labelFormatter = (d: any) =>
            moment(d).format("LL");

        // Fix the band scale domain to a single value, in this case STATUS_DOMAIN
        bandScale.fixDomain(StatusAccessors.STATUS_DOMAIN);

        // Assemble the series set
        const seriesSet = getData().map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // Update the chart
        this.chart.update(seriesSet);

        // Sample events that can be used in order to handle click or highlighting of certain status
        this.chart
            .getEventBus()
            .getStream(HIGHLIGHT_DATA_POINT_EVENT)
            .subscribe(console.log);
        this.chart
            .getEventBus()
            .getStream(SELECT_DATA_POINT_EVENT)
            .subscribe(console.log);
    }
}

function createTooltipMarkerProvider(
    iconService: IconService
): IValueProvider<SvgMarker> {
    const getStatusMarker = (status: string) =>
        new SvgMarker(iconService.getStatusIcon(status));

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
        [Status.Unknown]: CHART_PALETTE_CS_S_EXTENDED[6],
        [Status.Up]: CHART_PALETTE_CS_S_EXTENDED[8],
        [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
        [Status.Down]: CHART_PALETTE_CS_S_EXTENDED[0],
        [Status.Critical]: CHART_PALETTE_CS_S_EXTENDED[2],
    });
}

function getResizedIconsValueMap(iconService: IconService, iconSize: number) {
    return {
        [Status.Unknown]: iconService.getIconResized(
            iconService.getStatusIcon(Status.Unknown),
            iconSize
        ),
        [Status.Up]: iconService.getIconResized(
            iconService.getStatusIcon(Status.Up),
            iconSize
        ),
        [Status.Warning]: iconService.getIconResized(
            iconService.getStatusIcon(Status.Warning),
            iconSize
        ),
        [Status.Down]: iconService.getIconResized(
            iconService.getStatusIcon(Status.Down),
            iconSize
        ),
        [Status.Critical]: iconService.getIconResized(
            iconService.getStatusIcon(Status.Critical),
            iconSize
        ),
    };
}

/* Chart data */
function getData() {
    return [
        {
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
            ].map((d) => ({
                value: d.end - d.start,
                status: d.status,
                start: getDate(d.start),
                end: getDate(d.end),
            })),
        },
    ];
}

function getDate(hours: number) {
    return moment().add({ hours }).toDate();
}
