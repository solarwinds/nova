import { Component, OnInit } from "@angular/core";
import { Chart, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, XYGrid } from "@solarwinds/nova-charts";

@Component({
    selector: "nui-line-chart-example",
    templateUrl: "./line-chart.example.component.html",
})
export class LineChartExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public seriesSet: IChartSeries<ILineAccessors>[];

    public ngOnInit() {
        this.seriesSet = [{
            id: "series-1",
            name: "Series 1",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 30 },
                { x: 3, y: 5 },
                { x: 4, y: 20 },
                { x: 5, y: 15 },
            ],
            scales: {
                x: new LinearScale(),
                y: new LinearScale(),
            },
            renderer: new LineRenderer(),
            accessors: new LineAccessors(),
        }];

        this.chart.update(this.seriesSet);
    }
}
