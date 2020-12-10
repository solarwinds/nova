import { Component, OnInit } from "@angular/core";
import { Chart, ChartAssist, ChartDonutContentPlugin, radial, RadialAccessors, radialGrid, RadialRenderer, radialScales } from "@nova-ui/charts";

@Component({
    selector: "nui-donut-chart-test",
    templateUrl: "./donut-chart-test.component.html",
})
export class DonutChartTestComponent implements OnInit {

    public chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
    public contentPlugin: ChartDonutContentPlugin;

    ngOnInit() {
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chartAssist.chart.addPlugin(this.contentPlugin);

        const accessors = new RadialAccessors();
        const scales = radialScales();
        const renderer = new RadialRenderer();

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
        { id: "chrome", name: "Chrome", data: [70] },
        { id: "edge", name: "Edge", data: [20] },
        { id: "ff", name: "FF", data: [10] },
    ];
}
