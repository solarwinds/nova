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

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    CHART_VIEW_STATUS_EVENT,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../constants";
import { ChartPlugin } from "../common/chart-plugin";
import { RenderEngine } from "../common/render-engine";
import {
    IChartEvent,
    IChartViewStatusEventPayload,
    IInteractionDataPointsEvent,
    IRendererEventPayload,
} from "../common/types";
import { IInteractionValuesPayload } from "./types";

/** @ignore */
export class RenderEnginePlugin extends ChartPlugin {
    private renderEngine: RenderEngine;
    // initializing isChartInView to true to ensure emission of initial data point events
    private isChartInView = true;
    private lastInteractionValuesPayload: IInteractionValuesPayload;
    private destroy$ = new Subject<void>();

    public initialize(): void {
        this.renderEngine = this.chart.getRenderEngine();

        this.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                this.lastInteractionValuesPayload = event.data;
                if (this.isChartInView) {
                    this.chart
                        .getRenderEngine()
                        .emitInteractionDataPoints(
                            this.lastInteractionValuesPayload
                        );
                }
            });

        this.renderEngine.interactionDataPointsSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IInteractionDataPointsEvent) => {
                this.chart
                    .getEventBus()
                    .getStream(INTERACTION_DATA_POINTS_EVENT)
                    .next({ data: event });
            });

        this.renderEngine.rendererSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IRendererEventPayload) => {
                this.chart
                    .getEventBus()
                    .getStream(event.eventName)
                    .next({ data: event.data });
            });

        this.chart
            .getEventBus()
            .getStream(CHART_VIEW_STATUS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IChartViewStatusEventPayload>) => {
                this.isChartInView = event.data.isChartInView;
                if (this.isChartInView && this.lastInteractionValuesPayload) {
                    this.chart
                        .getRenderEngine()
                        .emitInteractionDataPoints(
                            this.lastInteractionValuesPayload
                        );
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
