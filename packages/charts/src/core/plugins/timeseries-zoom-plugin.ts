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

import { BrushBehavior, BrushSelection, brushX } from "d3-brush";
import debounce from "lodash/debounce";
import defaultsDeep from "lodash/defaultsDeep";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import moment from "moment/moment";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    INTERACTION_COORDINATES_EVENT,
    INTERACTION_VALUES_EVENT,
    STANDARD_RENDER_LAYERS,
} from "../../constants";
import { RenderLayerName } from "../../renderers/types";
import { ChartPlugin } from "../common/chart-plugin";
import { IScale } from "../common/scales/types";
import { D3Selection, IChartEvent, InteractionType } from "../common/types";
import { XYGrid } from "../grid/xy-grid";
import { UtilityService } from "../public-api";
import { TimeseriesZoomPluginsSyncService } from "./timeseries-zoom-plugin-sync.service";
import { IInteractionCoordinatesPayload } from "./types";

export interface ITimeseriesZoomPluginConfig {
    collectionId?: string;
    enableExternalEvents?: boolean;
}
export interface ITimeseriesZoomPluginInspectionFrame {
    startDate: moment.Moment | undefined;
    endDate: moment.Moment | undefined;
}

export class TimeseriesZoomPlugin extends ChartPlugin {
    public static LAYER_NAME = "timeseries-zoom-brush";
    public static readonly DEFAULT_CONFIG: ITimeseriesZoomPluginConfig = {
        enableExternalEvents: true,
        collectionId: "",
    };
    private grid: XYGrid;
    private brush: BrushBehavior<any>;
    private zoomBrushLayer: D3Selection;
    private brushElement: D3Selection<SVGGElement>;
    private destroy$ = new Subject<void>();
    private interactionHandlerMap: Record<string, Function>;
    private xScale: IScale<any>;

    private brushStartXCoord?: number;
    private brushEndXCoord?: number;
    private brushStartXDate?: moment.Moment;
    private brushEndXDate?: moment.Moment;

    private isChartHoverd = false;
    private isPopoverDisplayed = false;

    private zoomLineLayer: D3Selection<SVGElement>;

    private readonly openPopoverSubject = new Subject<number>();
    public readonly openPopover$ = this.openPopoverSubject
        .asObservable()
        .pipe(takeUntil(this.destroy$));

    private readonly closePopoverSubject = new Subject<void>();
    public readonly closePopover$ = this.closePopoverSubject
        .asObservable()
        .pipe(takeUntil(this.destroy$));

    private readonly zoomCreatedSubject = new Subject<void>();
    public readonly zoomCreated$ = this.zoomCreatedSubject
        .asObservable()
        .pipe(takeUntil(this.destroy$));

    private resizeHandler = debounce(() => {
        if (
            isUndefined(this.brushStartXDate) ||
            isUndefined(this.brushEndXDate)
        ) {
            return;
        }
        // makes sure that popover is closed while resizing
        this.moveBrushByDate(this.brushStartXDate, this.brushEndXDate);
        this.closePopover();
    }, 10);

    constructor(
        public config: ITimeseriesZoomPluginConfig = {},
        private syncService?: TimeseriesZoomPluginsSyncService
    ) {
        super();
        this.config = defaultsDeep(
            this.config,
            TimeseriesZoomPlugin.DEFAULT_CONFIG
        );
        // registers handlers
        this.interactionHandlerMap = {
            [InteractionType.MouseDown]: this.onBrushStart,
            [InteractionType.MouseMove]: this.onBrushMove,
            [InteractionType.MouseUp]: this.onBrushEnd,
        };

        if (this.config.collectionId) {
            this.syncService?.registerPlugin(this.config.collectionId, this);
        }
    }

    public initialize(): void {
        this.grid = this.chart.getGrid() as XYGrid;
        this.zoomBrushLayer = this.grid.getLasagna().addLayer({
            name: TimeseriesZoomPlugin.LAYER_NAME,
            // add 1 to the foreground layer's order to ensure the brush is rendered in front of it
            order: STANDARD_RENDER_LAYERS[RenderLayerName.foreground].order + 1,
            clipped: true,
        });

        this.zoomLineLayer = this.chart.getGrid().getLasagna().addLayer({
            name: "zoom-interaction-line",
            order: 900,
            clipped: true,
        });

        this.chart
            .getEventBus()
            .getStream(INTERACTION_COORDINATES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((chartEvent: IChartEvent) => {
                if (chartEvent.broadcast && !this.config.enableExternalEvents) {
                    return;
                }

                const data: IInteractionCoordinatesPayload = chartEvent.data;
                if (isEmpty(this.grid.scales) || isEmpty(data.coordinates)) {
                    return;
                }

                if (this.interactionHandlerMap[data.interactionType]) {
                    const xCoord = data.coordinates && data.coordinates.x;
                    const yCoord = data.coordinates && data.coordinates.y;
                    this.interactionHandlerMap[data.interactionType](
                        xCoord,
                        yCoord
                    );
                }
            });

        this.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                // detects hovering on different charts and closes popover
                if (event.data.values?.x) {
                    const chartGrid = this.grid;
                    const eventXAxisIds = Object.keys(event.data.values.x);
                    const chartLeftXAxis = chartGrid.scales.x.list[0];
                    // shows popover only for a chart that is currently being hovered
                    if (
                        chartLeftXAxis.isTimeseriesScale &&
                        !eventXAxisIds.includes(chartLeftXAxis.id)
                    ) {
                        this.isChartHoverd = false;
                        this.closePopover();
                    } else {
                        this.isChartHoverd = true;
                    }
                }
            });

