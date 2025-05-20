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

import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    Chart,
    ChartAssist,
    CHART_PALETTE_CS_S_EXTENDED,
    MappedValueProvider,
} from "@nova-ui/charts";

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
    Down = "down",
    Unmanaged = "unmanaged",
    Unknown = "unknown",
}

@Component({
    selector: "nui-vertical-with-legend-bar-chart-test",
    templateUrl: "./vertical-with-legend-bar-chart-test.component.html",
})
export class VerticalWithLegendBarChartTestComponent implements OnInit {
    public chartAssist = new ChartAssist(new Chart(barGrid()));

    public ngOnInit(): void {
        const statusColorProvider = createColorProvider();

        const accessors = barAccessors();
        accessors.series.color = (seriesId: string, dataSeries: any) =>
            statusColorProvider.get(dataSeries.name);

        const renderer = new BarRenderer({
            highlightStrategy: new BarSeriesHighlightStrategy("x"),
        });
        const scales = barScales();
        scales.x.formatters.tick = (value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1);

        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                renderer,
                scales,
            }))
        );
    }
}

function createColorProvider() {
    return new MappedValueProvider<string>({
        [Status.Up]: CHART_PALETTE_CS_S_EXTENDED[8],
        [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
        [Status.Critical]: CHART_PALETTE_CS_S_EXTENDED[2],
        [Status.Down]: CHART_PALETTE_CS_S_EXTENDED[0],
        [Status.Unmanaged]: CHART_PALETTE_CS_S_EXTENDED[10],
        [Status.Unknown]: CHART_PALETTE_CS_S_EXTENDED[6],
    });
}

/* Chart data */
function getData() {
    return [
        { id: Status.Up, name: Status.Up, data: [42] },
        { id: Status.Warning, name: Status.Warning, data: [14] },
        { id: Status.Critical, name: Status.Critical, data: [8] },
        { id: Status.Down, name: Status.Down, data: [7] },
        { id: Status.Unmanaged, name: Status.Unmanaged, data: [5] },
        { id: Status.Unknown, name: Status.Unknown, data: [3] },
    ];
}
