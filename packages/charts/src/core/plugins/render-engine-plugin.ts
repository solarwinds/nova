import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CHART_VIEW_STATUS_EVENT, INTERACTION_DATA_POINTS_EVENT, INTERACTION_VALUES_EVENT } from "../../constants";
import { ChartPlugin } from "../common/chart-plugin";
import { RenderEngine } from "../common/render-engine";
import { IChartEvent, IChartViewStatusEventPayload, IInteractionDataPointsEvent, IRendererEventPayload } from "../common/types";

import { IInteractionValuesPayload } from "./types";

/** @ignore */
export class RenderEnginePlugin extends ChartPlugin {

    private renderEngine: RenderEngine;
    // initializing isChartInView to true to ensure emission of initial data point events
    private isChartInView = true;
    private lastInteractionValuesPayload: IInteractionValuesPayload;
    private destroy$ = new Subject();

    public initialize(): void {
        this.renderEngine = this.chart.getRenderEngine();

        this.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                this.lastInteractionValuesPayload = event.data;
                if (this.isChartInView) {
                    this.chart.getRenderEngine().emitInteractionDataPoints(this.lastInteractionValuesPayload);
                }
            });

        this.renderEngine.interactionDataPointsSubject.pipe(takeUntil(this.destroy$)).subscribe((event: IInteractionDataPointsEvent) => {
            this.chart.getEventBus().getStream(INTERACTION_DATA_POINTS_EVENT).next({ data: event });
        });

        this.renderEngine.rendererSubject.pipe(takeUntil(this.destroy$)).subscribe((event: IRendererEventPayload) => {
            this.chart.getEventBus().getStream(event.eventName).next({ data: event.data });
        });

        this.chart.getEventBus().getStream(CHART_VIEW_STATUS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IChartViewStatusEventPayload>) => {
                this.isChartInView = event.data.isChartInView;
                if (this.isChartInView && this.lastInteractionValuesPayload) {
                    this.chart.getRenderEngine().emitInteractionDataPoints(this.lastInteractionValuesPayload);
                }
            });
    }

    public update(): void {
        this.renderEngine.updateSeriesContainers();
        this.renderEngine.update();
    }

    public updateDimensions(): void {
        this.renderEngine.update();
    }

    public destroy(): void {
        this.renderEngine.destroy();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
