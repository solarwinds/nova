import { Component, OnInit } from "@angular/core";

import {
    Chart,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-base-grid-height-and-width-example",
    templateUrl: "./base-grid-height-and-width.example.component.html",
})
export class BaseGridHeightAndWidthExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit() {
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.height(50);
        gridConfig.dimension.width(100);

        this.chart = new Chart(new XYGrid(gridConfig));
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                scales: {
                    x: new LinearScale(),
                    y: new LinearScale(),
                },
                accessors: new LineAccessors(),
                renderer: new LineRenderer(),
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
                { x: 1, y: 10 },
                { x: 2, y: 30 },
                { x: 3, y: 5 },
                { x: 4, y: 20 },
                { x: 5, y: 15 },
            ],
        },
    ];
}
