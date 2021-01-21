import { BaseType } from "d3";
import { Axis } from "d3-axis";
import { Selection } from "d3-selection";
import { Subject } from "rxjs";

import { Lasagna } from "../common/lasagna";
import { ScalesIndex } from "../common/scales/types";
import { D3Selection, IChart, IChartPlugin } from "../common/types";

/**
 * Interface for defining aspects of the top, right, bottom, and left sides of a grid
 */
export interface IAllAround<T> {
    /** Object defining aspects of the top of an entity */
    top: T;
    /** Object defining aspects of the right side of an entity */
    right: T;
    /** Object defining aspects of the bottom of an entity */
    bottom: T;
    /** Object defining aspects of the left side of an entity */
    left: T;
}

/**
 * The width and height of an grid
 */
export interface IDimensions {
    width: number;
    height: number;
}

/**
 * Configuration of grid dimensions
 */
export interface IDimensionConfig {
    /** The top, right, bottom, and left margin sizes in pixels */
    margin: IAllAround<number>;
    /** The top, right, bottom, and left padding sizes in pixels */
    padding: IAllAround<number>;
    /** Sets whether the grid uses the chart's container to determine its width */
    autoWidth: boolean;
    /** Sets whether the grid uses the chart's container to determine its height */
    autoHeight: boolean;
    /**
     * Sets the grid's width. Note: 'autoWidth' must be set to false for this setting to have an effect.
     *
     * @param {number} value The new grid width
     * @returns {IDimensionConfig} The resulting dimension config
     */
    width(value: number): IDimensionConfig;
    /**
     * Gets the grid's width -- excluding margins.
     *
     * @returns {number} The grid's width
     */
    width(): number;
    /**
     * Sets the grid's height. Note: 'autoHeight' must be set to false for this setting to have an effect.
     *
     * @param {number} value The new grid height
     * @returns {IDimensionConfig} The resulting dimension config
     */
    height(value: number): IDimensionConfig;
    /**
     * Gets the grid's height -- excluding margins.
     *
     * @returns {number} The grid's height
     */
    height(): number;
    /**
     * Sets the grid's width by subtracting the grid's horizontal margins from the specified value.
     * Note: 'autoWidth' must be set to false for this setting to have an effect.
     *
     * @param {number} value The new width plus the grid's horizontal margins
     * @returns {IDimensionConfig} The resulting dimension config
     */
    outerWidth(value: number): IDimensionConfig;
    /**
     * Gets the grid's width -- including horizontal margins.
     *
     * @returns {number} The grid's width plus horizontal margins
     */
    outerWidth(): number;
    /**
     * Sets the grid's height by subtracting the grid's vertical margins from the specified value.
     * Note: 'autoWidth' must be set to false for this setting to have an effect.
     *
     * @param {number} value The new height plus the grid's vertical margins     *
     * @returns {IDimensionConfig} The resulting dimension config
     */
    outerHeight(value: number): IDimensionConfig;
    /**
     * Gets the grid's height -- including vertical margins.
     *
     * @returns {number} The grid's height plus vertical margins
     */
    outerHeight(): number;
}

/**
 * Interface for defining the SVGElements forming the top, right, bottom, and left borders of an entity
 */
export interface IBorders extends IAllAround<SVGElement> {
}

/**
 * Configuration of grid borders
 */
export interface IBorderConfig {
    /** The stroke color */
    color?: string;
    /** The thickness of the border */
    width?: number;
    /** The class name */
    className?: string;
    /** Boolean indicating whether the border should be visible */
    visible?: boolean;
}

export interface ITextOverflowArgs {
    widthLimit: number;
    horizontalPadding: number;
    ellipsisWidth: number;
}

/** Type for tick overflow handler */
export type TextOverflowHandler = (textSelection: Selection<BaseType, unknown, null, undefined>, args: ITextOverflowArgs) => void;

/** Interface representing the configuration for tick labels */
export interface ITickLabelConfig {
    /**
     * Padding for left and right sides of label used for calculating text overflow limits
     * (number represents the padding on each side)
     */
    horizontalPadding: number;
    /** Handler for text overflow. Set to 'undefined' to disable overflow handling */
    overflowHandler?: TextOverflowHandler;
    maxWidth?: number;
}

