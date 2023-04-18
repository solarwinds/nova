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

import { CurveFactory } from "d3-shape";
import { Subject } from "rxjs";

import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import {
    D3Selection,
    IAccessors,
    IDataSeries,
    IRenderContainers,
    IRendererConfig,
    IRendererEventPayload,
} from "../core/common/types";
import { IRectangleAccessors } from "./accessors/rectangle-accessors";
import { BarRenderer } from "./bar/bar-renderer";
import { ILineAccessors } from "./line/line-accessors";
import { LineRenderer } from "./line/line-renderer";

export enum RenderState {
    hidden = "hidden",
    deemphasized = "deemphasized",
    emphasized = "emphasized",
    default = "default",
}

export enum RenderLayerName {
    background = "background",
    data = "data",
    unclippedData = "unclipped-data",
    foreground = "foreground",
}

/** The configuration interface for marker interaction */
export interface IMarkerInteractionConfig {
    /** Enables mouse events on data point markers */
    enabled: boolean;
    /** Enables the pointer style mouse cursor when data point markers are hovered */
    clickable?: boolean;
}

/** The configuration interface for the enhanced line caps */
export interface IEnhancedLineCapConfig {
    /** Set the stroke color */
    stroke?: string;
    /** Set the stroke width in pixels */
    strokeWidth?: number;
    /** Set the fill color */
    fill?: string;
    /** Set the radius in pixels */
    radius?: number;
}

/** The configuration interface for the line renderer */
export interface ILineRendererConfig extends IRendererConfig {
    /** Set the width of the line in pixels */
    strokeWidth?: number;
    /** Set the stroke-dasharray of the line, e.g. "1,1", "2,2", etc. */
    strokeStyle?: string;
    /** Set the stroke-linecap of the line, e.g. "round" */
    strokeLinecap?: string;
    /** Set the d3 curve algorithm to be used for drawing the lines */
    curveType?: CurveFactory;
    /** Set the strategy for determining the behavior of the chart resulting from user interaction, e.g. LineSelectSeriesInteractionStrategy */
    interactionStrategy?: IHighlightStrategy<ILineAccessors, LineRenderer>;
    /** Configure the interaction behavior for markers */
    markerInteraction?: IMarkerInteractionConfig;
    /** Set whether enhanced line caps should be displayed */
    useEnhancedLineCaps?: boolean;
    /** Optionally configure enhanced line caps. Prerequisite: 'useEnhancedLineCaps' is set to true */
    enhancedLineCap?: IEnhancedLineCapConfig;
}

/** The configuration interface for the bar renderer */
export interface IBarRendererConfig extends IRendererConfig {
    /** Set the padding on both sides of each bar */
    padding?: number;
    /** Set the class name to apply custom styles to the bars */
    barClass?: string;
    /** Set the strategy for determining the behavior of the chart resulting from user interaction, e.g. BarHighlightStrategy */
    highlightStrategy?: IHighlightStrategy<IRectangleAccessors, BarRenderer>;
    /** Set the mouse cursor style to use when hovering over individual bars */
    cursor?: string;
    /** Enables pointer events on the bars */
    pointerEvents?: boolean;
    /** Set the stroke width in pixels */
    strokeWidth?: number;
    /** Enable the minimum bar thickness (BarRenderer.MIN_BAR_THICKNESS) */
    enableMinBarThickness?: boolean;
}

/** The configuration interface for the area renderer */
export interface IAreaRendererConfig extends IRendererConfig {
    /** Set the d3 curve algorithm to be used for drawing the area boundaries */
    curveType?: CurveFactory;
    /** Set the class name to apply custom styles to the areas */
    areaClass?: string;
    /** Enables the pointer cursor when data point markers are hovered */
    markerInteraction?: IMarkerInteractionConfig;
    /** The width of the area path's stroke in pixels. Default is 1. */
    strokeWidth?: number;
}

export interface IRenderSeries<TA extends IAccessors> {
    dataSeries: IDataSeries<TA>;
    containers: IRenderContainers;
    scales: Scales;
    parentContainer?: D3Selection<SVGElement>;
}

export interface IHighlightStrategy<TA, T = Renderer<TA>> {
    getDataPointIndex(
        renderer: T,
        series: IDataSeries<TA>,
        values: { [p: string]: any },
        scales: Scales
    ): number;

    highlightDataPoint(
        renderer: T,
        renderSeries: IRenderSeries<TA>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void;

    draw(
        renderer: T,
        renderSeries: IRenderSeries<TA>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void;
}
