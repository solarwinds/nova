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
    ChangeDetectorRef,
    Inject,
    Injectable,
    OnChanges,
    OnDestroy,
    Optional,
} from "@angular/core";
import { merge } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import {
    ChartAssist,
    ChartPalette,
    defaultColorProvider,
    IAccessors,
    IChartAssistSeries,
    IChartEvent,
    IDataPointsPayload,
    IInteractionDataPointsEvent,
    IInteractionValuesPayload,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_VALUES_EVENT,
    InteractionType,
    IScale,
    ISetDomainEventPayload,
    IValueProvider,
    IXYGridConfig,
    IXYScales,
    Renderer,
    SequentialColorProvider,
    SET_DOMAIN_EVENT,
    TimeseriesZoomPlugin,
    TimeseriesZoomPluginsSyncService,
    XYGrid,
} from "@nova-ui/charts";

import {
    CHART_METRIC_REMOVE,
    INTERACTION,
    SET_TIMEFRAME,
} from "../../../../services/types";
import {
    DATA_SOURCE,
    IHasChangeDetector,
    PIZZAGNA_EVENT_BUS,
} from "../../../../types";
import { LegendPlacement } from "../../../../widget-types/common/widget/legend";
import { TimeseriesScalesService } from "../../timeseries-scales.service";
import {
    transformChangePoint,
    transformDifference,
    transformFloatingAverage,
    transformLinReg,
    transformLoessSmoothing,
    transformLoessStandardize,
    transformNormalize,
    transformPercentileStd,
    transformStandardize,
} from "../../transformer/public-api";
import {
    ITimeseriesWidgetSeriesData,
    TimeseriesChartPreset,
    TimeseriesInteractionType,
    TimeseriesTransformer,
    TimeseriesWidgetProjectType,
} from "../../types";
import { TimeseriesChartComponent } from "../timeseries-chart.component";

interface ITransformerDescription {
    displayName: string;
    transformer?: (
        data: ITimeseriesWidgetSeriesData[],
        hasPercentile?: boolean
    ) => ITimeseriesWidgetSeriesData[];
}

