import { Component, OnInit } from "@angular/core";
import {
    CHART_MARKERS, CHART_PALETTE_CS1, ChartPalette, IChartPalette, ILineAccessors, ISpark, LineAccessors, LinearScale, LineRenderer,
    SequentialChartMarkerProvider, SparkChartAssist
} from "@solarwinds/nova-charts";

import { DataGenerator } from "../../../../../data-generator";

/**
 * This is here just to test a prototype of an angular component that will use Nova Charts
 */
@Component({
    selector: "nui-spark-prototype",
    templateUrl: "./spark-prototype.component.html",
    styleUrls: ["./spark-prototype.component.less"],
})
export class SparkPrototypeComponent implements OnInit {
    public chartAssist: SparkChartAssist;
    public colorPalette: IChartPalette = new ChartPalette(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);

    private sparkLineRenderer: LineRenderer;
    private sparkXScale = new LinearScale();

    public ngOnInit() {
        this.sparkLineRenderer = new LineRenderer();

        this.sparkXScale.formatters.tick = (value: any) => Math.round(value).toString();
        this.chartAssist = new SparkChartAssist();

        this.update();
    }

    public update() {
        this.chartAssist.updateSparks(this.generateSparkSeriesSet(Math.floor(Math.random() * 6 + 1)));
    }

    private generateSparkSeriesSet(numSparks: number): ISpark<ILineAccessors>[] {
        const sparks: ISpark<ILineAccessors>[] = [];
        const accessors = new LineAccessors(this.colorPalette.standardColors, this.markers);

        for (let i = 0; i < numSparks; ++i) {
            const sparkYScale = new LinearScale();
            sparkYScale.formatters.value = v => (Number(v).toPrecision(4));
            const sparkScales = {
                x: this.sparkXScale,
                y: sparkYScale,
            };

            sparks.push({
                id: `${i}`,
                chartSeriesSet: [
                    {
                        id: `spark-series-${i + 1}`,
                        name: `Spark Series ${i + 1}`,
                        accessors,
                        data: DataGenerator.mockLineData(10),
                        scales: sparkScales,
                        renderer: this.sparkLineRenderer,
                    },
                    {
                        id: `spark-series-${i + 1}-b`,
                        name: `Spark Series ${i + 1}-b`,
                        accessors,
                        data: DataGenerator.mockLineData(10),
                        scales: sparkScales,
                        renderer: this.sparkLineRenderer,
                    },
                ],
            });
        }

        return sparks;
    }

}
