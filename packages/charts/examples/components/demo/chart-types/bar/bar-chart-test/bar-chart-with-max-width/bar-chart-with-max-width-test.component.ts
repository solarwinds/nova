import { Component, OnInit } from "@angular/core";
import {
    barAccessors, barGrid, BarHighlightStrategy, BarRenderer, barScales,
    Chart, ChartAssist, IBarAccessors, IBarChartConfig, IChart, IChartSeries, XYGridConfig
} from "@nova-ui/charts";

@Component({
    selector: "nui-bar-chart-with-max-width-test",
    templateUrl: "./bar-chart-with-max-width-test.component.html",
})
export class BarChartWithMaxWidthTestComponent implements OnInit{
    public chart: IChart;
    public chartAssist: ChartAssist;
    public ngOnInit() {
        const config: IBarChartConfig = { horizontal: true };
        const accessors = barAccessors(config);
        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("y") });
        const scales = barScales(config);
        
        this.chart = new Chart(barGrid(config));
        this.chartAssist = new ChartAssist(this.chart);

        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.left.tickLabel.maxWidth = 70;
        gridConfig.axis.left.fit = false;
        gridConfig.dimension.margin.left = 100;

        const seriesSet: IChartSeries<IBarAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chartAssist.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Long Name Test Long Name Test",
            data: [20],
        },
        {
            id: "series-2",
            name: "Results",
            data: [80],
        },
        {
            id: "series-3",
            name: "Supercalifragilisticexpialidocious",
            data: [45],
        },
    ];
}
