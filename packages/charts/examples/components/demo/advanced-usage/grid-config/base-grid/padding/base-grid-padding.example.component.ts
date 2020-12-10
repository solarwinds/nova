import { Component, OnInit } from "@angular/core";
import { Chart, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, XYGrid, XYGridConfig } from "@nova-ui/charts";

@Component({
    selector: "nui-base-grid-padding-example",
    templateUrl: "./base-grid-padding.example.component.html",
})
export class BaseGridPaddingExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit() {
        const gridConfig = new XYGridConfig();
        gridConfig.dimension.padding = {
            top: 25,
            right: 50,
            bottom: 25,
            left: 50,
        };

        this.chart = new Chart(new XYGrid(gridConfig));
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors: new LineAccessors(),
            renderer: new LineRenderer(),
            scales: {
                x: new LinearScale(),
                y: new LinearScale(),
            },
        }));

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [{
        id: "series-1",
        name: "Series 1",
        data: [
            { x: 1, y: 10 },
            { x: 2, y: 30 },
            { x: 3, y: 5 },
            { x: 4, y: 20 },
            { x: 5, y: 15 },
        ],
    }];
}
