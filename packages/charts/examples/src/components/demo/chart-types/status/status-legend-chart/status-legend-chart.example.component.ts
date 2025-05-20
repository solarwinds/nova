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
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IconService } from "@nova-ui/bits";
import {
    BandScale,
    BarHighlightStrategy,
    BarRenderer,
    BarStatusGridConfig,
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS_S_EXTENDED,
    IXYScales,
    MappedValueProvider,
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

const OPACITY_BACKGROUND_EMPHASIZED = 0.4;

@Component({
    selector: "nui-status-legend-chart-example",
    templateUrl: "./status-legend-chart.example.component.html",
    styleUrls: ["./status-legend-chart.example.component.less"],
})
export class StatusLegendChartExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    public legendLabel$: Observable<any>;
    public legendIcon$: Observable<any>;
    public legendBackground$: Observable<any>;

    constructor(private iconService: IconService) {}

    public ngOnInit(): void {
        const chart = new Chart(new XYGrid(new BarStatusGridConfig()));
        this.chartAssist = new ChartAssist(chart);

        const statusColors = createColorProvider();
        const accessors = statusAccessors(statusColors);
        // Thickness accessor should be used to specify which status corresponds to a thin bar or thick
        accessors.data.thickness = (data: any) =>
            data.status === Status.Up ? BarRenderer.THIN : BarRenderer.THICK;

        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });

        const scales: IXYScales = {
            x: new TimeScale(),
            y: new BandScale().fixDomain(StatusAccessors.STATUS_DOMAIN),
        };

        const seriesSet = getData().map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chartAssist.chart.update(seriesSet);

        const statusMarkers = createMarkerProvider(this.iconService);
        const palette = new ChartPalette(statusColors, {
            backgroundOpacity: OPACITY_BACKGROUND_EMPHASIZED,
        });
        // legendLabelData$ is a stream of data that can be used to display data in legend
        // (last value while user does not interact with chart and current value while interacting).
        // This can help to generate stream of labels/icons/backgrounds:
        this.legendLabel$ = this.chartAssist
            .legendLabelData$(seriesSet[0])
            .pipe(map((d) => d.status));
        this.legendIcon$ = this.legendLabel$.pipe(map(statusMarkers.get));
        this.legendBackground$ = this.legendLabel$.pipe(
            map(palette.backgroundColors.get)
        );
    }
}

function createColorProvider() {
    return new MappedValueProvider<string>({
        [Status.Unknown]: CHART_PALETTE_CS_S_EXTENDED[6],
        [Status.Up]: CHART_PALETTE_CS_S_EXTENDED[8],
        [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
        [Status.Down]: CHART_PALETTE_CS_S_EXTENDED[0],
        [Status.Critical]: CHART_PALETTE_CS_S_EXTENDED[2],
    });
}

function createMarkerProvider(iconService: IconService) {
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

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                {
                    status: Status.Up,
                    start: new Date(2012, 5, 3),
                    end: new Date(2012, 5, 6),
                },
                {
                    status: Status.Down,
                    start: new Date(2012, 5, 6),
                    end: new Date(2012, 5, 17),
                },
                {
                    status: Status.Warning,
                    start: new Date(2012, 5, 17),
                    end: new Date(2012, 5, 18),
                },
            ].map((d) => ({
                value: d.end,
                status: d.status,
                start: d.start,
                end: d.end,
            })),
        },
    ];
}
