// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component, OnInit } from "@angular/core";
import zipObject from "lodash/zipObject";

import {
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS_S_EXTENDED,
    IChartAssistSeries,
    ILineAccessors,
    INTERACTION_SERIES_EVENT,
    LineAccessors,
    LinearScale,
    LineRenderer,
    LineSelectSeriesInteractionStrategy,
    MappedValueProvider,
    PointScale,
    Scales,
    XYGrid,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";
import { isEvenIndex } from "../../../../utility/isEvenIndex";

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

    public statusPalette = new ChartPalette(
        new MappedValueProvider<string>(
            zipObject(statuses, CHART_PALETTE_CS_S_EXTENDED.filter(isEvenIndex))
        )
    );

    public ngOnInit(): void {
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
        this.statusScales.x.formatters.tick = (value: any) =>
            Math.round(value).toString();

        this.statusChart
            .getEventBus()
            .getStream(INTERACTION_SERIES_EVENT)
            .subscribe(console.log);

        this.update();
    }

    public update(): void {
        this.statusChartAssist.update(
            this.generateStatusSeriesSet(Math.floor(Math.random() * 5 + 1))
        );
    }

    public isStatusSignificant(highlightedValue: string): boolean {
        return highlightedValue !== "unknown" && highlightedValue !== "up";
    }

    private generateStatusSeriesSet(
        dataSeriesCount: number
    ): IChartAssistSeries<ILineAccessors>[] {
        const statusSeriesSet = DataGenerator.generateMockStatusSeriesSet(
            dataSeriesCount,
            20,
            statuses
        );
        const accessors = new LineAccessors(
            this.statusChartAssist.palette.standardColors
        );

        return statusSeriesSet.map((dataSeries) => ({
            ...dataSeries,
            scales: this.statusScales,
            renderer: this.statusLineRenderer,
            accessors,
            showInLegend: true,
        }));
    }
}
