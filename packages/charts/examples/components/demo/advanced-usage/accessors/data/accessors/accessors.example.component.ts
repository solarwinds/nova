import { Component, OnInit } from "@angular/core";
import { Chart, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, XYGrid } from "@nova-ui/charts";

interface IMyDataPoint {
    x: number;
    y: number;
    z: number;
}

@Component({
    selector: "nui-accessors-example",
    templateUrl: "./accessors.example.component.html",
})
export class RendererAccessorsExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public seriesSet: IChartSeries<ILineAccessors>[];

    public ngOnInit() {
        const renderer = new LineRenderer();
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        const data: IMyDataPoint[] = [
            { x: 1, y: 10, z: 0 },
            { x: 2, y: 30, z: 1 },
            { x: 3, y: 5, z: 2 },
            { x: 4, y: 20, z: 3 },
            { x: 5, y: 15, z: 4 },
        ];

        const customAccessors = new LineAccessors();
        // Customizing data accessors
        customAccessors.data = {
            x: (datum: IMyDataPoint) => datum.z,
            y: (datum: IMyDataPoint) => datum.y * 2,
        };

        this.seriesSet = [
            {
                id: "series-1",
                name: "Series 1",
                data,
                scales,
                renderer,
                accessors: new LineAccessors(), // using default LineAccessors
            },
            {
                id: "series-2",
                name: "Series 2",
                data,
                scales,
                renderer,
                accessors: customAccessors, // using customized LineAccessors
            },
        ];

        this.chart.update(this.seriesSet);
    }
}
