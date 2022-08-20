import { Component, OnInit } from "@angular/core";
import {
    Chart,
    CHART_MARKERS,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-markers-custom-accessor-example",
    templateUrl: "./markers-custom-accessor.example.component.html",
})
export class RendererMarkersCustomAccessorExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public ngOnInit() {
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        const renderer = new LineRenderer();
        const accessors = new LineAccessors();
        // Custom marker accessor
        accessors.series.marker = () => CHART_MARKERS[2];

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                scales,
                renderer,
                accessors,
            })
        );

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
