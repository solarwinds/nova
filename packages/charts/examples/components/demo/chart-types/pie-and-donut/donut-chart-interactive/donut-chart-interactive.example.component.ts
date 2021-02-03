import { Component, OnInit } from "@angular/core";
import {
    Chart, ChartAssist, CHART_PALETTE_CS_S, MappedValueProvider, radial, RadialAccessors, radialGrid, RadialRenderer, radialScales
} from "@nova-ui/charts";
import zipObject from "lodash/zipObject";

enum Status {
    Up = "up",
    Warning = "warning",
    Critical = "critical",
    Down = "down",
    Unmanaged = "unmanaged",
    Unknown = "unknown",
}

@Component({
    selector: "nui-donut-chart-interactive-example",
    templateUrl: "./donut-chart-interactive.example.component.html",
})
export class DonutChartInteractiveExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    public ngOnInit() {
        // Instantiate the chart and chart assist
        this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

        // If custom colors are needed, instantiate a custom color provider in the form of a MappedValueProvider.
        // This is only needed if your chart requires colors that deviate from the ones provided by the default
        // color provider.
        const statusColorProvider = new MappedValueProvider<string>(zipObject(
            [Status.Down, Status.Critical, Status.Warning, Status.Unknown, Status.Up, Status.Unmanaged],
            CHART_PALETTE_CS_S
        ));

        // Instantiate the RadialAccessors and set the series color accessor to the new
        // color provider's get method
        const accessors = new RadialAccessors();
        accessors.series.color = statusColorProvider.get;

        // Create radial scales and a renderer to be included in the IChartAssistSeries collection
        const scales = radialScales();
        const renderer = new RadialRenderer();

        // Invoke the chart assist's update method with the IChartAssistSeries collection as the argument
        this.chartAssist.update(getData().map(s => ({
            ...s,
            accessors,
            scales,
            renderer,
        })));
    }
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
    ].map(d => ({ id: d.status, name: d.status, data: [d.value] }));
}
