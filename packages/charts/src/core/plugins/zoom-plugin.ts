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
import { event } from "d3-selection";
import defaultsDeep from "lodash/defaultsDeep";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    INTERACTION_COORDINATES_EVENT,
    INTERACTION_VALUES_ACTIVE_EVENT,
    SET_DOMAIN_EVENT,
    STANDARD_RENDER_LAYERS,
} from "../../constants";
import { RenderLayerName } from "../../renderers/types";
import { ChartPlugin } from "../common/chart-plugin";
import { IScale } from "../common/scales/types";
import {
    D3Selection,
    IChartEvent,
    InteractionType,
    ISetDomainEventPayload,
} from "../common/types";
import { Grid } from "../grid/grid";
import { XYGrid } from "../grid/xy-grid";
import { IInteractionCoordinatesPayload } from "./types";

export interface IZoomPluginConfiguration {
    enableExternalEvents?: boolean;
}

export class ZoomPlugin extends ChartPlugin {
    // *Note:* This plugin manually moves the d3 brush across the screen to accommodate a known Firefox
    // bug in which mouse events report an incorrect pointer position for svg children of an element
    // transformed by a translate function: https://github.com/d3/d3-selection/issues/81

    public static LAYER_NAME = "zoom-brush";
    public static readonly DEFAULT_CONFIG: IZoomPluginConfiguration = {
        enableExternalEvents: false,
    };

    private grid: XYGrid;
    private brush: BrushBehavior<any>;
    private zoomBrushLayer: D3Selection;
    private brushElement: D3Selection<SVGGElement>;
    private readonly destroy$ = new Subject<void>();
    private brushStartX: number | undefined;
    private interactionHandlerMap: Record<string, Function>;

    constructor(public config: IZoomPluginConfiguration = {}) {
        super();
        this.config = defaultsDeep(this.config, ZoomPlugin.DEFAULT_CONFIG);
        this.interactionHandlerMap = {
            [InteractionType.MouseDown]: this.brushStart,
            [InteractionType.MouseMove]: this.brushMove,
            [InteractionType.MouseUp]: this.brushEnd,
        };
    }

    public initialize(): void {
        this.grid = this.chart.getGrid() as XYGrid;
        this.zoomBrushLayer = this.grid.getLasagna().addLayer({
            name: ZoomPlugin.LAYER_NAME,
            // add 1 to the foreground layer's order to ensure the brush is rendered in front of it
            order: STANDARD_RENDER_LAYERS[RenderLayerName.foreground].order + 1,
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
                    this.interactionHandlerMap[data.interactionType](xCoord);
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
            .on("pointerdown", () =>
                event.target.setPointerCapture(event.pointerId)
            )
            .on("pointerup", () =>
                event.target.releasePointerCapture(event.pointerId)
            );
    }

    public updateDimensions(): void {
        const dimension = this.grid.config().dimension;

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
    }

    public destroy(): void {
        this.grid.getLasagna().removeLayer(ZoomPlugin.LAYER_NAME);
        this.destroy$.next();
        this.destroy$.complete();
    }

    private brushStart = (xCoord: number) => {
        if (!isUndefined(this.brushStartX)) {
            return;
        }

        this.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_ACTIVE_EVENT)
            .next({ data: false });
        this.brushStartX = xCoord;
    };

    private brushMove = (xCoord: number) => {
        if (isUndefined(this.brushStartX)) {
            return;
        }

        const selection = [this.brushStartX, xCoord].sort((a, b) => a - b);
        this.brush.move(this.brushElement, selection as BrushSelection);
    };

    private brushEnd = (xCoord: number) => {
        if (isUndefined(this.brushStartX)) {
            return;
        }

        const selection = [this.brushStartX, xCoord].sort((a, b) => a - b);
        this.brushStartX = undefined;
        this.chart
            .getEventBus()
            .getStream(INTERACTION_VALUES_ACTIVE_EVENT)
            .next({ data: true });

        // remove the brush
        this.brush.move(this.brushElement, null);

        const xScales = this.grid.scales.x.list;
        if (!xScales || selection[0] === selection[1]) {
            return;
        }

        let widthCorrection = 0;
        const gridConfig = this.grid.config();
        if (
            !gridConfig.disableRenderAreaWidthCorrection &&
            selection[1] ===
                gridConfig.dimension.width() - Grid.RENDER_AREA_WIDTH_CORRECTION
        ) {
            // Width correction to accommodate similar adjustment in grid. This ensures that the right-most column of pixels on the chart is selectable.
            widthCorrection = Grid.RENDER_AREA_WIDTH_CORRECTION;
        }

        const data: ISetDomainEventPayload = xScales.reduce(
            (result, next: IScale<any>) => {
                result[next.id] = [
                    selection[0],
                    (selection[1] as number) + widthCorrection,
                ].map((x) => next.invert(x as number));
                return result;
            },
            <ISetDomainEventPayload>{}
        );

        // zoom the chart
        this.chart.getEventBus().getStream(SET_DOMAIN_EVENT).next({ data });
    };
}