/** Configuration of a grid axis */
export interface IAxisConfig {
    /** Boolean indicating whether the axis should be visible */
    visible: boolean;
    /** The approximate number of ticks to display */
    approximateTicks: number;
    /** Boolean indicating whether grid ticks should be displayed */
    gridTicks: boolean;
    /** The length of the ticks in pixels */
    tickSize: number;
    /** Configuration for the tick labels */
    tickLabel: ITickLabelConfig;
    /** Sets whether to fit the grid margins to the axis labels */
    fit: boolean;
    /** Sets the axis padding */
    padding: number;
}

/**
 * Basic grid configuration
 */
export interface IGridConfig {
    /** Boolean indicating whether the grid will respond to mouse events */
    interactive: boolean;
    /** Configuration for the grid's dimensions */
    dimension: IDimensionConfig;
    /** Configuration for the grid's borders */
    borders: IAllAround<IBorderConfig>;
    /** String indicating the desired cursor style */
    cursor: string;
}

/**
 * Configuration for an XYGrid
 */
export interface IXYGridConfig extends IGridConfig {
    /** The IAllAround value for the grid's axis configurations */
    axis: IAllAround<IAxisConfig>;

    /**
     * Add interaction line and label plugins automatically
     * Note: This was added to prevent a breaking change. We should avoid this kind of option in future
     * versions of IXYGridConfig because ideally all plugins should be added manually (NUI-3304).
     */
    interactionPlugins: boolean;
}

/**
 * The basic interface for a grid's dimensions, scaling, interaction, and borders
 *
 * @interface
 */
export interface IGrid {
    /** The grid scales
     *
     * @type {ScalesIndex}
     */
    scales: ScalesIndex;

    /**
     * Subject for indicating that the chart's dimensions should be updated
     */
    updateChartDimensionsSubject?: Subject<void>;

    /**
     * Provides access to the grid's layering mechanism
     *
     * @returns {Lasagna} The grid's layering mechanism
     */
    getLasagna(): Lasagna;

    /**
     * Provides access to the grid's interactive area
     *
     * @returns {D3Selection} The grid's interactive area
     */
    getInteractiveArea(): D3Selection<SVGRectElement>;

    /**
     * getter for the grid's target d3 selection
     *
     * @returns {D3Selection} The grid's target d3 selection
     */
    target(): D3Selection<SVGSVGElement>;

    /**
     * setter for the grid's target d3 selection
     *
     * @param {D3Selection} [target] The grid's new target d3 selection
     * @returns {IGrid} The grid instance
     */
    target(target: D3Selection<SVGSVGElement>): IGrid;
    target(target: D3Selection<SVGSVGElement>): D3Selection<SVGSVGElement> | IGrid;

    /**
     * getter for the grid configuration
     *
     * @returns {IGridConfig} The grid configuration
     */
    config(): IGridConfig;

    /**
     * setter for the grid configuration
     *
     * @param {IGridConfig} config The new grid configuration
     * @returns {this} The grid instance
     */
    config(config: IGridConfig): this;

    /**
     * Builds the grid's rendered elements
     *
     * @returns {IGrid} The grid instance
     */
    build(): IGrid;

    /**
     * Updates the grid's rendered elements based on the current scales and configuration
     *
     * @returns {IGrid} The grid instance
     */
    update(): IGrid;

    /**
     * Updates the grid's dimensions as specified
     *
     * @param {Partial<IDimensions>} dimensions The new grid dimensions
     * @returns {IGrid} The grid instance
     */
    updateDimensions(dimensions: Partial<IDimensions>): IGrid;

    /**
     * Updates the ranges on the grid's scales based on the grid's configured dimensions
     *
     * @returns {IGrid} The grid instance
     */
    updateRanges(): IGrid;

    /**
     * Builds the grid's plugins
     *
     * @returns {IChartPlugin[]} The set of generated plugins
     */
    buildPlugins(chart: IChart): IChartPlugin[];
}

/**
 * Interface for a d3 axis entity
 */
export interface IAxis {
    /** The d3 group element for the axis label */
    labelGroup: D3Selection<SVGGElement>;
    /** The d3 group element for the axis ticks */
    tickGroup: D3Selection<SVGGElement>;
    /** The d3 group element for the axis */
    group: D3Selection<SVGGElement>;
    /** The d3 axis */
    axis: Axis<any>;
}
