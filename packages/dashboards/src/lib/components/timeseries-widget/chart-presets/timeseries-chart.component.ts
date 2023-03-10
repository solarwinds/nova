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
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataSource, UnitOption } from "@nova-ui/bits";
import { IXYScales } from "@nova-ui/charts";

import { WellKnownDataSourceFeatures } from "../../../types";
import { TimeseriesScalesService } from "../timeseries-scales.service";
import {
    ITimeseriesOutput,
    ITimeseriesScalesConfig,
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    TimeseriesChartPreset,
} from "../types";

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class TimeseriesChartComponent<T = ITimeseriesWidgetSeriesData>
    implements OnChanges, OnDestroy, OnInit
{
    @Input() public widgetData: ITimeseriesOutput<T> =
        {} as ITimeseriesOutput<T>;
    @Input() public configuration: ITimeseriesWidgetConfig =
        {} as ITimeseriesWidgetConfig;

    protected scales: IXYScales = {} as IXYScales;
    protected destroy$ = new Subject<void>();
    protected buildChart$ = new Subject<void>();
    protected resetChart = false;
    protected chartBuilt = false;

    public get seriesInteractive(): boolean {
        return (
            this.configuration?.interaction === "series" ||
            this.dataSource?.features?.getFeatureConfig(
                WellKnownDataSourceFeatures.Interactivity
            )?.enabled ||
            false
        );
    }

    protected constructor(
        public timeseriesScalesService: TimeseriesScalesService,
        public dataSource: IDataSource
    ) {
        this.buildChart$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.chartBuilt = true;
        });
    }

    public ngOnInit(): void {
        // save original data
        if (
            this.configuration.preset === TimeseriesChartPreset.Line &&
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
            const configurationCurrent: ITimeseriesWidgetConfig =
                changes.configuration.currentValue;
            const configurationPrevious: ITimeseriesWidgetConfig =
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
                ) as Array<keyof ITimeseriesScalesConfig>;

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
                            this.timeseriesScalesService.getScale(
                                scaleConfigCurrent,
                                configurationCurrent.units,
                                this.configuration
                            );

                        shouldUpdateChart = true;
                    } else if (
                        scaleConfigCurrent?.properties !==
                        scaleConfigPrevious?.properties
                    ) {
                        this.timeseriesScalesService.updateConfiguration(
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

    protected applyPreviousTransformer(previousData: any): void {
        // save original data and transform it
        this.widgetData.series.forEach((serie) => {
            serie.rawData = serie.data;
            serie.transformer = previousData?.series.find(
                (prevSerie: ITimeseriesWidgetData) => prevSerie.id === serie.id
            )?.transformer;
            this.transformSeriesData(serie);
        });
    }

    protected transformSeriesData(serie: ITimeseriesWidgetData<T>): void {
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

    public updateYAxisDomain(): void {
        const scaleKeys = ["y", "yRight"] as Array<
            keyof ITimeseriesScalesConfig
        >;
        for (const scaleKey of scaleKeys) {
            const scaleConfig = this.configuration.scales?.[scaleKey];
            if (scaleConfig?.properties) {
                scaleConfig.properties.domain = {
                    ...this.getMinMaxData(scaleConfig?.properties?.axisUnits),
                };
                this.timeseriesScalesService.updateConfiguration(
                    this.scales[scaleKey],
                    scaleConfig,
                    this.configuration
                );
            }
        }
    }

    private getMinMaxData(axisUnits: UnitOption): { min: number; max: number } {
        const series = this.widgetData.series;
        if (axisUnits === "percent") {
            return { min: 0, max: 100 };
        }

        // skips percent measurements as they are displayed on the left y-axis and would affect right y-axis domain
        const nonPercentMetrics = series.filter(
            (metric) => metric.metricUnits !== "percent" && metric.data?.length
        );

        // case where there are no measurements for non-percent metrics,  e.g when a license expires
        if (nonPercentMetrics.length === 0) {
            return { min: -1, max: 1 };
        }

        const measurements = nonPercentMetrics
            .map((m) => m.data)
            .reduce((x, y) => x.concat(y), []) as any[];

        return measurements.reduce(
            (acc: { min: number; max: number }, measurement: any) => ({
                min: Math.min(acc.min, measurement.y),
                max: Math.max(acc.max, measurement.y),
            }),
            { min: measurements[0].y, max: measurements[0].y }
        );
    }

    /** Updates chart data. */
    protected abstract updateChartData(): void;

    protected abstract buildChart(): void;
}
