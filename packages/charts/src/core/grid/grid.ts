import { select, Selection } from "d3-selection";
import each from "lodash/each";
import isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";

import { Lasagna } from "../common/lasagna";
import { ScalesIndex } from "../common/scales/types";
import { IChart, IChartPlugin } from "../common/types";
import { D3Selection } from "../common/types";
import { UtilityService } from "../common/utility.service";

import { GridConfig } from "./config/grid-config";
import { IAllAround, IBorderConfig, IBorders, IDimensions, IGrid, IGridConfig } from "./types";

export const borderMidpoint = 0.5;

type BorderKey = keyof IAllAround<IBorderConfig>;

/**
 * @implements {IGrid}
 * Implementation for the dimensions, scaling, interactive area, and borders of a basic grid
 */
export abstract class Grid implements IGrid {
    /** Class name for the grid */
    public static GRID_CLASS_NAME = "nui-chart-grid";

    /** Class name applied to each of the grid's borders by default */
    public static DEFAULT_BORDER_CLASS_NAME = "nui-chart-border";

    /** Prefix applied to the rendering area clip path id */
    public static RENDERING_AREA_CLIP_PATH_PREFIX = "clip-path_";

    /** Name for the lasagna layer containing the grid's rendered elements */
    public static GRID_ELEMENTS_LAYER_NAME = "grid-elements";

    /** Name for the rendering area lasagna layer */
    public static RENDERING_AREA_LAYER_NAME = "rendering-area";

    /** @ignore Height correction needed to prevent interaction gap between vertically stacked charts */
    public static RENDER_AREA_HEIGHT_CORRECTION = 1;

    /** @ignore Width correction needed to prevent interaction gap between right side of grid and the edge of the rendering area */
    public static RENDER_AREA_WIDTH_CORRECTION = 1;

    /** @ignore Width correction needed to sync bottom border length and grid width to tick placement */
    public static TICK_DIMENSION_CORRECTION = 1;

    /** Subject for indicating that the chart's dimensions should be updated */
    public updateChartDimensionsSubject: Subject<void>;

    /** d3 container for the grid */
    protected container: D3Selection<SVGGElement>;

    /** d3 selection for the grid's rendering area clip path */
    protected renderingAreaClipPath: D3Selection<SVGRectElement>;

    /** d3 selection for the grid's rendering area */
    protected renderingArea: D3Selection<SVGRectElement>;

    /** d3 selection for the grid's interactive area */
    protected interactiveArea: D3Selection<SVGRectElement>;

    /** The grid's layer manager */
    protected lasagna: Lasagna;

    /** Lasagna layer for the grid's rendered elements */
    protected gridElementsLayer: Selection<SVGElement, any, SVGElement, any>;

    /** Definition of the grid's borders as rendered */
    protected borders: Partial<IBorders> = {};

    /** Property value of the grid's scales */
    protected _scales: ScalesIndex;

    /** Property value of the grid's configuration */
    protected _config: IGridConfig;

    /** Property value of the grid's target d3 selection */
    protected _target: D3Selection<SVGSVGElement>;


    /** See {@link IGrid#getInteractiveArea} */
    public getInteractiveArea(): D3Selection<SVGRectElement> {
        return this.interactiveArea;
    }

    /** See {@link IGrid#getLasagna} */
    public getLasagna(): Lasagna {
        return this.lasagna;
    }

    /** @ignore */
    public set scales(scales: ScalesIndex) {
        this._scales = scales;
    }

    /** @ignore */
    public get scales(): ScalesIndex {
        return this._scales;
    }

    /** See {@link IGrid#config} */
    public config(): IGridConfig;
    /** See {@link IGrid#config} */
    public config(config: IGridConfig): this;
    /** See {@link IGrid#config} */
    public config(config?: IGridConfig): IGridConfig | this {
        if (config === undefined) {
            return this._config;
        }
        this._config = config;
        return this;
    }

