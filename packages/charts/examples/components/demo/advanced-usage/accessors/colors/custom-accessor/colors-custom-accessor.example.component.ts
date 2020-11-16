import { Component, OnInit } from "@angular/core";
import { Chart, CHART_PALETTE_CS2, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, XYGrid } from "@solarwinds/nova-charts";

@Component({
    selector: "nui-colors-custom-accessor-example",
    templateUrl: "./colors-custom-accessor.example.component.html",
})
export class RendererColorsCustomAccessorExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public ngOnInit() {
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };
        const renderer = new LineRenderer();
        const accessors: ILineAccessors = new LineAccessors();
        // Custom color accessor
        accessors.series.color = () => CHART_PALETTE_CS2[6];

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            scales,
            renderer,
            accessors,
        }));

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: 1, y: 30 },
                { x: 2, y: 50 },
                { x: 3, y: 25 },
                { x: 4, y: 40 },
                { x: 5, y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: 1, y: 20 },
                { x: 2, y: 40 },
                { x: 3, y: 15 },
                { x: 4, y: 30 },
                { x: 5, y: 25 },
            ],
        },
        {
            id: "series-3",
            name: "Series 3",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 30 },
                { x: 3, y: 5 },
                { x: 4, y: 20 },
                { x: 5, y: 15 },
            ],
        },
    ];
}