        this.brush = brushX();
        this.brushElement = this.zoomBrushLayer
            .append("g")
            .attr("class", "brush");

        // engage pointer capture to confine mouse events to the interactive area
        // (in other words, if the 'mouseup' is physically triggered outside the interactive area,
        // the pointer capture allows us to still zoom based on that event)
        this.chart
            .getGrid()
            .getInteractiveArea()
            .on("pointerdown", (event) =>
                event.target.setPointerCapture(event.pointerId)
            )
            .on("pointerup", (event) =>
                event.target.releasePointerCapture(event.pointerId)
            );
    }

    public updateDimensions(): void {
        const dimension = this.grid?.config()?.dimension;
        if (this.grid) {
            this.xScale = find(this.grid.scales["x"].index, {
                id: this.grid.bottomScaleId,
            }) as IScale<any>;
        }

        if (!dimension) {
            return;
        }

        // set the brush area's dimensions
        this.brush.extent([
            [0, 0],
            [dimension.width(), dimension.height()],
        ]);

        // render the brush area after we have dimensions
        this.brush(this.zoomBrushLayer.select(".brush"));

        // prevent the brush from handling its own pointer events
        this.brushElement.select(".overlay").style("pointer-events", "none");

        // remove stroke per mockups
        this.brushElement.select(".selection").attr("stroke", null);

        // makes sure that zoom brush gets correctly resized when chart's dimension changes
        this.resizeHandler();
    }

    public destroy(): void {
        if (this.config.collectionId) {
            this.syncService?.removePlugin(this.config.collectionId, this);
        }

        this.clearBrush();

        this.grid.getLasagna().removeLayer(TimeseriesZoomPlugin.LAYER_NAME);
        this.destroy$.next();
        this.destroy$.complete();
    }

    public showPopover(): void {
        if (
            !this.isChartHoverd ||
            this.isPopoverDisplayed ||
            (isUndefined(this.brushStartXCoord) &&
                isUndefined(this.brushEndXCoord))
        ) {
            return;
        }
        this.isPopoverDisplayed = true;
        this.openPopoverSubject.next(this.brushEndXCoord);
    }

    public closePopover(): void {
        if (!this.isPopoverDisplayed) {
            return;
        }
        this.isPopoverDisplayed = false;
        this.closePopoverSubject.next();
    }

    public moveBrushByDate(
        startDate: moment.Moment,
        endDate: moment.Moment
    ): void {
        const startXCoord = this.xScale.convert(startDate);
        const endXCoord = this.xScale.convert(endDate);

        // brush is already in the correct position
        if (
            this.brushStartXCoord === startXCoord &&
            this.brushEndXCoord === endXCoord
        ) {
            return;
        }

        // in case brush doesn't exist yet
        if (
            isUndefined(this.brushStartXCoord) &&
            isUndefined(this.brushStartXCoord)
        ) {
            this.createBrushWithoutDrag(startXCoord, endXCoord);
            return;
        }

        this.moveBrush(startDate, endDate, startXCoord, endXCoord);
    }

    public moveBrushByCoord(
        startX: number | undefined,
        endX: number | undefined
    ): void {
        if (isUndefined(startX) || isUndefined(endX)) {
            return;
        }

        // brush is already in the correct position
        if (startX === this.brushStartXCoord && endX === this.brushEndXCoord) {
            return;
        }

        // in case brush doesn't exist yet
        if (
            isUndefined(this.brushStartXCoord) &&
            isUndefined(this.brushEndXCoord)
        ) {
            this.createBrushWithoutDrag(startX, endX);
            return;
        }

        const startDate = this.getDateFromCoord(startX);
        const endDate = this.getDateFromCoord(endX);

        this.moveBrush(startDate, endDate, startX, endX);
    }

    public clearBrush(): void {
        this.brush.move(this.brushElement, null);
        this.zoomLineLayer
            .selectAll("." + TimeseriesZoomPlugin.LAYER_NAME)
            .remove();

        this.brushEndXCoord = undefined;
        this.brushStartXCoord = undefined;
        this.brushStartXDate = undefined;
        this.brushEndXDate = undefined;

        this.closePopover();
    }

    public getInspectionFrame(): ITimeseriesZoomPluginInspectionFrame {
        return {
            startDate: this.brushStartXDate,
            endDate: this.brushEndXDate,
        };
    }

    private getDateFromCoord(xCoord: number): moment.Moment {
        const xScaleValue = UtilityService.getScaleValues(
            [this.xScale],
            xCoord
        );
        return moment(
            UtilityService.getInteractionValues(xScaleValue, this.xScale.id)
        );
    }

    private addZoomBoundaryLine(xDate: moment.Moment, xCoord: number): void {
        const line = this.zoomLineLayer
            .selectAll(TimeseriesZoomPlugin.LAYER_NAME)
            .data([xDate]);

        const attrs = {
            class: TimeseriesZoomPlugin.LAYER_NAME,
            x1: xCoord,
            y1: 0,
            x2: xCoord,
            y2: this.chart.getGrid().config().dimension.height(),
        };

        line.enter()
            .append("line")
            .merge(line as any)
            .attrs(attrs);

        line.exit().remove();
    }

    private onBrushStart = (xCoord: number) => {
        if (!isUndefined(this.brushStartXCoord)) {
            // brush already exist, clear first
            this.clearBrush();
        }

        this.brushStartXCoord = xCoord;
        this.brushStartXDate = this.getDateFromCoord(xCoord);
        this.addZoomBoundaryLine(this.brushStartXDate, this.brushStartXCoord);
    };

    // event that is triggered when hovering over chart
    private onBrushMove = (xCoord: number) => {
        if (isUndefined(this.brushStartXCoord)) {
            return;
        }

        if (isUndefined(this.brushEndXCoord)) {
            const selection = [this.brushStartXCoord, xCoord].sort(
                (a, b) => a - b
            );
            this.brush.move(this.brushElement, selection as BrushSelection);
        }

        // if the zoom brush is displayed, shows and hides the popover when hovering over zoom area
        if (
            !isUndefined(this.brushStartXCoord) &&
            !isUndefined(this.brushEndXCoord)
        ) {
            if (
                xCoord >= this.brushStartXCoord &&
                xCoord <= this.brushEndXCoord
            ) {
                this.showPopover();
            } else {
                this.closePopover();
            }
        }
    };

    private onBrushEnd = (xCoord: number) => {
        if (isUndefined(this.brushStartXCoord)) {
            return;
        }

        const date = this.getDateFromCoord(xCoord);
        this.addZoomBoundaryLine(date, xCoord);

        if (this.brushStartXCoord > xCoord) {
            // updates position incase dragging from right to left
            this.brushEndXCoord = this.brushStartXCoord;
            this.brushStartXCoord = xCoord;

            this.brushEndXDate = this.brushStartXDate;
            this.brushStartXDate = date;
        } else {
            this.brushEndXCoord = xCoord;
            this.brushEndXDate = date;
        }

        if (this.isChartHoverd) {
            this.zoomCreatedSubject.next();
        }
    };

    // simulates creating brash with mouse dragging
    private createBrushWithoutDrag(startX: number, endX: number): void {
        this.brushStartXCoord = startX;
        this.brushEndXCoord = endX;
        this.brushStartXDate = this.getDateFromCoord(startX);
        this.brushEndXDate = this.getDateFromCoord(endX);

        this.brush.move(this.brushElement, [startX, endX]);
        this.addZoomBoundaryLine(this.brushStartXDate, this.brushStartXCoord);
        this.addZoomBoundaryLine(this.brushEndXDate, this.brushEndXCoord);
    }

    private moveBrush(
        startDate: moment.Moment,
        endDate: moment.Moment,
        startXCoord: number,
        endXCoord: number
    ): void {
        const nodes = this.zoomLineLayer
            .selectAll("." + TimeseriesZoomPlugin.LAYER_NAME)
            .nodes() as Element[];
        if (nodes.length !== 2) {
            return;
        }

        // moves boundary lines
        nodes[0].setAttribute("x1", startXCoord.toString());
        nodes[0].setAttribute("x2", startXCoord.toString());
        nodes[1].setAttribute("x1", endXCoord.toString());
        nodes[1].setAttribute("x2", endXCoord.toString());

        // moves brush
        this.brush.move(this.brushElement, [
            startXCoord,
            endXCoord,
        ] as BrushSelection);

        this.brushStartXCoord = startXCoord;
        this.brushStartXDate = startDate;
        this.brushEndXCoord = endXCoord;
        this.brushEndXDate = endDate;
    }
}
