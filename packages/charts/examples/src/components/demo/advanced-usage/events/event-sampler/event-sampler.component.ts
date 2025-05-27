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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import each from "lodash/each";
import zipObject from "lodash/zipObject";

import {
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    BarSeriesHighlightStrategy,
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_PALETTE_CS_S_EXTENDED,
    CHART_VIEW_STATUS_EVENT,
    HIGHLIGHT_DATA_POINT_EVENT,
    HIGHLIGHT_SERIES_EVENT,
    IAccessors,
    IBarAccessors,
    IChartEvent,
    IChartMarker,
    IChartSeries,
    IGrid,
    InteractionLabelPlugin,
    InteractionType,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_DATA_POINT_EVENT,
    INTERACTION_SERIES_EVENT,
    INTERACTION_VALUES_EVENT,
    IValueProvider,
    LineAccessors,
    LinearScale,
    LineRenderer,
    LineSelectSeriesInteractionStrategy,
    MappedValueProvider,
    MOUSE_ACTIVE_EVENT,
    Renderer,
    Scales,
    SELECT_DATA_POINT_EVENT,
    SERIES_STATE_CHANGE_EVENT,
    stackedPreprocessor,
    XYGrid,
} from "@nova-ui/charts";

import { isEvenIndex } from "../../../../utility/isEvenIndex";

interface IEventInfo {
    id: string;
    name: string;
    interactionTypes?: string[];
}

enum ChartType {
    StackedBar = "Stacked Bar",
    GroupedBar = "Grouped Bar",
    Line = "Line",
}

type SeriesProcessor<T extends IAccessors = IAccessors> = (
    series: IChartSeries<T>[],
    isVisible: (chartSeries: IChartSeries<T>) => boolean
) => IChartSeries<T>[];

interface IChartTools<T extends IAccessors = IAccessors> {
    seriesProcessor?: SeriesProcessor<T>;
    gridFunction: () => IGrid;
    rendererFunction: () => Renderer<IAccessors>;
    accessorFunction: (
        colors?: IValueProvider<string>,
        markers?: IValueProvider<IChartMarker>
    ) => T;
    scaleFunction: () => Scales;
}

export interface IChartAttributes<T extends IAccessors = IAccessors> {
    seriesProcessor?: SeriesProcessor<T>;
    grid: IGrid;
    renderer: Renderer<IAccessors>;
    accessors: T;
    scales: Scales;
}

