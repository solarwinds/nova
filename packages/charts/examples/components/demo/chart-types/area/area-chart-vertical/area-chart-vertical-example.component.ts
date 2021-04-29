import { Component, OnInit } from "@angular/core";
import {
    AreaAccessors,
    AreaRenderer,
    Chart,
    IAreaAccessors,
    IChartSeries,
    IXYScales,
    LinearScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "area-chart-vertical-example",
    templateUrl: "./area-chart-vertical-example.component.html",
    styleUrls: ["./area-chart-vertical-example.component.less"],
})
export class AreaChartVerticalExampleComponent implements OnInit {
    public chart: Chart;

    public ngOnInit() {
        const gridConfig = new XYGridConfig();
        // Disable interaction because we don't support a horizontal interaction line yet
        gridConfig.interactionPlugins = false;
        gridConfig.axis.left.gridTicks = false;
        gridConfig.axis.left.tickSize = 0;
        gridConfig.axis.bottom.gridTicks = true;
        gridConfig.axis.left.fit = true;
        gridConfig.axis.bottom.fit = true;
        gridConfig.axis.bottom.tickSize = 0;
        gridConfig.axis.left.tickSize = 5;
        gridConfig.dimension.padding.left = 2; // 2 for border
        gridConfig.borders.left.visible = true;
        gridConfig.borders.bottom.visible = false;

        this.chart = new Chart(new XYGrid(gridConfig));

        // Area accessors let the renderer know how to access x and y domain data respectively from a chart's input data set(s).
        const accessors = new AreaAccessors();
        accessors.data.y = (d, i) => i;
        accessors.data.x0 = () => 0;
        accessors.data.x1 = (d) => d.value;

        // The area renderer will make the chart look like an area chart.
        const renderer = new AreaRenderer();

        // In case of a area chart, the scale definitions are flexible.
        // This example demonstrates a scenario with time on the X scale and a numeric value on the Y scale.
        const scales: IXYScales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        scales.x.fixDomain([0, 100]);

        // Here we assemble the complete chart series.
        const seriesSet: IChartSeries<IAreaAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // Finally, pass the series set to the chart's update method
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
                { value: 12 },
                { value: 65 },
                { value: 30 },
                { value: 40 },
                { value: 90 },
                { value: 23 },
                { value: 12 },
            ],
        },
    ];
}