@Injectable()
export abstract class XYChartComponent
    extends TimeseriesChartComponent
    implements OnChanges, OnDestroy, IHasChangeDetector
{
    public chartAssist: ChartAssist;
    public valueAccessorKey: string = "y";
    public collectionId: string = "";
    public zoomPlugin: TimeseriesZoomPlugin;

    protected renderer: Renderer<IAccessors>;
    protected accessors: IAccessors;

    public transformers = new Map<
        TimeseriesTransformer,
        ITransformerDescription
    >([
        [
            TimeseriesTransformer.None,
            { displayName: $localize`None`, transformer: undefined },
        ],
        [
            TimeseriesTransformer.ChangePoint,
            {
                displayName: $localize`Change Point`,
                transformer: transformChangePoint,
            },
        ],
        [
            TimeseriesTransformer.Difference,
            {
                displayName: $localize`Difference`,
                transformer: transformDifference,
            },
        ],
        [
            TimeseriesTransformer.FloatingAverage,
            {
                displayName: $localize`Floating Average`,
                transformer: transformFloatingAverage,
            },
        ],
        [
            TimeseriesTransformer.Linear,
            { displayName: $localize`Linear`, transformer: transformLinReg },
        ],
        [
            TimeseriesTransformer.Normalize,
            {
                displayName: $localize`Normalize`,
                transformer: transformNormalize,
            },
        ],
        [
            TimeseriesTransformer.PercentileStd,
            {
                displayName: $localize`Percentile Standardized`,
                transformer: transformPercentileStd,
            },
        ],
        [
            TimeseriesTransformer.Smoothing,
            {
                displayName: $localize`Smoothing`,
                transformer: transformLoessSmoothing,
            },
        ],
        [
            TimeseriesTransformer.LoessStandardize,
            {
                displayName: $localize`Smoothing Standardized`,
                transformer: transformLoessStandardize,
            },
        ],
        [
            TimeseriesTransformer.Standardize,
            {
                displayName: $localize`Standardize`,
                transformer: transformStandardize,
            },
        ],
    ]);

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        public timeseriesScalesService: TimeseriesScalesService,
        public changeDetector: ChangeDetectorRef,
        public zoomPluginsSyncService: TimeseriesZoomPluginsSyncService
    ) {
        super(eventBus, timeseriesScalesService, dataSource);
    }

    protected abstract createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors;

    protected abstract createChartAssist(palette: ChartPalette): ChartAssist;

    public mapSeriesSet(
        data: any[],
        scales: IXYScales
    ): IChartAssistSeries<IAccessors>[] {
        const yScales: IScale<any>[] = [scales.y];
        if (scales.yRight) {
            yScales.push(scales.yRight);
        }
        return data.map((series: any, i: number) => {
            // matches scale units to the metric unit for either left y-axis scale or right y-axis scale
            let yScale = yScales.find(
                (yScale) => yScale.scaleUnits === series.metricUnits
            );
            if (!yScale) {
                yScale =
                    yScales.find((yScale) => yScale.scaleUnits === "generic") ??
                    scales.y;
            }

            return {
                ...series,
                scales: {
                    x: scales.x,
                    y: yScale,
                },
                renderer: this.renderer,
                accessors: this.accessors,
            };
        });
    }

    /** Checks if legend should be shown. */
    public hasLegend(): boolean {
        return (
            this.configuration.legendPlacement &&
            this.configuration.legendPlacement !== LegendPlacement.None
        );
    }

    /** Checks if legend should be aligned to right. */
    public legendShouldBeAlignedRight(): boolean {
        return this.configuration.legendPlacement === LegendPlacement.Right;
    }

    public onPrimaryDescClick(
        event: MouseEvent,
        legendSeries: IChartAssistSeries<IAccessors>
    ) {
        if (!this.seriesInteractive) {
            return;
        }

        event.stopPropagation();
        this.eventBus.getStream(INTERACTION).next({
            payload: {
                data: legendSeries,
                interactionType: TimeseriesInteractionType.Series,
            },
        });
    }

    /** Updates chart data. */
    protected updateChartData(): void {
        const grid = this.chartAssist.chart.getGrid() as XYGrid;
        if (this.scales.y?.id) {
            grid.leftScaleId = this.scales.y.id;
        }

        if (
            (this.scales.yRight && this.widgetData.series.length === 1) ||
            (this.scales.y &&
                this.scales.yRight &&
                this.scales.y.scaleUnits === this.scales.yRight.scaleUnits)
        ) {
            // if there is only one series to display, or if the left y-axis and right y-axis have the same units, both y-axises are same
            this.scales.yRight = this.scales.y;
            grid.rightScaleId = this.scales.y.id;
        } else {
            if (this.scales.yRight?.id) {
                grid.rightScaleId = this.scales.yRight.id;
            }
        }

        const gridConfig = grid.config();
        // hides botom axis if it's not last chart in the group
        gridConfig.axis.bottom.visible = !this.configuration?.hasAdjacentChart;
        gridConfig.borders.bottom.visible =
            !this.configuration?.hasAdjacentChart;

        this.chartAssist.update(
            this.mapSeriesSet(this.widgetData.series, this.scales)
        );
    }

    /**
     * Initialize chart
     */
    protected buildChart() {
        this.buildChart$.next();

        const colorProvider =
            this.configuration.chartColors &&
            this.configuration.chartColors?.length > 0
                ? new SequentialColorProvider(this.configuration.chartColors)
                : defaultColorProvider();

        const palette = new ChartPalette(colorProvider);
        this.accessors = this.createAccessors(palette.standardColors);
        this.chartAssist = this.createChartAssist(palette);

        const chart = this.chartAssist.chart;
        const gridConfig = chart.getGrid().config() as IXYGridConfig;

        if (this.configuration.gridConfig?.xAxisTicksCount) {
            gridConfig.axis.bottom.approximateTicks =
                this.configuration.gridConfig.xAxisTicksCount;
        }

        if (
            gridConfig.dimension.marginLocked &&
            this.configuration.gridConfig?.sideMarginLocked
        ) {
            gridConfig.dimension.marginLocked.left = true;
            gridConfig.dimension.marginLocked.right = true;
        }

        if (this.configuration.gridConfig?.sideMargin) {
            gridConfig.dimension.margin.left =
                this.configuration.gridConfig.sideMargin;
            gridConfig.dimension.margin.right =
                this.configuration.gridConfig.sideMargin;
        }

        if (this.configuration.enableZoom) {
            chart.addPlugin(this.zoomPlugin);
        }

        chart
            .getEventBus()
            .getStream(SET_DOMAIN_EVENT)
            .pipe(takeUntil(merge(this.destroy$, this.buildChart$)))
            .subscribe((event) => {
                const payload = <ISetDomainEventPayload>event.data;
                const newDomain = payload[Object.keys(payload)[0]];
                this.eventBus.getStream(SET_TIMEFRAME).next({
                    payload: {
                        startDatetime: newDomain[0],
                        endDatetime: newDomain[1],
                        selectedPresetId: null,
                    },
                });
            });

        this.setupInteraction();
    }

    /**
     * Subscribe to chart events and emit
     */
    protected setupInteraction() {
        // interaction with chart data points
        this.chartAssist.chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .pipe(takeUntil(merge(this.destroy$, this.buildChart$)))
            .subscribe((values: IChartEvent) => {
                const payload: IInteractionDataPointsEvent = values.data;
                if (payload.interactionType === InteractionType.Click) {
                    this.eventBus.getStream(INTERACTION).next({
                        payload: {
                            data: payload.dataPoints as IDataPointsPayload,
                            interactionType:
                                TimeseriesInteractionType.DataPoints,
                        },
                    });
                }
            });

        // interaction with values
        this.chartAssist.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(merge(this.destroy$, this.buildChart$)))
            .subscribe((values: IChartEvent) => {
                const payload: IInteractionValuesPayload = values.data;
                if (payload.interactionType === InteractionType.Click) {
                    this.eventBus.getStream(INTERACTION).next({
                        payload: {
                            data: payload.values,
                            interactionType: TimeseriesInteractionType.Values,
                        },
                    });
                }
            });
    }

    public displayLegendMenu(): boolean {
        return (
            this.configuration.preset === TimeseriesChartPreset.Line &&
            !!this.configuration.allowLegendMenu &&
            this.configuration.projectType ===
                TimeseriesWidgetProjectType.PerfstackApp
        );
    }

    public transformData(metricId: string, trId: TimeseriesTransformer): void {
        const serie = this.widgetData.series.find((s) => s.id === metricId);
        if (!serie) {
            return;
        }
        serie.transformer = this.transformers.get(trId)?.transformer;

        if (serie.rawData) {
            if (serie.transformer === undefined) {
                // revert transformed data
                serie.data = serie.rawData;
                this.updateYAxisDomain();
            } else {
                this.transformSeriesData(serie);
            }
        }
        this.updateChartData();
    }
}
