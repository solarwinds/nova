import { ScaleLinear } from "d3-scale";
import { Selection } from "d3-selection";
import { ValueMap } from "d3-selection-multi";
import { StandardGaugeThresholdMarkerRadius } from "../../gauge/constants";

import { RenderState } from "../../renderers/types";
import { IGrid } from "../grid/types";

import { ChartPlugin } from "./chart-plugin";
import { DataManager } from "./data-manager";
import { EventBus } from "./event-bus";
import { RenderEngine } from "./render-engine";
import { Renderer } from "./renderer";
import { Scales } from "./scales/types";

/**
 * Short-form alias for the most commonly used generic D3 Selection type
 */
export type D3Selection<T extends SVGElement = SVGElement> = Selection<T, any, SVGElement, any>;

/**
 * Signature for data accessors
 *
 * @param d data point
 * @param i index
 * @param series the whole data series
 */
export type DataAccessor<D = any, T = any> = (d: D, i: number, series: D[], dataSeries: IDataSeries<IAccessors>) => T;

/**
 * Signature for series accessors
 */
export type SeriesAccessor = (seriesId: string, series: IDataSeries<IAccessors>) => any;

/** @ignore */
export interface ILasagnaLayer {
    name: string;
    order: number;
    clipped: boolean;
}

/** Mouse interaction types */
export enum InteractionType {
    /** Indicates that an element has been clicked */
    Click = "click",
    /** Indicates that an element is hovered */
    Hover = "hover",
    /** Indicates a 'mousedown' event */
    MouseDown = "mousedown",
    /** Indicates that the mouse has entered the bounds of an element */
    MouseEnter = "mouseenter",
    /** Indicates that the mouse has left the bounds of an element */
    MouseLeave = "mouseleave",
    /** Indicates a movement of the mouse across the chart */
    MouseMove = "mousemove",
    /** Indicates a 'mouseup' event */
    MouseUp = "mouseup",
}

/** @ignore */
export interface ICoordinates {
    x: number;
    y: number;
}

/** @ignore */
export interface IInteractionEvent {
    type: InteractionType;
    coordinates: ICoordinates;
}

/**
 * Information about the render state of a series
 */
export interface IRenderStateData {
    /** Series identifier */
    seriesId: string;
    /** Series render state */
    state: RenderState;
    /** Series */
    series?: IChartSeries<IAccessors>;
}

/** @ignore */
export interface IDomainLimits<T> {
    min: T;
    max: T;
}

export interface IRendererConfig {
    stateStyles?: Record<RenderState, ValueMap<any, any>>;
    transitionDuration?: number;
    interactive?: boolean;
    /** Excludes series from scale domain calculations */
    ignoreForDomainCalculation?: boolean;
}

export interface IRadialRendererConfig extends IRendererConfig {
    annularWidth?: number;
    annularPadding?: number;
    /** annularGrowth is a percentage value to define annular width automatically.
     *  It will grow until it reaches maxThickness.
     *  Set one to 0 to use annularWidth constant value instead */
    maxThickness?: number;
    annularGrowth?: number;
    cursor?: string;
    strokeWidth?: number;
    enableSeriesHighlighting?: boolean;
    enableDataPointHighlighting?: boolean;
}

/**
 * @ignore
 * Configuration for the DonutGaugeThresholdsRenderer
 */
export interface IDonutGaugeThresholdsRendererConfig extends IRadialRendererConfig {
    /** The radius of each threshold marker */
    markerRadius?: StandardGaugeThresholdMarkerRadius | number;
}

/**
 * @ignore
 * Configuration for the LinearGaugeThresholdsRenderer
 */
export interface ILinearGaugeThresholdsRendererConfig extends IRendererConfig {
    /** The radius of each threshold marker */
    markerRadius?: StandardGaugeThresholdMarkerRadius | number;
}

export interface ILinearScales {
    x: ScaleLinear<number, number>;
    y: ScaleLinear<number, number>;
}

export interface IDataAccessors<D = any> {
    [key: string]: DataAccessor<D> | undefined;
}

export interface ISeriesAccessors {
    [key: string]: SeriesAccessor | undefined;
}

/**
 * Accessors describe the data for the consumers.
 */
export interface IAccessors<D = any> {
    /** Data point level accessors for defining what part of a datum is used for visualizations */
    data?: IDataAccessors<D>;
    /** Series level accessors - e.g. for colors, markers, etc. */
    series?: ISeriesAccessors;
}

/**
 * A set of data to visualize on the chart
 */
export interface IDataSeries<A extends IAccessors<D>, D = any> {
    /** The series identifier */
    id: string;
    /**
     * The series data. It is an array of arbitrary objects, the structure of which is prescribed by the consumer of this data series. Specific
     * renderers require specific accessor keys that are used to access values on data points. The renderers and other consumers rarely access
     * data point properties directly, but usually through accessors.
     */
    data: D[];
    /** Accessors describing the data */
    accessors: A;

