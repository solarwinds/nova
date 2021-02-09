import { Component, OnInit } from "@angular/core";
import {
    Chart, ChartAssist, ChartPalette, CHART_PALETTE_CS_S, IChartAssistSeries, ILineAccessors, INTERACTION_SERIES_EVENT, LineAccessors, LinearScale,
    LineRenderer, LineSelectSeriesInteractionStrategy, MappedValueProvider, PointScale, Scales, XYGrid
} from "@nova-ui/charts";
import zipObject from "lodash/zipObject";

import { DataGenerator } from "../../../../../data-generator";

/** @ignore */
const statuses = ["down", "critical", "warning", "unknown", "up"];

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-example",
    templateUrl: "./chart.example.component.html",
    styleUrls: ["./chart.example.component.less"],
})
export class ChartExampleComponent implements OnInit {
    public compact = true;
    public statusChart = new Chart(new XYGrid());
    public statusChartAssist: ChartAssist = new ChartAssist(this.statusChart);

    private statusLineRenderer: LineRenderer;
    private statusScales: Scales;

    public statusPalette = new ChartPalette(new MappedValueProvider<string>(zipObject(statuses, CHART_PALETTE_CS_S)));

    public ngOnInit() {
        // status chart setup
        this.statusLineRenderer = new LineRenderer({
            interactionStrategy: new LineSelectSeriesInteractionStrategy(),
        });

        const xScale = new LinearScale();

        this.statusScales = {
            x: xScale,
            y: new PointScale().padding(0.5),
        };

        this.statusScales.y.domain(statuses);
        this.statusScales.y.domainCalculator = undefined;
        this.statusScales.x.formatters.tick = (value: any) => Math.round(value).toString();

        this.statusChart.getEventBus().getStream(INTERACTION_SERIES_EVENT).subscribe(console.log);

        this.update();
    }

    public update() {
        this.statusChartAssist.update(this.generateStatusSeriesSet(Math.floor(Math.random() * 5 + 1)));
    }

    public isStatusSignificant(highlightedValue: string) {
        return highlightedValue !== "unknown" && highlightedValue !== "up";
    }

    private generateStatusSeriesSet(dataSeriesCount: number): IChartAssistSeries<ILineAccessors>[] {
        const statusSeriesSet = DataGenerator.generateMockStatusSeriesSet(dataSeriesCount, 20, statuses);
        const accessors = new LineAccessors(this.statusChartAssist.palette.standardColors);

        return statusSeriesSet.map(dataSeries => ({
            ...dataSeries,
            scales: this.statusScales,
            renderer: this.statusLineRenderer,
            accessors,
            showInLegend: true,
        }));
    }

}
