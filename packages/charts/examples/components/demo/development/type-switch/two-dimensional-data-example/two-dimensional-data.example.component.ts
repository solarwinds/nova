import { Component, OnInit } from "@angular/core";
import zipObject from "lodash/zipObject";

import {
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS1,
    CHART_PALETTE_CS_S,
    IAccessors,
    IBarAccessors,
    IChartAssistSeries,
    IChartMarker,
    IChartSeries,
    IGrid,
    InteractionLabelPlugin,
    IValueProvider,
    LineAccessors,
    LinearScale,
    LineRenderer,
    MappedValueProvider,
    Renderer,
    Scales,
    stack,
    XYGrid,
} from "@nova-ui/charts";

enum ChartType {
    StackedBar = "stacked bar",
    GroupedBar = "grouped bar",
    Line = "line",
}

type PreprocessorType<T> = (
    this: ChartAssist,
    series: IChartAssistSeries<T>[]
) => IChartAssistSeries<T>[];

interface IChartTools<T = IAccessors> {
    preprocessor?: PreprocessorType<T>;
    gridFunction: () => IGrid;
    rendererFunction: () => Renderer<IAccessors>;
    accessorFunction: (
        colors?: IValueProvider<string>,
        markers?: IValueProvider<IChartMarker>
    ) => IAccessors;
    scaleFunction: () => Scales;
}

export interface IChartAttributes<T = IAccessors> {
    grid: IGrid;
    accessors: IAccessors;
    renderer: Renderer<IAccessors>;
    scales: Scales;
    preprocessor?: PreprocessorType<T>;
}

@Component({
    selector: "nui-chart-two-dimensional-data-example",
    templateUrl: "./two-dimensional-data.example.component.html",
})
export class TwoDimensionalDataExampleComponent implements OnInit {
    public chartTypes = [
        ChartType.StackedBar,
        ChartType.GroupedBar,
        ChartType.Line,
    ];
    public chartType = this.chartTypes[0];
    public mainCategoryOptions = ["quarters", "statuses"];
    public mainCategory = this.mainCategoryOptions[0];
    public statuses = ["down", "critical", "warning", "unknown", "ok", "other"];
    public quarters = ["Q1", "Q2", "Q3", "Q4"];
    public iconNames = [
        "down",
        "critical",
        "warning",
        "unknown",
        "up",
        "unmanaged",
    ];
    public categories: string[];
    public subCategories: string[];
    public values = [
        [24, 16, 7, 6, 97, 4],
        [13, 8, 5, 17, 5, 25],
        [97, 41, 24, 6, 7, 6],
        [45, 87, 23, 48, 24, 9],
    ];
    public valueAccessor: (i: number, j: number) => number;

    public iconMap = zipObject(
        this.statuses,
        this.iconNames.map((n) => `status_${n}`)
    );
    public palette: ChartPalette;
    public chartAssist: ChartAssist;
    public accessors: IAccessors;

    private renderer: Renderer<IAccessors>;
    private scales: Scales;

    public ngOnInit() {
        this.updateMainCategory();
    }

    public updateMainCategory() {
        const statusPalette = new ChartPalette(
            new MappedValueProvider<string>(
                zipObject(this.statuses, CHART_PALETTE_CS_S)
            )
        );
        const standardPalette = new ChartPalette(CHART_PALETTE_CS1);

        const groupByQuarter =
            this.mainCategory === this.mainCategoryOptions[0];

        this.categories = groupByQuarter ? this.statuses : this.quarters;
        this.subCategories = groupByQuarter ? this.quarters : this.statuses;
        this.valueAccessor = groupByQuarter
            ? (i, j) => this.values[i][j]
            : (i, j) => this.values[j][i];
        this.palette = groupByQuarter ? standardPalette : statusPalette;

        this.updateChartType();
    }

    public updateChartType() {
        this.buildChart();
        this.updateChart();
    }

    private buildChart() {
        const { grid, accessors, renderer, scales, preprocessor } =
            this.getChartAttributes(this.chartType);

        this.renderer = renderer;
        this.accessors = accessors;
        this.scales = scales;

        const chart = new Chart(grid);
        chart.addPlugin(new InteractionLabelPlugin());

        this.chartAssist = new ChartAssist(chart, preprocessor, this.palette);

        if (this.chartType === ChartType.StackedBar) {
            this.chartAssist.seriesProcessor = stack;
        }
    }

    private updateChart() {
        this.chartAssist.update(
            this.buildChartSeries(
                this.categories,
                this.subCategories,
                this.valueAccessor
            )
        );
    }

    private buildChartSeries(
        categories: string[],
        subCategories: string[],
        valueAccessor: (i: number, j: number) => number
    ): IChartSeries<IAccessors>[] {
        return subCategories.map((subCategory, i) => ({
            id: subCategory,
            name: subCategory,
            data: categories.map((xCategory, j) => ({
                category: xCategory,
                value: valueAccessor(i, j) || 0,
            })),
            accessors: this.accessors,
            renderer: this.renderer,
            scales: this.scales,
        }));
    }

    private getChartAttributes(
        chartType: ChartType
    ): IChartAttributes<IBarAccessors> {
        const t: IChartTools<IBarAccessors> = this.getChartTools(chartType);
        const result: IChartAttributes<IBarAccessors> = {
            grid: t.gridFunction(),
            accessors: t.accessorFunction(),
            renderer: t.rendererFunction(),
            scales: t.scaleFunction(),
        };

        if (t.preprocessor) {
            result.preprocessor =
                t.preprocessor as PreprocessorType<IBarAccessors>;
        }
        return result;
    }

    private getChartTools(chartType: ChartType): IChartTools<IBarAccessors> {
        const chartTools: Record<ChartType, IChartTools<IBarAccessors>> = {
            [ChartType.StackedBar]: {
                preprocessor: stack,
                gridFunction: barGrid,
                rendererFunction: () =>
                    new BarRenderer({
                        highlightStrategy: new BarHighlightStrategy("x"),
                    }),
                accessorFunction: () =>
                    barAccessors(undefined, this.palette.standardColors),
                scaleFunction: barScales,
            },
            [ChartType.GroupedBar]: {
                gridFunction: () => barGrid({ grouped: true }),
                rendererFunction: () =>
                    new BarRenderer({
                        highlightStrategy: new BarHighlightStrategy("x"),
                    }),
                accessorFunction: () => {
                    const accessors = barAccessors(
                        { grouped: true },
                        this.palette.standardColors
                    );
                    accessors.data.category = (data, i, series, dataSeries) => [
                        data.category,
                        dataSeries.name,
                    ];
                    return accessors;
                },
                scaleFunction: () => barScales({ grouped: true }),
            },
            [ChartType.Line]: {
                gridFunction: () => new XYGrid(),
                rendererFunction: () => new LineRenderer(),
                accessorFunction: () => {
                    const accessors = new LineAccessors(
                        this.palette.standardColors
                    );
                    accessors.data.x = (d) => d.category;
                    accessors.data.y = (d) => d.value;
                    accessors.data.value = (d) => d.value;
                    return accessors;
                },
                scaleFunction: () => ({
                    x: new BandScale().fixDomain(this.categories),
                    y: new LinearScale(),
                }),
            },
        };

        return chartTools[chartType];
    }
}