    /** Allow any properties to be stored on this object to facilitate the transfer of data from APIs */
    [key: string]: any;
}

/**
 * The set of elements required for a chart to visualize some data
 */
export interface IChartSeries<A extends IAccessors> extends IDataSeries<A> {
    /** The renderer to be used for visualizing the data */
    renderer: Renderer<A>;
    /**
     * Information about how chart data should conform to the drawable area.
     * Grids expect certain scale keys to be used depending on the type of grid, for example an x-y grid
     * uses 'x' and 'y' as the keys for its scales.
     */
    scales: Scales;

    renderState?: RenderState;
}

export interface IChartAssistSeries<A extends IAccessors> extends IChartSeries<A> {
    showInLegend?: boolean;
    preprocess?: boolean;
}

export interface IChartMarker {
    getSvg(): string;
    setColor(color: string): void;
}

export interface IChart {
    target?: D3Selection<SVGSVGElement>;
    getEventBus(): EventBus<IChartEvent>;
    getDataManager(): DataManager;
    getRenderEngine(): RenderEngine;
    getGrid(): IGrid;
    addPlugin(plugin: IChartPlugin): void;
    removePlugin?(classRef: typeof ChartPlugin): void;
    build(element: HTMLElement): void;
    update(seriesSet: IChartSeries<IAccessors>[]): void;
    updateDimensions(): void;
    setSeriesStates(renderStateData: IRenderStateData[]): void;
    destroy(): void;
}

/** @ignore */
export interface IChartComponent {
    chart: IChart;
}

/** Interface defining a chart plugin */
export interface IChartPlugin {
    /**
     * Associated chart - set automatically on chart initialization
     */
    chart: IChart;

    /** Initialize the plugin - Invoked automatically on chart initialization */
    initialize(): void;

    /** Update the plugin - Invoked automatically on chart update */
    update(): void;

    /** Update the plugin's dimensions - Invoked automatically on update of the chart's dimensions */
    updateDimensions(): void;

    /** Perform plugin cleanup - Invoked automatically on chart destruction */
    destroy(): void;
}

export interface IChartEvent<T = any> {
    broadcast?: boolean;
    data: T;
}

/** @ignore */
export interface IChartCollectionEvent {
    chartIndex: string;
    event: IChartEvent;
}

/**
 * Dictionary of render container name to render container
 */
export interface IRenderContainers {
    /** Container name as key to render container */
    [name: string]: D3Selection<SVGGElement>;
}

/**
 * Position on the chart
 */
export interface IPosition {
    x: number;
    y: number;
    width?: number;
    height?: number;
}

/**
 * A point at which a data series enters or exits a threshold zone
 */
export interface IZoneCrossPoint extends IPosition {
    /** Indicates whether the cross point is on the edge of a threshold zone */
    isZoneEdge?: boolean;
}

/**
 * Information about a data point
 */
export interface IDataPoint {
    /** Series identifier */
    seriesId: string;
    /** Series */
    dataSeries: IDataSeries<IAccessors>;
    /** Data index */
    index: number;
    /** Data */
    data: any;
    /** Position */
    position?: IPosition;
}

/**
 * Payload for the chart's visibility status in relation to the nearest scrollable parent
 */
export interface IChartViewStatusEventPayload {
    /**
     * Indicates whether at least one pixel of the chart's parent element has
     * intersected with the visible area of its nearest scrollable parent
     */
    isChartInView: boolean;
}

/**
 * Payload for events regarding a data point
 */
export interface IRendererEventPayload<T = any> {
    /** Name of the event */
    eventName: string;
    /** Information about the data point */
    data: T;
}

/**
 * Collection of one or more data points as a dictionary of seriesId to IDataPoint
 */
export interface IDataPointsPayload {
    /** Series id as key to highlighted data point */
    [seriesId: string]: IDataPoint;
}

/**
 * Payload for interaction events
 */
export interface IInteractionPayload {
    interactionType: InteractionType;
}

/**
 * Payload for interaction events regarding a single data point
 */
export interface IInteractionDataPointEvent extends IInteractionPayload {
    dataPoint: IDataPoint;
}

/**
 * Payload for axes style change when emphasizing series on grid
 */
export type IAxesStyleChangeEventPayload = Record<string, Record<string, any>>;

/**
 * Payload for interaction events regarding one or more data points
 */
export interface IInteractionDataPointsEvent extends IInteractionPayload {
    dataPoints: IDataPointsPayload;
}

export interface ISetDomainEventPayload {
    [scaleId: string]: any[];
}

export interface IValueProvider<T> {
    get(entityId: string): T | undefined;
    reset(): void;
}

export interface IChartPalette {
    readonly standardColors: IValueProvider<string>;
    readonly backgroundColors: IValueProvider<string>;
    readonly textColors: IValueProvider<string>;
}