@Component({
    selector: "nui-chart-event-sampler",
    templateUrl: "./event-sampler.component.html",
    styleUrls: ["./event-sampler.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSamplerComponent implements OnInit {
    public parsedEvent = {};
    public readonly eventFilters = [
        {
            id: MOUSE_ACTIVE_EVENT,
            name: "MOUSE_ACTIVE_EVENT",
        },
        {
            id: INTERACTION_VALUES_EVENT,
            name: "INTERACTION_VALUES_EVENT",
            interactionTypes: [
                InteractionType.Click,
                InteractionType.MouseMove,
            ],
        },
        {
            id: INTERACTION_DATA_POINTS_EVENT,
            name: "INTERACTION_DATA_POINTS_EVENT",
            interactionTypes: [
                InteractionType.Click,
                InteractionType.MouseMove,
            ],
        },
        {
            id: INTERACTION_DATA_POINT_EVENT,
            name: "INTERACTION_DATA_POINT_EVENT",
            interactionTypes: [InteractionType.Click, InteractionType.Hover],
        },
        {
            id: HIGHLIGHT_DATA_POINT_EVENT,
            name: "HIGHLIGHT_DATA_POINT_EVENT",
            interactionTypes: [InteractionType.MouseMove],
        },
        {
            id: HIGHLIGHT_SERIES_EVENT,
            name: "HIGHLIGHT_SERIES_EVENT",
            interactionTypes: [InteractionType.MouseMove],
        },
        {
            id: INTERACTION_SERIES_EVENT,
            name: "INTERACTION_SERIES_EVENT",
            interactionTypes: [InteractionType.Click],
        },
        {
            id: SELECT_DATA_POINT_EVENT,
            name: "SELECT_DATA_POINT_EVENT",
            interactionTypes: [InteractionType.Click],
        },
        {
            id: CHART_VIEW_STATUS_EVENT,
            name: "CHART_VIEW_STATUS_EVENT",
        },
        {
            id: SERIES_STATE_CHANGE_EVENT,
            name: "SERIES_STATE_CHANGE_EVENT",
        },
    ];

    public selectedEvent: IEventInfo = this.eventFilters[0];
    public selectedInteractionType = "";

    public chartTypes = [
        ChartType.GroupedBar,
        ChartType.StackedBar,
        ChartType.Line,
    ];
    public selectedChartType: ChartType;
    public categories = ["Q1", "Q2", "Q3", "Q4"];
    public subCategories = [
        "down",
        "critical",
        "warning",
        "unknown",
        "ok",
        "other",
    ];
    public values = [
        [24, 16, 7, 6, 97, 4],
        [13, 8, 5, 17, 5, 25],
        [97, 41, 24, 6, 7, 6],
        [45, 87, 23, 48, 24, 9],
    ];
    public valueAccessor: (i: number, j: number) => number;
    public chartAssist: ChartAssist;
    public palette: ChartPalette;

    private accessors: IBarAccessors | IAccessors;
    private renderer: Renderer<IAccessors>;
    private scales: Scales;
    private seriesProcessor?: SeriesProcessor<IBarAccessors> | SeriesProcessor;

    public onEventFilterChange(selectedEvent: IEventInfo): void {
        this.selectedEvent = selectedEvent;
        this.selectedInteractionType = this.selectedEvent.interactionTypes
            ? this.selectedEvent.interactionTypes[0]
            : "";
    }

    public onInteractionTypeChange(type: InteractionType): void {
        this.selectedInteractionType = type;
    }

    constructor(private changeDetector: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this.valueAccessor = (i, j) => this.values[j][i];
        this.palette = new ChartPalette(
            new MappedValueProvider<string>(
                zipObject(
                    this.subCategories,
                    CHART_PALETTE_CS_S_EXTENDED.filter(isEvenIndex)
                )
            )
        );

        this.updateChartType(this.chartTypes[0]);
    }

    public updateChartType(chartType: ChartType): void {
        this.selectedChartType = chartType;
        this.buildChart();
        this.subscribeToChart();
        this.updateChart();
    }

    private buildChart() {
        const { grid, accessors, renderer, scales, seriesProcessor } =
            this.getChartAttributes(this.selectedChartType);

        this.chartAssist = new ChartAssist(new Chart(grid));
        this.chartAssist.palette = this.palette;

        this.chartAssist.chart.addPlugin(new InteractionLabelPlugin());

        this.renderer = renderer;
        this.accessors = accessors;
        this.scales = scales;
        this.seriesProcessor = seriesProcessor;
    }

    private subscribeToChart() {
        each(this.eventFilters, (filter) => {
            this.chartAssist.chart
                .getEventBus()
                .getStream(filter.id)
                .subscribe((event: IChartEvent) => {
                    if (this.selectedEvent.id === filter.id) {
                        if (
                            !event.data.interactionType ||
                            this.selectedInteractionType ===
                                event.data.interactionType
                        ) {
                            recursivelyReplacePropValue(
                                event,
                                "dataSeries",
                                "<< IChartSeries info is available here (replaced in output for brevity) >>"
                            );
                            this.parsedEvent = event;
                            this.changeDetector.markForCheck();
                        }
                    }
                });
        });
    }

    private updateChart(): void {
        let seriesSet:
            | IChartSeries<IAccessors>[]
            | IChartSeries<IBarAccessors>[] = this.buildChartSeries(
            this.categories,
            this.subCategories,
            this.valueAccessor
        );
        // TODO: Refactor this to be able to pass different types of seriesSet to get rid of the any
        seriesSet = this.seriesProcessor
            ? this.seriesProcessor(<any>seriesSet, () => true)
            : seriesSet;
        this.chartAssist.update(seriesSet);
    }

    private buildChartSeries(
        categories: string[],
        subCategories: string[],
        valueAccessor: (i: number, j: number) => number
    ): IChartSeries<IBarAccessors>[] | IChartSeries<IAccessors>[] {
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
    ): IChartAttributes | IChartAttributes<IBarAccessors> {
        const t: IChartTools | IChartTools<IBarAccessors> =
            this.getChartTools(chartType);
        let result: IChartAttributes | IChartAttributes<IBarAccessors> = {
            grid: t.gridFunction(),
            accessors: t.accessorFunction(),
            renderer: t.rendererFunction(),
            scales: t.scaleFunction(),
        };

        if (t.seriesProcessor) {
            result = {
                ...result,
                seriesProcessor: t.seriesProcessor,
            } as IChartAttributes<IBarAccessors>;
        }
        return result;
    }

    private getChartTools(
        chartType: ChartType
    ): IChartTools<IBarAccessors> | IChartTools {
        const chartTools: Record<
            ChartType,
            IChartTools<IBarAccessors> | IChartTools
        > = {
            [ChartType.StackedBar]: {
                seriesProcessor: stackedPreprocessor,
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
                        highlightStrategy: new BarSeriesHighlightStrategy("x"),
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
                rendererFunction: () =>
                    new LineRenderer({
                        interactionStrategy:
                            new LineSelectSeriesInteractionStrategy(),
                        markerInteraction: { enabled: true, clickable: true },
                    }),
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

function recursivelyReplacePropValue(
    obj: Record<string, any>,
    property: string,
    replacement: string
): void {
    for (const prop in obj) {
        if (prop === property) {
            obj[prop] = replacement;
        } else if (typeof obj[prop] === "object") {
            recursivelyReplacePropValue(obj[prop], property, replacement);
        }
    }
}
