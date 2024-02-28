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
    Directive,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import { IXYScales } from "@nova-ui/charts";
import { ITimeseriesScalesConfig } from "@nova-ui/dashboards";

import { CHART_METRIC_REMOVE } from "../../../services/types";
import {
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../../types";
import { metricsSeriesMeasurementsMinMax } from "../services/cartesian-chart-helpers";
import { CartesianScalesService } from "../services/cartesian-scales.service";
import {
    CartesianChartPreset,
    CartesianOutput,
    CartesianScalesConfig,
    CartesianWidgetConfig,
    CartesianWidgetData,
    CartesianWidgetSeriesData,
} from "../types";

@Directive() // eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class CartesianChartComponent<T = CartesianWidgetSeriesData>
    implements OnChanges, OnDestroy, OnInit
{
    @Input() @HostBinding("class") public elementClass: string;
    @Input() public widgetData: CartesianOutput<T> = {} as CartesianOutput<T>;
    @Input() public configuration: CartesianWidgetConfig =
        {} as CartesianWidgetConfig;

    protected scales: IXYScales = {} as IXYScales;
    protected destroy$ = new Subject<void>();
    protected buildChart$ = new Subject<void>();
    protected resetChart = false;
    protected chartBuilt = false;

    protected constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        public cartesianScalesService: CartesianScalesService,
        public dataSource: IDataSource
    ) {
        this.buildChart$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.chartBuilt = true;
        });
    }

    public get seriesInteractive(): boolean {
        return (
            this.configuration?.interaction === "series" ||
            this.dataSource?.features?.getFeatureConfig(
                WellKnownDataSourceFeatures.Interactivity
            )?.enabled ||
            false
        );
    }

    public ngOnInit(): void {
        // save original data
        if (
            this.configuration.preset === CartesianChartPreset.Line &&
            this.widgetData &&
            this.widgetData.series
        ) {
            this.widgetData.series.forEach(
                (serie) => (serie.rawData = serie.data)
            );
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        let shouldUpdateChart = false;
        let shouldRebuildChart = false;

        if (changes.configuration) {
            const configurationCurrent: CartesianWidgetConfig =
                changes.configuration.currentValue;
            const configurationPrevious: CartesianWidgetConfig =
                changes.configuration.previousValue;

            if (
                configurationCurrent?.preset !== configurationPrevious?.preset
            ) {
                shouldRebuildChart = true;
            }

            if (
                configurationCurrent?.scales !== configurationPrevious?.scales
            ) {
                const scaleKeys = Object.keys(
                    configurationCurrent?.scales
                ) as Array<keyof CartesianScalesConfig>;

                for (const scaleKey of scaleKeys) {
                    const scaleConfigCurrent =
                        configurationCurrent?.scales?.[scaleKey];
                    const scaleConfigPrevious =
                        configurationPrevious?.scales?.[scaleKey];

                    if (!scaleConfigCurrent) {
                        continue;
                    }

                    if (
                        scaleConfigCurrent?.type !==
                            scaleConfigPrevious?.type ||
                        scaleConfigCurrent?.properties?.axisUnits !==
                            scaleConfigPrevious?.properties?.axisUnits
                    ) {
                        this.scales[scaleKey] =
                            this.cartesianScalesService.getScale(
                                scaleConfigCurrent,
                                configurationCurrent.units,
                                this.configuration
                            );

                        shouldUpdateChart = true;
                    } else if (
                        scaleConfigCurrent?.properties !==
                        scaleConfigPrevious?.properties
                    ) {
                        this.cartesianScalesService.updateConfiguration(
                            this.scales[scaleKey],
                            scaleConfigCurrent,
                            this.configuration
                        );
                        shouldUpdateChart = true;
                    }
                }
            }
        }

        if (shouldRebuildChart || !this.chartBuilt) {
            this.buildChart();
        }

        if (changes.widgetData && !changes.widgetData.isFirstChange()) {
            if (this.widgetData?.series?.length === 0) {
                this.resetChart = true;
            }

            if (this.widgetData && this.widgetData.series) {
                if (this.resetChart && this.widgetData?.series?.length > 0) {
                    this.resetChart = false;
                    this.buildChart();
                }
                this.applyPreviousTransformer(changes.widgetData.previousValue);

                shouldUpdateChart = true;
            }
        }

        if (shouldUpdateChart) {
            this.updateChartData();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.buildChart$.complete();
    }

    public updateYAxisDomain(): void {
        const scaleKeys = ["y", "yRight"] as Array<
            keyof ITimeseriesScalesConfig
        >;
        for (const scaleKey of scaleKeys) {
            const scaleConfig = this.configuration.scales?.[scaleKey];
            if (scaleConfig?.properties) {
                scaleConfig.properties.domain = {
                    ...metricsSeriesMeasurementsMinMax(
                        this.widgetData.series,
                        scaleConfig?.properties?.axisUnits
                    ),
                };
                this.cartesianScalesService.updateConfiguration(
                    this.scales[scaleKey],
                    scaleConfig,
                    this.configuration
                );
            }
        }
    }

    public removeMetric(metricId: string): void {
        this.eventBus.next(CHART_METRIC_REMOVE, {
            payload: {
                metricId: metricId,
                groupUniqueId: this.configuration.groupUniqueId,
            },
        });
    }

    protected applyPreviousTransformer(previousData: any): void {
        // save original data and transform it
        this.widgetData.series.forEach((serie) => {
            serie.rawData = serie.data;
            serie.transformer = previousData?.series.find(
                (prevSerie: CartesianWidgetData) => prevSerie.id === serie.id
            )?.transformer;
            this.transformSeriesData(serie);
        });
    }

    protected transformSeriesData(serie: CartesianWidgetData<T>): void {
        if (serie.transformer && serie.rawData && serie.rawData.length > 0) {
            try {
                const hasPercentile = serie.metricUnits === "percent";
                serie.data = serie.transformer(serie.rawData, hasPercentile);
                this.updateYAxisDomain();
            } catch (e) {
                serie.transformer = undefined;
                serie.data = serie.rawData;
                console.error(e.message);
            }
        }
    }

    /** Updates chart data. */
    protected abstract updateChartData(): void;

    protected abstract buildChart(): void;
}
