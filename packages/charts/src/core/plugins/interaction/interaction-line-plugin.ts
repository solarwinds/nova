import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    CHART_VIEW_STATUS_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../../constants";
import { ChartPlugin } from "../../common/chart-plugin";
import { IScale } from "../../common/scales/types";
import {
    D3Selection,
    IChartEvent,
    IChartViewStatusEventPayload,
    InteractionType,
} from "../../common/types";
import { XYGrid } from "../../grid/xy-grid";
import { IInteractionValuesPayload } from "../types";

/**
 * Draws a vertical line on the x-axis that corresponds to interaction position
 *
 * @class InteractionLinePlugin
 * @extends {ChartPlugin}
 */
export class InteractionLinePlugin extends ChartPlugin {
    public static LAYER_NAME = "interaction-line";

    private isChartInView = false;
    private lastInteractionValuesPayload: IInteractionValuesPayload;
    private interactionLineLayer: D3Selection<SVGElement>;
    private destroy$ = new Subject();

    public initialize(): void {
        this.interactionLineLayer = this.chart.getGrid().getLasagna().addLayer({
            name: "interaction-line",
            order: 900,
            clipped: true,
        });

        this.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                this.lastInteractionValuesPayload = event.data;
                if (this.isChartInView) {
                    this.handleLineUpdate();
                }
            });

        this.chart
            .getEventBus()
            .getStream(CHART_VIEW_STATUS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IChartViewStatusEventPayload>) => {
                this.isChartInView = event.data.isChartInView;
                if (this.isChartInView && this.lastInteractionValuesPayload) {
                    this.handleLineUpdate();
                }
            });
    }

    private handleLineUpdate() {
        const scales = this.chart.getGrid().scales;
        if (
            this.lastInteractionValuesPayload.interactionType !==
                InteractionType.MouseMove ||
            isEmpty(scales)
        ) {
            return;
        }

        const grid: XYGrid = <any>this.chart.getGrid();
        const xScale = find(scales["x"].index, { id: grid.bottomScaleId });

        if (!xScale) {
            throw new Error("xScale is not defined");
        }

        const xValue = this.lastInteractionValuesPayload.values.x
            ? this.lastInteractionValuesPayload.values.x[xScale.id]
            : null;
        this.updateLine(this.interactionLineLayer, xScale, xValue);
    }

    private updateLine(layer: D3Selection, xScale: IScale<any>, value: any) {
        const data = [];
        if (value) {
            data.push(value);
        }
        const line = layer
            .selectAll(`.${InteractionLinePlugin.LAYER_NAME}`)
            .data(data);

        const xFn = (d: any) => xScale.convert(d);
        const attrs = {
            class: InteractionLinePlugin.LAYER_NAME,
            x1: xFn,
            y1: 0,
            x2: xFn,
            y2: this.chart.getGrid().config().dimension.height(),
        };

        line.enter()
            .append("line")
            .merge(line as any)
            .attrs(attrs);

        line.exit().remove();
    }

    public destroy(): void {
        this.chart
            .getGrid()
            .getLasagna()
            .removeLayer(InteractionLinePlugin.LAYER_NAME);
        this.destroy$.next();
        this.destroy$.complete();
    }
}