    /** See {@link IGrid#target} */
    public target(): D3Selection<SVGSVGElement>;
    /** See {@link IGrid#target} */
    public target(target: D3Selection<SVGSVGElement>): IGrid;
    /** See {@link IGrid#target} */
    public target(target?: D3Selection<SVGSVGElement>): D3Selection<SVGSVGElement> | IGrid {
        if (target === undefined) {
            return this._target;
        }
        this._target = target;
        return this;
    }

    /** See {@link IGrid#build} */
    public build(): IGrid {
        if (!this.config()) {
            const config = new GridConfig();
            this.config(config);
        }

        this.container = this._target.append("g")
            .attrs({
                "class": Grid.GRID_CLASS_NAME,
            });

        const clipPathId = Grid.RENDERING_AREA_CLIP_PATH_PREFIX + UtilityService.uuid();
        // Asserting similar type to avoid refactoring all the grids
        // TODO: Refactor lasagna service to accept multiple D3Selection types
        //  or refactor grid implementations/interfaces to maintain the same selection type
        this.lasagna = new Lasagna(<D3Selection<SVGSVGElement>>(<unknown>this.container), clipPathId);
        this.renderingArea = this.buildRenderingArea(clipPathId);
        this.adjustRenderingArea();

        this.gridElementsLayer = this.lasagna.addLayer({
            name: Grid.GRID_ELEMENTS_LAYER_NAME,
            order: 100,
            clipped: false,
        });

        const borders = this.buildBorders(this.gridElementsLayer);
        if (borders) {
            this.borders = borders;
        }

        return this;
    }

    /**
    * Derived classes override this method to build the grid's plugins
    *
    * @param {IChart} chart The chart instance to pass to each plugin
    *
    * @returns {IChartPlugin[]} Default implementation returns an empty array
    */
    public buildPlugins(chart: IChart): IChartPlugin[] {
        return [];
    }

    /** See {@link IGrid#update} */
    public update(): IGrid {
        if (isEmpty(this.scales)) {
            return this;
        }

        this.updateBorders();
        this.adjustRenderingArea();
        return this;
    }

    /** See {@link IGrid#updateDimensions} */
    public updateDimensions(dimensions: Partial<IDimensions>): IGrid {
        const dimensionConfig = this.config().dimension;

        if (dimensions.width) {
            dimensionConfig.outerWidth(dimensions.width - Grid.TICK_DIMENSION_CORRECTION); // subtract correction value to accommodate far right tick
        }
        if (dimensions.height) {
            dimensionConfig.outerHeight(dimensions.height);
        }

        this.adjustRenderingArea();
        this.updateRanges();

        return this;
    }

    /** See {@link IGrid#updateRanges} */
    public updateRanges(): IGrid {
        this.update();
        return this;
    }

    /**
     * Builds the grid borders as SVGElements based on the specified configuration
     *
     * @param {D3Selection} container d3 container for the borders
     *
     * @returns {Partial<IBorders>} The grid's borders
     */
    protected buildBorders(container: D3Selection): Partial<IBorders> | undefined {
        if (!this.config() || !this.config().borders) {
            return;
        }

        const borderConfigs = this.config().borders;
        const borders: Partial<IBorders> = {};
        const borderKeys = <BorderKey[]>Object.keys(borderConfigs);
        each(borderKeys, (side: BorderKey) => {
            // We're creating even invisible borders and updating visibility afterwards
            if (borderConfigs[side]) {
                borders[side] = this.createBorder(container, borderConfigs[side]) ?? undefined;
            }
        });

        return borders;
    }

    /**
     * Adjusts the grid's rendering area and clip path based on the grid's configured width and height
     */
    protected adjustRenderingArea = () => {
        const d = this.config().dimension;
        const renderingAreaClipPathAttrs = {
            "width": d.width(),
            "height": d.height() + Grid.RENDER_AREA_HEIGHT_CORRECTION,
            "y": -Grid.RENDER_AREA_HEIGHT_CORRECTION,
        };

        const renderingAreaAttrs = {
            ...renderingAreaClipPathAttrs,
            // Width correction needed to prevent interaction gap between right side of grid and the edge of the rendering area
            "width": d.width() > 0 ? d.width() - Grid.RENDER_AREA_WIDTH_CORRECTION : d.width(),
        };

        this.renderingAreaClipPath.attrs(renderingAreaClipPathAttrs);
        this.renderingArea.attrs(renderingAreaAttrs);
    }

