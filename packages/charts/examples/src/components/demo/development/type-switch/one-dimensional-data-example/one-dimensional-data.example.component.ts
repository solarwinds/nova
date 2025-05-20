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
    BandScale,
    barGrid,
    BarRenderer,
    Chart,
    ChartAssist,
    ChartDonutContentPlugin,
    CHART_PALETTE_CS_S_EXTENDED,
    getAutomaticDomainWithIncludedInterval,
    HorizontalBarAccessors,
    IAccessors,
    IScale,
    LinearScale,
    MappedValueProvider,
    PieRenderer,
    radial,
    RadialAccessors,
    radialGrid,
    RadialRenderer,
    radialScales,
    Renderer,
    Scales,
    VerticalBarAccessors,
} from "@nova-ui/charts";

@Component({
    selector: "nui-chart-one-dimensional-data-example",
    templateUrl: "./one-dimensional-data.example.component.html",
})
export class OneDimensionalDataExampleComponent implements OnInit {
    public chartTypes = ["horizontal bar", "vertical bar", "pie", "donut"];
    public chartType = this.chartTypes[0];
    public categories = [
        "down",
        "critical",
        "warning",
        "unknown",
        "ok",
        "other",
    ];
    public iconNames = [
        "down",
        "critical",
        "warning",
        "unknown",
        "up",
        "unmanaged",
    ];
    public values = [24, 16, 7, 6, 97, 4];
    public iconMap = zipObject(
        this.categories,
        this.iconNames.map((n) => `status_${n}`)
    );
    private colorProvider = new MappedValueProvider<string>(
        zipObject(
            this.categories,
            CHART_PALETTE_CS_S_EXTENDED.filter((_, index) => index % 2 === 0)
        )
    );

    public chartAssist: ChartAssist;
    public donutContentPlugin?: ChartDonutContentPlugin;

    public ngOnInit(): void {
        this.updateChartType();
    }

    public updateChartType(): void {
        this.buildChart();
        this.chartAssist.chart.updateDimensions();

        this.updateChart();
    }

    private buildChart() {
        this.donutContentPlugin = undefined;

        switch (this.chartType) {
            case "horizontal bar": {
                this.chartAssist = new ChartAssist(
                    new Chart(barGrid({ horizontal: true }))
                );
                break;
            }
            case "vertical bar": {
                this.chartAssist = new ChartAssist(
                    new Chart(barGrid({ horizontal: false }))
                );
                break;
            }
            case "pie": {
                this.chartAssist = new ChartAssist(
                    new Chart(radialGrid()),
                    radial
                );
                break;
            }
            case "donut": {
                this.donutContentPlugin = new ChartDonutContentPlugin();
                this.chartAssist = new ChartAssist(
                    new Chart(radialGrid()),
                    radial
                );
                this.chartAssist.chart.addPlugin(this.donutContentPlugin);
                break;
            }
        }
    }

    private getRenderer():
        | PieRenderer
        | BarRenderer
        | RadialRenderer
        | undefined {
        switch (this.chartType) {
            case "horizontal bar":
            case "vertical bar": {
                return new BarRenderer();
            }
            case "pie": {
                return new PieRenderer();
            }
            case "donut": {
                return new RadialRenderer();
            }
        }
    }

    private updateChart() {
        const accessors: IAccessors<any> | undefined = this.getAccessors();
        const renderer: PieRenderer | BarRenderer | RadialRenderer | undefined =
            this.getRenderer();
        const scales: Record<string, IScale<any>> | undefined =
            this.getScales();
        if (!accessors || !renderer || !scales) {
            throw new Error("Accessors, renderer or scales are unavailable");
        }
        this.chartAssist.update(
            this.getChartAssistSeries(
                this.categories,
                this.values,
                accessors,
                renderer,
                scales
            )
        );
    }

    private getScales(): Record<string, IScale<any>> | undefined {
        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        linearScale.domainCalculator = getAutomaticDomainWithIncludedInterval([
            0, 0,
        ]);

        switch (this.chartType) {
            case "horizontal bar":
                return {
                    x: linearScale,
                    y: bandScale,
                };
            case "vertical bar":
                return {
                    x: bandScale,
                    y: linearScale,
                };
            case "pie":
            case "donut": {
                return radialScales();
            }
        }
    }

    private getAccessors(): IAccessors | undefined {
        switch (this.chartType) {
            case "horizontal bar":
                return new HorizontalBarAccessors(this.colorProvider);
            case "vertical bar": {
                return new VerticalBarAccessors(this.colorProvider);
            }
            case "pie":
            case "donut": {
                const accessors = new RadialAccessors();
                accessors.series.color = this.colorProvider.get;
                return accessors;
            }
        }
        return;
    }

    private getChartAssistSeries(
        categories: string[],
        values: number[],
        accessors: IAccessors,
        renderer: Renderer<IAccessors>,
        scales: Scales
    ) {
        return categories.map((category, i) => {
            const value = values[i] || 0;
            return {
                id: category,
                data: [{ category, value }],
                accessors,
                renderer,
                scales,
            };
        });
    }
}
