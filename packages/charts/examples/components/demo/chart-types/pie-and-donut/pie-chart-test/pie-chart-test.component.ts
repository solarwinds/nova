import { Component, OnInit } from "@angular/core";
import { Chart, ChartAssist, PieRenderer, radial, RadialAccessors, radialGrid, radialScales } from "@nova-ui/charts";

@Component({
    selector: "nui-pie-chart-test",
    templateUrl: "./pie-chart-test.component.html",
})
export class PieChartTestComponent implements OnInit {

    public chartAssist = new ChartAssist(new Chart(radialGrid()), radial);

    ngOnInit() {
        const accessors = new RadialAccessors();
        const scales = radialScales();
        const renderer = new PieRenderer();

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
        { id: "chrome", name: "Chrome", data: [60] },
        { id: "edge", name: "Edge", data: [30] },
        { id: "ff", name: "FF", data: [15] },
        { id: "safari", name: "Safari", data: [5] },
    ];
}
