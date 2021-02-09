import { ChangeDetectorRef, Inject, Injectable, OnChanges, OnDestroy, Optional } from "@angular/core";
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
    InteractionType,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_VALUES_EVENT,
    ISetDomainEventPayload,
    IValueProvider,
    IXYScales, Renderer,
    SequentialColorProvider,
    SET_DOMAIN_EVENT,
    ZoomPlugin
} from "@nova-ui/charts";
import { merge } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { LegendPlacement } from "../../../../components/types";
import { INTERACTION, SET_TIMEFRAME } from "../../../../services/types";
import { DATA_SOURCE, IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../../../types";
import { TimeseriesScalesService } from "../../timeseries-scales.service";
import { TimeseriesInteractionType } from "../../types";
import { TimeseriesChartComponent } from "../timeseries-chart.component";

@Injectable()
export abstract class XYChartComponent extends TimeseriesChartComponent
    implements OnChanges, OnDestroy, IHasChangeDetector {

    public chartAssist: ChartAssist;
    public valueAccessorKey: string = "y";

    protected renderer: Renderer<IAccessors>;
    protected accessors: IAccessors;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
                @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
                public timeseriesScalesService: TimeseriesScalesService,
                public changeDetector: ChangeDetectorRef) {
        super(timeseriesScalesService, dataSource);
    }

    protected abstract createAccessors(colorProvider: IValueProvider<string>): IAccessors;

    protected abstract createChartAssist(palette: ChartPalette): ChartAssist;

    public mapSeriesSet(data: any[], scales: IXYScales): IChartAssistSeries<IAccessors>[] {
        return data.map((series: any) => ({
            ...series,
            scales: scales,
            renderer: this.renderer,
            accessors: this.accessors,
        }));
    }

    /** Checks if legend should be shown. */
    public hasLegend(): boolean {
        return this.configuration.legendPlacement && this.configuration.legendPlacement !== LegendPlacement.None;
    }

    /** Checks if legend should be aligned to right. */
    public legendShouldBeAlignedRight(): boolean {
        return this.configuration.legendPlacement === LegendPlacement.Right;
    }

    public onLegendClick(legendSeries: IChartAssistSeries<IAccessors>, event: MouseEvent) {
        if (!this.seriesInteractive) {
            return;
        }
        const target = event.target as HTMLElement;
        if (target.classList.contains("description")) {
            this.eventBus.getStream(INTERACTION).next({
                payload: {
                    data: legendSeries,
                    interactionType: TimeseriesInteractionType.Series,
                },
            });
        }
    }

    /** Updates chart data. */
    protected updateChartData(): void {
        this.chartAssist.update(this.mapSeriesSet(this.widgetData.series, this.scales));
    }

    /**
     * Initialize chart
     */
    protected buildChart() {
        this.buildChart$.next();

        const colorProvider = (this.configuration.chartColors && this.configuration.chartColors?.length > 0)
            ? new SequentialColorProvider(this.configuration.chartColors)
            : defaultColorProvider();

        const palette = new ChartPalette(colorProvider);
        this.accessors = this.createAccessors(palette.standardColors);
        this.chartAssist = this.createChartAssist(palette);

        const chart = this.chartAssist.chart;
        if (this.configuration.enableZoom) {
            chart.addPlugin(new ZoomPlugin());
        }

        chart.getEventBus().getStream(SET_DOMAIN_EVENT)
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
        this.chartAssist.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT)
            .pipe(takeUntil(merge(this.destroy$, this.buildChart$)))
            .subscribe((values: IChartEvent) => {
                const payload: IInteractionDataPointsEvent = values.data;
                if (payload.interactionType === InteractionType.Click) {
                    this.eventBus.getStream(INTERACTION).next({
                        payload: {
                            data: payload.dataPoints as IDataPointsPayload,
                            interactionType: TimeseriesInteractionType.DataPoints,
                        },
                    });
                }
            });

        // interaction with values
        this.chartAssist.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT)
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

}