    /**
     * Builds the grid's rendering area as a layer on the lasagna
     *
     * @param {string} clipPathId The clip path identifier
     *
     * @returns {D3Selection} The grid's rendering area
     */
    private buildRenderingArea(clipPathId: string): D3Selection<SVGRectElement> {
        this.renderingAreaClipPath = this._target.append("clipPath")
            .attr("id", clipPathId)
            .append("rect");

        const renderingAreaContainer = this.lasagna.addLayer({
            name: Grid.RENDERING_AREA_LAYER_NAME,
            order: -1,
            clipped: true,
        });
        return renderingAreaContainer.append("rect")
            .attrs({
                "pointer-events": "all",
                "fill": "transparent",
            });
    }

    /**
     * Creates a border with the specified configuration in the provided container
     *
     * @param {D3Selection} container The container to append the border to
     * @param {IBorderConfig} config The configuration to apply to the border
     *
     * @returns {SVGElement} The created border
     */
    private createBorder(container: D3Selection, config: IBorderConfig): SVGElement | null {
        const border = container.append("line")
            .attr("class", config.className || Grid.DEFAULT_BORDER_CLASS_NAME);

        if (config.width) {
            // use style instead of attr to override css style
            border.style("stroke-width", config.width);
        }
        if (config.color) {
            // use style instead of attr to override css style
            border.style("stroke", config.color);
        }

        return border.node();
    }

    // TODO: borders are evil. reconsider!
    // We're using borders instead of axis line and because of that we need to do these weird size adjustments
    protected updateBottomBorder() {
        if (!this.borders.bottom) {
            throw new Error("BottomBorder is not defined");
        }
        select(this.borders.bottom)
            .attrs({
                "x1": 0,
                "y1": this.config().dimension.height() - borderMidpoint,
                "x2": this.config().dimension.width() + Grid.TICK_DIMENSION_CORRECTION, // to get nice alignment with ticks
                "y2": this.config().dimension.height() - borderMidpoint,
            })
            .classed("hidden", !this._config.borders.bottom?.visible);
    }

    /**
     * Updates the d3 line positioning and visibility attributes of each of the configured borders
     */
    protected updateBorders() {
        if (this.borders.bottom) {
            this.updateBottomBorder();
        }
        if (this.borders.top) {
            select(this.borders.top)
                .attrs({
                    "x1": 0,
                    "y1": borderMidpoint, // the line was outside of the viewport in some browser when set to 0
                    "x2": this.config().dimension.width() + Grid.TICK_DIMENSION_CORRECTION, // to get nice alignment with ticks
                    "y2": borderMidpoint,
                })
                .classed("hidden", !this._config.borders.top?.visible);
        }
        if (this.borders.right) {
            select(this.borders.right)
                .attrs({
                    "x1": this.config().dimension.width() - borderMidpoint,
                    "y1": 0,
                    "x2": this.config().dimension.width() - borderMidpoint,
                    "y2": this.config().dimension.height() + Grid.TICK_DIMENSION_CORRECTION, // to get nice alignment with ticks
                })
                .classed("hidden", !this._config.borders.right?.visible);
        }
        if (this.borders.left) {
            select(this.borders.left)
                .attrs({
                    "x1": borderMidpoint,
                    "y1": 0,
                    "x2": borderMidpoint,
                    "y2": this.config().dimension.height() + Grid.TICK_DIMENSION_CORRECTION, // to get nice alignment with ticks
                })
                .classed("hidden", !this._config.borders.left?.visible);
        }
    }
}
