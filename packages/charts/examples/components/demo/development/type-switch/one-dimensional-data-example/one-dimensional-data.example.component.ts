import { Component, OnInit } from "@angular/core";
import {
    BandScale, barGrid, BarRenderer, Chart, CHART_PALETTE_CS_S, ChartAssist, ChartDonutContentPlugin, getAutomaticDomainWithIncludedInterval,
    HorizontalBarAccessors, IAccessors, IScale, LinearScale, MappedValueProvider, PieRenderer, radial, RadialAccessors, radialGrid, RadialRenderer,
    radialScales, Renderer, Scales, VerticalBarAccessors,
} from "@solarwinds/nova-charts";
import zipObject from "lodash/zipObject";

@Component({
    selector: "nui-chart-one-dimensional-data-example",
    templateUrl: "./one-dimensional-data.example.component.html",
})
export class OneDimensionalDataExampleComponent implements OnInit {
    public chartTypes = ["horizontal bar", "vertical bar", "pie", "donut"];
    public chartType = this.chartTypes[0];
    public categories = ["down", "critical", "warning", "unknown", "ok", "other"];
    public iconNames = ["down", "critical", "warning", "unknown", "up", "unmanaged"];
    public values = [24, 16, 7, 6, 97, 4];
    public iconMap = zipObject(this.categories, this.iconNames.map(n => `status_${n}`));
    private colorProvider = new MappedValueProvider<string>(zipObject(this.categories, CHART_PALETTE_CS_S));

    public chartAssist: ChartAssist;
    public donutContentPlugin?: ChartDonutContentPlugin;

    public ngOnInit() {
        this.updateChartType();
    }

    public updateChartType() {
        this.buildChart();
        this.chartAssist.chart.updateDimensions();

        this.updateChart();
    }

    private buildChart() {
        this.donutContentPlugin = undefined;

        switch (this.chartType) {
            case "horizontal bar": {
                this.chartAssist = new ChartAssist(new Chart(barGrid({ horizontal: true })));
                break;
            }
            case "vertical bar": {
                this.chartAssist = new ChartAssist(new Chart(barGrid({ horizontal: false })));
                break;
            }
            case "pie": {
                this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
                break;
            }
            case "donut": {
                this.donutContentPlugin = new ChartDonutContentPlugin();
                this.chartAssist = new ChartAssist(new Chart(radialGrid()), radial);
                this.chartAssist.chart.addPlugin(this.donutContentPlugin);
                break;
            }
        }
    }

    private getRenderer(): PieRenderer | BarRenderer | RadialRenderer | undefined {
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
        const renderer: PieRenderer | BarRenderer | RadialRenderer | undefined = this.getRenderer();
        const scales: Record<string, IScale<any>> | undefined = this.getScales();
        if (!accessors || !renderer || !scales) {
            throw new Error("Accessors, renderer or scales are unavailable");
        }
        this.chartAssist.update(this.getChartAssistSeries(
            this.categories,
            this.values,
            accessors,
            renderer,
            scales
        ));
    }

    private getScales(): Record<string, IScale<any>> | undefined {
        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        linearScale.domainCalculator = getAutomaticDomainWithIncludedInterval([0, 0]);

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

    private getChartAssistSeries(categories: string[], values: number[], accessors: IAccessors, renderer: Renderer<IAccessors>, scales: Scales) {
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
