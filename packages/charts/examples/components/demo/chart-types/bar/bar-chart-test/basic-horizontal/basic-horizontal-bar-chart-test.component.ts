import { AfterViewInit, Component } from "@angular/core";
import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    Chart,
    IBarAccessors,
    IBarChartConfig,
    IChartSeries,
    XYGridConfig,
} from "@nova-ui/charts";

@Component({
    selector: "nui-basic-horizontal-bar-chart-test",
    templateUrl: "./basic-horizontal-bar-chart-test.component.html",
})
export class BasicHorizontalBarChartTestComponent implements AfterViewInit {
    public config: IBarChartConfig = { horizontal: true };
    public chart = new Chart(barGrid(this.config));

    constructor() {
        const gridConfig = this.chart.getGrid().config() as XYGridConfig;
        gridConfig.axis.left.fit = false;
        gridConfig.dimension.margin.left = 150;
    }

    public ngAfterViewInit() {
        const accessors = barAccessors(this.config);
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("y"),
        });

        const scales = barScales(this.config);

        const seriesSet: IChartSeries<IBarAccessors>[] = getData().map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        this.chart.update(seriesSet);
    }
}

function getData() {
    return [
        { id: "series-1", name: "Long Name Test Long Name Test", data: [20] },
        { id: "series-2", name: "Results", data: [80] },
    ];
}
