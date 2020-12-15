import { Component, OnInit } from "@angular/core";
import {
    barAccessors,
    barGrid,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    Chart,
    CHART_PALETTE_CS_S,
    ChartAssist,
    MappedValueProvider
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

    public ngOnInit() {
        const statusColorProvider = createColorProvider();

        const accessors = barAccessors();
        accessors.series.color = (seriesId: string, dataSeries: any) => statusColorProvider.get(dataSeries.name);

        const renderer = new BarRenderer({ highlightStrategy: new BarSeriesHighlightStrategy("x") });
        const scales = barScales();
        scales.x.formatters.tick = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

        this.chartAssist.update(getData().map(s => ({
            ...s,
            accessors,
            renderer,
            scales,
        })));
    }
}

function createColorProvider() {
    return new MappedValueProvider<string>({
        [Status.Up]: CHART_PALETTE_CS_S[4],
        [Status.Warning]: CHART_PALETTE_CS_S[2],
        [Status.Critical]: CHART_PALETTE_CS_S[1],
        [Status.Down]: CHART_PALETTE_CS_S[0],
        [Status.Unmanaged]: CHART_PALETTE_CS_S[5],
        [Status.Unknown]: CHART_PALETTE_CS_S[3],
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
