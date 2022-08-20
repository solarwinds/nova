import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    CHART_PALETTE_CS_S,
    MappedValueProvider,
    radial,
    RadialAccessors,
    radialGrid,
    RadialPopoverPlugin,
    RadialRenderer,
    radialScales,
} from "@nova-ui/charts";

@Component({
    selector: "nui-donut-chart-with-popover-example",
    templateUrl: "./donut-chart-with-popover.example.component.html",
})
export class DonutChartWithPopoverExampleComponent implements OnInit {
    public popoverPlugin: RadialPopoverPlugin;
    public chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

    public ngOnInit() {
        // plugin setup
        this.popoverPlugin = new RadialPopoverPlugin();
        this.chartAssist.chart.addPlugin(this.popoverPlugin);

        // accessors setup for colors
        const accessors = new RadialAccessors();
        const statusColorProvider = createStatusColorProvider();
        accessors.series.color = statusColorProvider.get;

        const renderer = new RadialRenderer();
        const scales = radialScales();

        // chart assist setup
        this.chartAssist.update(
            getData().map((s) => ({
                ...s,
                accessors,
                scales,
                renderer,
            }))
        );
    }
}

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
    Down = "down",
    Unmanaged = "unmanaged",
    Unknown = "unknown",
}

/* Chart data */
function getData() {
    return [
        { status: Status.Up, value: 42 },
        { status: Status.Warning, value: 14 },
        { status: Status.Critical, value: 8 },
        { status: Status.Down, value: 7 },
        { status: Status.Unmanaged, value: 5 },
        { status: Status.Unknown, value: 3 },
    ].map((d) => ({ id: d.status, name: d.status, data: [d.value] }));
}

function createStatusColorProvider() {
    return new MappedValueProvider<string>({
        [Status.Up]: CHART_PALETTE_CS_S[4],
        [Status.Warning]: CHART_PALETTE_CS_S[2],
        [Status.Critical]: CHART_PALETTE_CS_S[1],
        [Status.Down]: CHART_PALETTE_CS_S[0],
        [Status.Unmanaged]: CHART_PALETTE_CS_S[5],
        [Status.Unknown]: CHART_PALETTE_CS_S[3],
    });
}
