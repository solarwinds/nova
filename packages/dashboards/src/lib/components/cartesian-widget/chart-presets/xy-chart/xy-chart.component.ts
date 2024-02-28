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
// eslint-disable-next-line import/no-deprecated
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
    XYAccessors,
    XYGrid,
    XYRenderer,
    MappedValueProvider,
} from "@nova-ui/charts";
import { TimeseriesInteractionType } from "@nova-ui/dashboards";

import { INTERACTION, SET_TIMEFRAME } from "../../../../services/types";
import {
    DATA_SOURCE,
    IHasChangeDetector,
    PIZZAGNA_EVENT_BUS,
} from "../../../../types";
import { LegendPlacement } from "../../../../widget-types/common/widget/legend";
import {
    SUMMARY_LEGEND_BCG_COLOR,
    SUMMARY_LEGEND_COLOR,
} from "../../services/cartesian-chart-helpers";
import { CartesianScalesService } from "../../services/cartesian-scales.service";
import { transformChangePoint } from "../../transformer/transformer-change-point";
import { transformDifference } from "../../transformer/transformer-difference";
import { transformFloatingAverage } from "../../transformer/transformer-floating-average";
import { transformLinReg } from "../../transformer/transformer-lin-reg";
import { transformLoessSmoothing } from "../../transformer/transformer-loess";
import { transformLoessStandardize } from "../../transformer/transformer-loess-standardize";
import { transformNormalize } from "../../transformer/transformer-normalize";
import { transformPercentileStd } from "../../transformer/transformer-percentile-std";
import { transformStandardize } from "../../transformer/transformer-standardize";
import {
    CartesianChartPreset, CartesianInteractionType,
    CartesianTransformer,
    CartesianWidgetSeriesData,
} from "../../types";
import { CartesianChartComponent } from "../cartesian-chart.component";

interface ITransformerDescription {
    displayName: string;
    transformer?: (
        data: CartesianWidgetSeriesData[],
        hasPercentile?: boolean
    ) => CartesianWidgetSeriesData[];
}

