import { Component, OnInit } from "@angular/core";
import {
    Chart,
    ChartAssist,
    PieRenderer,
    radial,
    RadialAccessors,
    radialGrid,
    radialScales,
} from "@nova-ui/charts";

@Component({
    selector: "nui-pie-chart-example",
    templateUrl: "./pie-chart.example.component.html",
})
export class PieChartExampleComponent implements OnInit {
    public chartAssist: ChartAssist;

    ngOnInit() {
        // Create a Chart instance using the result of the radialGrid configuration function as the constructor argument
        const chart = new Chart(radialGrid());

        // Create a ChartAssist instance passing the chart and the radial series processor as constructor arguments
        this.chartAssist = new ChartAssist(chart, radial);

        // Instantiate radial accessors and scales to be included in the IChartAssistSeries collection
        const accessors = new RadialAccessors();
        const scales = radialScales();

        // Instantiate a PieRenderer to be included in the IChartAssistSeries collection
        const renderer = new PieRenderer();

        // Invoke the chart assist's update method with the IChartAssistSeries collection as the argument
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

/* Chart data */
function getData() {
    return [
        { id: "chrome", name: "Chrome", data: [80] },
        { id: "edge", name: "Edge", data: [20] },
    ];
}
