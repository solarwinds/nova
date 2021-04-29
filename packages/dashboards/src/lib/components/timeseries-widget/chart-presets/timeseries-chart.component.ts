import { Directive, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { IDataSource } from "@nova-ui/bits";
import { IXYScales } from "@nova-ui/charts";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { WellKnownDataSourceFeatures } from "../../../types";
import { TimeseriesScalesService } from "../timeseries-scales.service";
import {
    ITimeseriesOutput,
    ITimeseriesScalesConfig,
    ITimeseriesWidgetConfig,
    ITimeseriesWidgetSeriesData,
} from "../types";

@Directive()
export abstract class TimeseriesChartComponent<T = ITimeseriesWidgetSeriesData> implements OnChanges, OnDestroy {

    @Input() public widgetData: ITimeseriesOutput<T> = {} as ITimeseriesOutput<T>;
    @Input() public configuration: ITimeseriesWidgetConfig = {} as ITimeseriesWidgetConfig;

    protected scales: IXYScales = {} as IXYScales;
    protected destroy$ = new Subject<void>();
    protected buildChart$ = new Subject<void>();
    protected resetChart = false;
    protected chartBuilt = false;

    public get seriesInteractive() {
        return this.configuration?.interaction === "series" ||
            this.dataSource?.features?.getFeatureConfig(WellKnownDataSourceFeatures.Interactivity)?.enabled;
    }

    protected constructor(public timeseriesScalesService: TimeseriesScalesService,
                          public dataSource: IDataSource) {
        this.buildChart$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.chartBuilt = true;
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        let shouldUpdateChart = false;
        let shouldRebuildChart = false;

        if (changes.configuration) {
            const configurationCurrent: ITimeseriesWidgetConfig = changes.configuration.currentValue;
            const configurationPrevious: ITimeseriesWidgetConfig = changes.configuration.previousValue;

            if (configurationCurrent?.preset !== configurationPrevious?.preset) {
                shouldRebuildChart = true;
            }

            if (configurationCurrent?.scales !== configurationPrevious?.scales) {
                for (const scaleKey of (Object.keys(configurationCurrent?.scales) as Array<keyof ITimeseriesScalesConfig>)) {
                    const scaleConfigCurrent = configurationCurrent?.scales?.[scaleKey];
                    const scaleConfigPrevious = configurationPrevious?.scales?.[scaleKey];

                    if (scaleConfigCurrent?.type !== scaleConfigPrevious?.type || !this.scales[scaleKey]) {
                        this.scales[scaleKey] = this.timeseriesScalesService.getScale(scaleConfigCurrent);
                        shouldUpdateChart = true;
                    } else if (scaleConfigCurrent?.properties !== scaleConfigPrevious?.properties) {
                        this.timeseriesScalesService.updateConfiguration(this.scales[scaleKey], scaleConfigCurrent);
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

    /** Updates chart data. */
    protected abstract updateChartData(): void;

    protected abstract buildChart(): void;

}
