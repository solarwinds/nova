import { Component, OnInit } from "@angular/core";

import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    radial,
    RadialAccessors,
    radialGrid,
    RadialRenderer,
    radialScales,
} from "@nova-ui/charts";

interface IExampleSeries {
    id: string;
    name: string;
    data: number[];
}

@Component({
    selector: "nui-donut-chart-with-content-example",
    templateUrl: "./donut-chart-with-content.example.component.html",
})
export class DonutChartWithContentExampleComponent implements OnInit {
    public chartAssist1: ChartAssist;
    public chartAssist2: ChartAssist;
    public contentPlugin: ChartDonutContentPlugin;
    public series: any[];

    ngOnInit() {
        // Instantiate the charts and chart assists
        this.chartAssist1 = new ChartAssist(new Chart(radialGrid()), radial);
        this.chartAssist2 = new ChartAssist(new Chart(radialGrid()), radial);

        // Create the donut content plugin
        this.contentPlugin = new ChartDonutContentPlugin();

        // Register the content plugin with the chart. In addition to registering the plugin with the chart,
        // pass it to the plugin input of the nui-chart-donut-content component in the template.
        this.chartAssist2.chart.addPlugin(this.contentPlugin);

        // Create radial accessors, scales, and a renderer to be included in the IChartAssistSeries collection
        const accessors = new RadialAccessors();
        const scales1 = radialScales();
        const scales2 = radialScales();
        const renderer = new RadialRenderer();

        this.series = getData();
        // Invoke the chart assist's update method with the IChartAssistSeries collection as the argument
        this.chartAssist1.update(
            this.series.map((s) => ({
                ...s,
                accessors,
                scales: scales1,
                renderer,
            }))
        );

        this.chartAssist2.update(
            this.series.map((s) => ({
                ...s,
                accessors,
                scales: scales2,
                renderer,
            }))
        );
    }

    public value = (s: IExampleSeries) => s.data[0];
    public name = (s: IExampleSeries) => s.name;
}

/* Chart data */
function getData() {
    return [
        { id: "chrome", name: "Chrome", data: [80] },
        { id: "edge", name: "Edge", data: [20] },
    ];
}
