import { Component, OnInit, ViewChild } from "@angular/core";
import {
    Chart,
    ChartComponent,
    IChartSeries,
    ILineAccessors,
    LineAccessors,
    LinearScale,
    LineRenderer,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-base-grid-auto-margins-example",
    templateUrl: "./base-grid-auto-margins.example.component.html",
})
export class BaseGridAutoMarginsExampleComponent implements OnInit {
    public chart: Chart;

    @ViewChild(ChartComponent) chartComponent: ChartComponent;

    public ngOnInit() {
        const gridConfig = new XYGridConfig();
        gridConfig.axis.bottom.fit = false;
        gridConfig.axis.left.fit = false;

        this.chart = new Chart(new XYGrid(gridConfig));
        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(
            (d) => ({
                ...d,
                accessors: new LineAccessors(),
                renderer: new LineRenderer(),
                scales: {
                    x: new LinearScale(),
                    y: new LinearScale(),
                },
            })
        );

        this.chart.update(seriesSet);
    }

    public toggleFit() {
        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.bottom.fit = !gridConfig.axis.bottom.fit;
        gridConfig.axis.left.fit = !gridConfig.axis.left.fit;
        if (!gridConfig.axis.bottom.fit) {
            gridConfig.dimension.margin = Object.assign(
                {},
                XYGridConfig.DEFAULT_MARGIN
            );
        }
        this.chart.updateDimensions();
        this.chartComponent.redraw();
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: 100, y: 10000 },
                { x: 200, y: 30000 },
                { x: 300, y: 5000 },
                { x: 400, y: 20000 },
                { x: 500, y: 15000 },
            ],
        },
    ];
}
