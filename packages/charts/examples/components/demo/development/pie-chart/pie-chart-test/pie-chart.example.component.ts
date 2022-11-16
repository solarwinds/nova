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

import { Component, Inject, OnInit } from "@angular/core";

import { IToastService, ToastService } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    GridConfig,
    IAccessors,
    IChartAssistSeries,
    IChartEvent,
    IChartSeries,
    IRadialAccessors,
    LinearScale,
    PieRenderer,
    RadialGrid,
    radialPreprocessor,
    RadialRenderer,
    Scales,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";

/**
 * @ignore
 */
@Component({
    selector: "nui-pie-chart-example",
    templateUrl: "./pie-chart.example.component.html",
})
export class PieChartTestComponent implements OnInit {
    public compact = false;
    public chart = new Chart(new RadialGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);
    public contentPlugin: ChartDonutContentPlugin;

    public renderer: RadialRenderer;
    private scales: Scales;
    private interactive: boolean = false;

    constructor(@Inject(ToastService) private toastr: IToastService) {}

    public ngOnInit(): void {
        const gridConfig = new GridConfig();
        gridConfig.interactive = false;
        this.chart.getGrid().config(gridConfig);
        this.scales = {
            r: new LinearScale(), // radius can be linear or band (for donuts) scale. No need in radial scale
        };
        this.scales.r.fixDomain([0, 1]);

        this.chartAssist = new ChartAssist(this.chart, this.processSeries);
        this.contentPlugin = new ChartDonutContentPlugin();
        this.chart.addPlugin(this.contentPlugin);
        this.refreshPie();

        this.chart
            .getEventBus()
            .getStream("click")
            .subscribe((event: IChartEvent) => {
                this.toastr.info({
                    title: "Event Published",
                    message: `event: click; data: ${event.data}`,
                    options: {
                        timeOut: 1500,
                    },
                });
            });
    }

    private processSeries = (
        chartSeriesSet: IChartAssistSeries<IRadialAccessors>[]
    ) =>
        radialPreprocessor(
            chartSeriesSet,
            (series: IChartSeries<IAccessors>) =>
                !this.chartAssist.isSeriesHidden(series.id)
        );

    private generateSeriesSet(layers = 1): IChartAssistSeries<IAccessors>[] {
        const donutSeriesSet = DataGenerator.generateMockOrdinalSeriesSet(
            ["Chrome", "Firefox", "Edge"],
            layers
        );
        donutSeriesSet.forEach((s) => {
            s.id += `-${Math.round(Math.random() * 100)}`;
        });

        return donutSeriesSet.map((dataSeries) => ({
            ...dataSeries,
            accessors: {
                data: {
                    value: (d: any) => d.value,
                },
                series: {
                    color: this.chartAssist.palette.standardColors.get,
                },
            },
            scales: this.scales,
            renderer: this.renderer,
            showInLegend: true,
        }));
    }

    public refreshPie(): void {
        this.renderer = new PieRenderer();
        this.chartAssist.update(this.generateSeriesSet());
    }

    public updateWidth(value: number): void {
        this.renderer.config.annularGrowth = value / 100;
        this.updateDonut();
    }

    public updatemaxWidth(value: number): void {
        this.renderer.config.maxThickness = value;
        this.updateDonut();
    }

    public refreshPieInteraction(): void {
        this.interactive = !this.interactive;
        if (this.interactive) {
            this.renderer.interaction = {
                arc: {
                    mouseover: "",
                    mouseout: "",
                    click: "",
                },
            };
        } else {
            // @ts-ignore: Preventing breaking flow
            this.renderer.interaction = undefined;
        }
        this.chartAssist.update(this.generateSeriesSet());
    }

    public refreshDonut(layers: number): void {
        this.renderer = new RadialRenderer();
        // Hack for demo page, since it loads pie first and we can switch between chart renderers
        this.chartAssist.update(this.generateSeriesSet(layers));
        setTimeout(() => {
            this.chart.updateDimensions();
        }, 0);
    }

    public showContent(): boolean {
        return !(this.renderer instanceof PieRenderer);
    }

    private updateDonut() {
        setTimeout(() => {
            this.chart.updateDimensions();
        }, 0);
    }
}