@Injectable()
export abstract class XYChartComponent
    extends CartesianChartComponent
    implements OnChanges, OnDestroy, IHasChangeDetector
{
    public chartAssist: ChartAssist;
    public valueAccessorKey: string = "y";
    public collectionId: string = "";
    // TODO not supported
    public zoomPlugins: any[];
    public summarySerie: IChartAssistSeries<IAccessors>;
    public summaryLegendBcgColor = SUMMARY_LEGEND_BCG_COLOR;
    public summaryLegendColor = SUMMARY_LEGEND_COLOR;
    public transformers = new Map<
        CartesianTransformer,
        ITransformerDescription
    >([
        [
            CartesianTransformer.None,
            {
                displayName: $localize`None`,
                transformer: undefined,
            },
        ],
        [
            CartesianTransformer.ChangePoint,
            {
                displayName: $localize`Change Point`,
                transformer: transformChangePoint,
            },
        ],
        [
            CartesianTransformer.Difference,
            {
                displayName: $localize`Difference`,
                transformer: transformDifference,
            },
        ],
        [
            CartesianTransformer.FloatingAverage,
            {
                displayName: $localize`Floating Average`,
                transformer: transformFloatingAverage,
            },
        ],
        [
            CartesianTransformer.Linear,
            {
                displayName: $localize`Linear`,
                transformer: transformLinReg,
            },
        ],
        [
            CartesianTransformer.Normalize,
            {
                displayName: $localize`Normalize`,
                transformer: transformNormalize,
            },
        ],
        [
            CartesianTransformer.PercentileStd,
            {
                displayName: $localize`Percentile Standardized`,
                transformer: transformPercentileStd,
            },
        ],
        [
            CartesianTransformer.Smoothing,
            {
                displayName: $localize`Smoothing`,
                transformer: transformLoessSmoothing,
            },
        ],
        [
            CartesianTransformer.LoessStandardize,
            {
                displayName: $localize`Smoothing Standardized`,
                transformer: transformLoessStandardize,
            },
        ],
        [
            CartesianTransformer.Standardize,
            {
                displayName: $localize`Standardize`,
                transformer: transformStandardize,
            },
        ],
    ]);
    protected renderer: Renderer<IAccessors>;
    protected accessors: IAccessors;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        public cartesianScalesService: CartesianScalesService,
        public changeDetector: ChangeDetectorRef
    ) {
        super(eventBus, cartesianScalesService, dataSource);
    }

    public mapSeriesSet(
        data: any[],
        scales: IXYScales
    ): IChartAssistSeries<IAccessors>[] {
        const yScales: IScale<any>[] = [scales.y];
        if (scales.yRight) {
            yScales.push(scales.yRight);
        }
        const dataMapped: IChartAssistSeries<IAccessors>[] = data.map(
            (series: any) => {
                // matches scale units to the metric unit for either left y-axis scale or right y-axis scale
                let yScale = yScales.find(
                    (yScale) => yScale.scaleUnits === series.metricUnits
                );
                if (!yScale) {
                    yScale =
                        yScales.find(
                            (yScale) => yScale.scaleUnits === "generic"
                        ) ?? scales.y;
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
            }
        );

        if (this.widgetData.summarySerie) {
            this.summarySerie = {
                ...this.widgetData.summarySerie,
                accessors: new XYAccessors(),
                renderer: new XYRenderer({
                    ignoreForDomainCalculation: true,
                }),
                scales: {
                    x: scales.x,
                    y: scales.y,
                },
                showInLegend: false,
                preprocess: false,
            };
            dataMapped.push(this.summarySerie);
        }

        return dataMapped;
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
    ): void {
        if (!this.seriesInteractive) {
            return;
        }

        event.stopPropagation();
        this.eventBus.getStream(INTERACTION).next({
            payload: {
                data: legendSeries,
                interactionType: CartesianInteractionType.Series,
            },
        });
    }

    public displayLegendMenu(): boolean {
        return (
            this.configuration.preset === CartesianChartPreset.Line &&
            !!this.configuration.allowLegendMenu
        );
    }

    public displayDeleteButton(): boolean {
        return (
            this.configuration.preset !== CartesianChartPreset.Line &&
            !!this.configuration.allowLegendMenu
        );
    }

    public transformData(metricId: string, trId: CartesianTransformer): void {
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

    public getLegendValue(
        legendSeries: IChartAssistSeries<IAccessors<any>>,
        valueAccessorKey: string
    ): string | number | undefined {
        const val = this.chartAssist.getHighlightedValue(
            legendSeries,
            "y",
            "tick",
            valueAccessorKey
        );

        if (
            this.configuration.preset === CartesianChartPreset.StackedArea &&
            this.configuration.units === "percent"
        ) {
            const submetricsCount = this.chartAssist.legendSeriesSet.length;
            const strVal = `${val ?? 0}`;

            return `${parseFloat(strVal ?? "0") * submetricsCount} %`;
        }

        return val;
    }

    protected abstract createAccessors(
        colorProvider: IValueProvider<string>
    ): IAccessors;

    protected abstract createChartAssist(palette: ChartPalette): ChartAssist;

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
    protected buildChart(): void {
        this.buildChart$.next();

        const colorProvider = this.getConfigurationColorProvider(
            this.configuration.chartColors
        );

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

        // todo not supported
        // if (this.configuration.enableZoom && this.zoomPlugins.length) {
        //     chart.addPlugin(this.zoomPlugins[0]);
        // }

        chart
            .getEventBus()
            .getStream(SET_DOMAIN_EVENT)
            // eslint-disable-next-line import/no-deprecated
            .pipe(takeUntil(merge(this.destroy$, this.buildChart$)))
            .subscribe((event) => {
                const payload = <ISetDomainEventPayload>event.data;
                const newDomain = payload[Object.keys(payload)[0]];
                this.eventBus.getStream(SET_TIMEFRAME).next({
                    payload: {
                        startDatetime: newDomain[0],
                        endDatetime: newDomain[1],
                        selectedPresetId: undefined,
                    },
                });
            });

        this.setupInteraction();
    }

    /**
     * Subscribe to chart events and emit
     */
    protected setupInteraction(): void {
        // interaction with chart data points
        this.chartAssist.chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            // eslint-disable-next-line import/no-deprecated
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
            // eslint-disable-next-line import/no-deprecated
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

    private getConfigurationColorProvider(
        configurationColors: string[] | Record<string, string> | undefined
    ): IValueProvider<string> {
        let colorProvider: IValueProvider<string>;
        if (!configurationColors) {
            return defaultColorProvider();
        }
        if (Array.isArray(configurationColors)) {
            colorProvider = new SequentialColorProvider(configurationColors);
        } else {
            const setupColorsLength = Object.keys(configurationColors).length;
            if (setupColorsLength === this.widgetData.series.length) {
                colorProvider = new MappedValueProvider(configurationColors);
            } else {
                colorProvider = defaultColorProvider();
            }
        }

        return colorProvider;
    }
}
