import { ConnectedPosition } from "@angular/cdk/overlay";
import each from "lodash/each";
import pickBy from "lodash/pickBy";
import values from "lodash/values";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    CHART_VIEW_STATUS_EVENT,
    INTERACTION_DATA_POINTS_EVENT,
    SERIES_STATE_CHANGE_EVENT,
} from "../../../constants";
import { RenderState } from "../../../renderers/types";
import { ChartPlugin } from "../../common/chart-plugin";
import {
    IAccessors,
    IChartEvent,
    IChartSeries,
    IChartViewStatusEventPayload,
    IDataPoint,
    IDataPointsPayload,
    InteractionType,
    IPosition,
    IRenderStateData,
} from "../../common/types";

/** Position with extended information for positioning a tooltip */
export interface ITooltipPosition extends IPosition {
    overlayPositions: ConnectedPosition[];
}

/** How far away from the data point position will the tooltip be positioned */
export const TOOLTIP_POSITION_OFFSET = 10;

/** @ignore
 * Used for charts where tooltips should be placed aside of some vertical line */
export const getVerticalSetup = (offset: number): ConnectedPosition[] => [
    {
        originX: "end",
        originY: "top",
        overlayX: "start",
        overlayY: "center",
        offsetX: offset,
    },
    {
        originX: "start",
        originY: "center",
        overlayX: "end",
        overlayY: "center",
        offsetX: -offset,
    },
];

/** @ignore
 * Used for charts where tooltips should be placed aligned to some horizontal line (as Horizontal Bar Charts) */
export const getHorizontalSetup = (offset: number): ConnectedPosition[] => [
    {
        originX: "end",
        originY: "top",
        overlayX: "center",
        overlayY: "bottom",
        offsetY: -offset,
    },
    {
        originX: "end",
        originY: "bottom",
        overlayX: "center",
        overlayY: "top",
        offsetY: offset,
    },
];

/**
 * This plugin listens to the INTERACTION_DATA_POINTS_EVENT and transforms received data into tooltips inputs.
 * The actual tooltips are handled by the ChartTooltipsComponent.
 */
export class ChartTooltipsPlugin extends ChartPlugin {
    /** Highlighted data points received from the chart */
    public dataPoints: IDataPointsPayload;
    /** Calculated positions for the data point tooltips */
    public dataPointPositions: { [stringId: string]: ITooltipPosition } = {};

    /**
     * This publishes an event to show tooltips
     */
    public showSubject = new Subject();

    /**
     * This publishes an event to hide tooltips
     */
    public hideSubject = new Subject();

    protected overlaySetup: ConnectedPosition[];

    private isChartInView = false;
    private destroy$ = new Subject();
    private seriesVisibilityMap: Record<string, boolean> = {};

    /**
     * @param tooltipPositionOffset Offset of a tooltip from edge of a highlighted element
     * @param orientation
     */
    constructor(
        readonly tooltipPositionOffset: number = TOOLTIP_POSITION_OFFSET,
        public orientation: "right" | "top" = "right"
    ) {
        super();

        if (orientation === "right") {
            this.overlaySetup = getVerticalSetup(tooltipPositionOffset);
        } else if (orientation === "top") {
            this.overlaySetup = getHorizontalSetup(tooltipPositionOffset);
        }
    }

    public initialize(): void {
        this.chart
            .getEventBus()
            .getStream(INTERACTION_DATA_POINTS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                if (
                    event.data.interactionType === InteractionType.MouseMove &&
                    this.isChartInView
                ) {
                    const dataPoints: IDataPointsPayload =
                        event.data.dataPoints;
                    this.processHighlightedDataPoints(dataPoints);
                }
            });

        this.chart
            .getEventBus()
            .getStream(SERIES_STATE_CHANGE_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IRenderStateData[]>) => {
                event.data.forEach((series) => {
                    this.seriesVisibilityMap[series.seriesId] =
                        series.state !== RenderState.hidden;
                });
            });

        this.chart
            .getEventBus()
            .getStream(CHART_VIEW_STATUS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IChartViewStatusEventPayload>) => {
                this.isChartInView = event.data.isChartInView;
                if (!this.isChartInView) {
                    this.hideSubject.next();
                }
            });
    }

    public destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public processHighlightedDataPoints(dataPoints: IDataPointsPayload) {
        const validDataPoints = pickBy(
            dataPoints,
            (d: IDataPoint) =>
                d.index >= 0 &&
                d.position &&
                this.seriesVisibilityMap[d.seriesId] !== false
        );

        if (values(validDataPoints).length === 0) {
            this.hideSubject.next();
            return;
        }

        this.dataPoints = validDataPoints;
        const chartElement: any = this.chart.target?.node()?.parentNode; // the one above svg

        if (!chartElement) {
            throw new Error("Chart parent node is not defined");
        }

        const bbox = chartElement.getBoundingClientRect();
        const offsetParentBbox =
            chartElement.offsetParent.getBoundingClientRect();
        const chartPosition: IPosition = {
            x: bbox.left - offsetParentBbox.left,
            y: bbox.top - offsetParentBbox.top,
        };

        each(Object.keys(this.dataPoints), (seriesId) => {
            const dataPoint = this.dataPoints[seriesId];

            const chartSeries = this.chart
                .getDataManager()
                .getChartSeries(dataPoint.seriesId);
            const tooltipRelativePosition = this.getTooltipPosition(
                dataPoint,
                chartSeries
            );
            this.dataPointPositions[seriesId] = this.getAbsolutePosition(
                tooltipRelativePosition,
                chartPosition
            );
        });

        this.showSubject.next();
    }

    /**
     * Calculate tooltip position. Default implementation shows the tooltip on left / right with
     * @param dataPoint
     * @param chartSeries
     */
    protected getTooltipPosition(
        dataPoint: IDataPoint,
        chartSeries: IChartSeries<IAccessors>
    ): ITooltipPosition {
        if (!dataPoint.position) {
            throw new Error("Unable to get tooltip position");
        }

        return {
            x: dataPoint.position.x,
            y: dataPoint.position.y,
            height: dataPoint.position?.height || 1,
            width: dataPoint.position?.width || 1,
            overlayPositions: this.overlaySetup,
        };
    }

    /**
     * Converts the relative position within a chart into an absolute position on the screen
     *
     * @param relativePosition
     * @param chartPosition
     */
    protected getAbsolutePosition(
        relativePosition: ITooltipPosition,
        chartPosition: IPosition
    ): ITooltipPosition {
        return Object.assign({}, relativePosition, {
            x:
                chartPosition.x +
                this.chart.getGrid().config().dimension.margin.left +
                relativePosition.x,
            y:
                chartPosition.y +
                this.chart.getGrid().config().dimension.margin.top +
                relativePosition.y,
        });
    }
}
