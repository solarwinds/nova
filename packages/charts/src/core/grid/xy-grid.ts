import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";
import { select } from "d3-selection";
import clone from "lodash/clone";
import each from "lodash/each";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import isUndefined from "lodash/isUndefined";

import { IGNORE_INTERACTION_CLASS } from "../../constants";
import { MouseInteractiveArea } from "../common/mouse-interactive-area";
import { BandScale } from "../common/scales/band-scale";
import { getAutomaticDomain, getAutomaticDomainWithTicks } from "../common/scales/domain-calculation/automatic-domain";
import { LinearScale } from "../common/scales/linear-scale";
import { IBandScale, IScale, ScalesIndex } from "../common/scales/types";
import { D3Selection, IChart, IChartPlugin } from "../common/types";
import { InteractionLabelPlugin } from "../plugins/interaction/interaction-label-plugin";
import { InteractionLinePlugin } from "../plugins/interaction/interaction-line-plugin";
import { MouseInteractiveAreaPlugin } from "../plugins/mouse-interactive-area-plugin";

import { XYGridConfig } from "./config/xy-grid-config";
import { Grid } from "./grid";
import { IAllAround, IAxis, IAxisConfig, IDimensionConfig, IGrid, IXYGridConfig, TextOverflowHandler } from "./types";

export class XYGrid extends Grid implements IGrid {
    public static TICK_LABEL_OVERFLOW_DEBOUNCE_INTERVAL = 200;

    protected axisX: IAxis = <any>{};
    protected axisYLeft: IAxis = <any>{};
    protected axisYRight: IAxis = <any>{};
    protected gridY: IAxis = <any>{};
    protected gridX: IAxis = <any>{};

    private _bottomScaleId?: string;
    private _leftScaleId?: string;
    private _rightScaleId: string;
    private reconcileMarginsDebounce: any;
    // map of scale id to pending debounce timeout
    private handleTickLabelOverflowDebounceIndex: Record<string, any> = {};

    /**
     * Returns the id of the bottom axis scale
     */
    public get bottomScaleId(): string | undefined {
        if (this._bottomScaleId) {
            return this._bottomScaleId;
        }
        if (!isEmpty(this.scales)) {
            return this.scales["x"].list[0].id;
        }
    }

    /**
     * Sets the id of the bottom axis scale
     */
    public set bottomScaleId(id: string | undefined) {
        this._bottomScaleId = id;
    }

    /**
     * Returns the id of the left axis scale
     */
    public get leftScaleId(): string | undefined {
        if (this._leftScaleId) {
            return this._leftScaleId;
        }
        if (!isEmpty(this.scales)) {
            return this.scales["y"].list[0].id;
        }
    }

    /**
     * Sets the id of the left axis scale
     */
    public set leftScaleId(id: string | undefined) {
        this._leftScaleId = id;
    }

    /**
     * Returns the id of the right axis scale
     */
    public get rightScaleId() {
        return this._rightScaleId;
    }

    /**
     * Sets the id of the right axis scale
     */
    public set rightScaleId(id: string) {
        this._rightScaleId = id;
    }

    /** @ignore */
    public set scales(scales: ScalesIndex) {
        this._scales = scales;

        if (this._scales) {
            Object.keys(this._scales).forEach((scaleKey) => {
                // Defaulting to left
                let config: IAxisConfig = this.config().axis.left;
                let axisGenerator: any;
                if (scaleKey !== "x" && scaleKey !== "y") {
                    return;
                }
                this._scales[scaleKey]?.list?.filter((scale) => scale instanceof LinearScale).forEach((scale) => {
                    if (scale?.id === this.leftScaleId) {
                        config = this.config().axis.left;
                        axisGenerator = axisLeft;
                    } else if (scale?.id === this.rightScaleId) {
                        config = this.config().axis.right;
                        axisGenerator = axisRight;
                    } else if (scale?.id === this.bottomScaleId) {
                        config = this.config().axis.bottom;
                        axisGenerator = axisBottom;
                    }
                    if (scale.domainCalculator === getAutomaticDomain && config.gridTicks) {
                        scale.__domainCalculatedWithTicks = true;
                        scale.domainCalculator = getAutomaticDomainWithTicks(config, axisGenerator);
                    }
                });
            });
        }
    }

    /** @ignore */
    public get scales(): ScalesIndex {
        return this._scales;
    }

    /** See {@link IGrid#config} */
    public config(): IXYGridConfig;
    /** See {@link IGrid#config} */
    public config(config: IXYGridConfig): this;
    /** See {@link IGrid#config} */
    public config(config?: IXYGridConfig): any {
        if (config === undefined) {
            return this._config;
        }
        this._config = config;
        return this;
    }

    constructor(config?: IXYGridConfig) {
        super();
        this.config(config || new XYGridConfig());
    }

    /** See {@link IGrid#build} */
    public build(): IGrid {
        super.build();
        if (this.config().interactive) {
            this.interactiveArea = this.renderingArea;
        }

        this.buildAxes(this.gridElementsLayer);
        this.recalculateMargins(this.container);

        return this;
    }

    /** See {@link IGrid#buildPlugins} */
    public buildPlugins(chart: IChart): IChartPlugin[] {
        const plugins: IChartPlugin[] = [];

        if (this.config().interactive) {
            plugins.push(new MouseInteractiveAreaPlugin(
                new MouseInteractiveArea(this.getLasagna().getContainer(), this.getInteractiveArea(), this.config().cursor)));
        }

        if (this.config().interactionPlugins) {
            plugins.push(new InteractionLinePlugin());
            plugins.push(new InteractionLabelPlugin());
        }

        return plugins;
    }

    /** See {@link IGrid#update} */
    public update(): IGrid {
        super.update();

        this.updateAxes();

        const oldMargin = clone(this._config.dimension.margin);
        this.recalculateMargins(this.container);
        this.reconcileMarginsWithDebounce(oldMargin);

        return this;
    }

    /** @ignore */
    public drawTicks(config: IAxisConfig, axis: IAxis, scale: IScale<any>, axisGenerator: any) {
        if (config.visible) {
            const bottomLabelAxis = axisGenerator(scale.d3Scale)
                .ticks(config.approximateTicks)
                .tickSize(0)
                .tickFormat(scale.formatters["tick"]);

            axis.labelGroup
                .call(bottomLabelAxis);
            let tickAxis;
            if (scale instanceof BandScale) {
                tickAxis = axisGenerator(scale.copyToLinear().d3Scale)
                    .tickSize(config.tickSize)
                    .tickValues(scale.bandTicks())
                    .tickFormat(() => "");
            } else {
                tickAxis = axisGenerator(scale.d3Scale)
                    .tickSize(config.tickSize)
                    .tickFormat(() => "");
                tickAxis.ticks(config.approximateTicks);
            }
            axis.tickGroup.call(tickAxis);

            this.adjustAxisTicks(axis.labelGroup, scale);
        } else {
            axis.labelGroup.selectAll("*").remove();
            axis.tickGroup.selectAll("*").remove();
        }
    }

    /** @ignore */
    public drawGrids(config: IAxisConfig, axis: IAxis, axisGenerator: any, scale: IScale<any>, size: number) {
        const modifyZeroLines = (gridGroupSelection: any) =>
            gridGroupSelection
                .selectAll(".tick line")
                .classed("nui-zero-line", (d: any) => d === 0);

        const leftGridLines = axisGenerator(scale.d3Scale)
            .tickSize(size)
            .tickFormat(() => "")
            .ticks(config.approximateTicks);

        if (config.gridTicks) {
            const gridSelection = axis.tickGroup.call(leftGridLines);
            modifyZeroLines(gridSelection);
        } else {
            axis.tickGroup.selectAll("*").remove();
        }
    }

    /** See {@link IGrid#updateRanges} */
    public updateRanges(): IGrid {
        if (isEmpty(this.scales)) {
            return this;
        }

        const dimension = this.config().dimension;
        const padding = dimension.padding;

        if (this.scales.x) {
            each(this.scales.x.list, xScale => {
                xScale.range([padding.left, dimension.width() - padding.right]);
            });
        }
        if (this.scales.y) {
            each(this.scales.y.list, yScale => {
                yScale.range([dimension.height() - padding.bottom, padding.top]);
            });
        }

        super.updateRanges();
        return this;
    }

    protected updateXAxis() {
        const xScale = this.bottomScaleId ? this.scales["x"].index[this.bottomScaleId] : undefined;
        const axis = this.config().axis;

        if (!xScale) {
            throw new Error("xScale is not defined");
        }

        this.axisX.group.attr("transform", `translate(0, ${this.config().dimension.height()})`);
        // Additional transform to not overlap with ticks
        this.axisX.labelGroup.attr("transform", `translate(0, ${axis.bottom.tickSize})`);

        this.drawTicks(axis.bottom, this.axisX, xScale, axisBottom);
        this.drawGrids(axis.bottom, this.gridX, axisTop, xScale, this.config().dimension.height());

        this.gridX.tickGroup
            .attr("transform", `translate(0, ${this.config().dimension.height()})`);
    }

    protected updateYAxes() {
        const axis = this.config().axis;
        const yLeftScale = this.leftScaleId ? this.scales["y"].index[this.leftScaleId] : undefined;

        if (!yLeftScale) {
            throw new Error("yLeftScale is not defined");
        }

        this.axisYLeft.labelGroup.attr(
            "transform",
            `translate(${-axis.left.tickSize - axis.left.padding}, 0)`
        );

        this.drawTicks(axis.left, this.axisYLeft, yLeftScale, axisLeft);
        this.drawGrids(
            axis.left,
            this.gridY,
            axisRight,
            yLeftScale,
            this.config().dimension.width()
        );

        if (this.rightScaleId) {
            const yRightScale = this.scales["y"].index[this.rightScaleId];
            const rightScaleLabelX = axis.right.padding + this.config().dimension.width() + axis.right.tickSize;
            this.axisYRight.labelGroup.attr(
                "transform",
                `translate(${rightScaleLabelX}, 0)`
            );
            this.axisYRight.tickGroup.attr(
                "transform",
                `translate(${this.config().dimension.width()}, 0)`
            );
            this.drawTicks(axis.right, this.axisYRight, yRightScale, axisRight);
        }
    }

    protected updateAxes(): void {
        if (!this.target()) {
            return;
        }

        this.updateXAxis();
        this.updateYAxes();
    }

    protected adjustAxisTicks(labelGroup: D3Selection<SVGGElement>, scale: IScale<any>) {
        const textOfTicks: HTMLElement[] = [];

        labelGroup.attr("cursor", "default");

        labelGroup.selectAll("g").each(function () {
            select(this).classed("sw-hidden", false).classed("tick-hidden-text", false);
            textOfTicks.push(<HTMLElement>this);
        });

        const toRemove = this.filterRepeatedElements(textOfTicks);
        toRemove.forEach((group: HTMLElement) => {
            select(group).classed("tick-hidden-text", true);
        });

        const allAxisLabels = this.selectAllAxisLabels(labelGroup);
        allAxisLabels.forEach((group: HTMLElement) => {
            const groupSelection = select(group);
            // zero-out the d3-provided x position of all labels since we're manually translating the x position of the entire group;
            // add IGNORE_INTERACTION_CLASS so that mouse events used for displaying the title don't propagate from the mouse-interactive-area
            groupSelection.select("text").attr("x", 0).classed(IGNORE_INTERACTION_CLASS, true);
            groupSelection.classed("pointer-events", true);
            if (groupSelection.select("title").empty()) {
                const datum = groupSelection.data()[0];
                const titleText = (scale.formatters["tick"] ? scale.formatters["tick"](datum) : datum) as string;
                groupSelection.append("title").text(titleText);
            }
        });

        this.handleTickLabelOverflow(labelGroup, scale, allAxisLabels);
    }

    protected handleTickLabelOverflow(labelGroup: D3Selection<SVGGElement>, scale: IScale<any>, axisLabels: HTMLElement[]) {
        const axisConfig = this.config().axis;
        if (scale.id === this.bottomScaleId && (scale.isContinuous() || !axisConfig.bottom.tickLabel.overflowHandler)) {
            const textToHide = this.getElementsToHide(axisLabels, this._config.dimension.width(), true);
            textToHide.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                groupSelection.classed("tick-hidden-text", true);
                // disable pointer-events so the title doesn't display for hidden labels
                groupSelection.classed("pointer-events", false);
            });
            return;
        }

        if (scale.id === this.rightScaleId || scale.id === this.leftScaleId) {
            const textToHide = this.getElementsToHide(axisLabels, this._config.dimension.height(), false);
            textToHide.forEach((group: HTMLElement) => {
                select(group).classed("sw-hidden", true);
            });
        }

        const margin = this.config().dimension.margin;
        let widthLimit = 0;
        let horizontalPadding = 0;
        let overflowHandler: TextOverflowHandler | undefined;
        const maxRightWidth = axisConfig.right.tickLabel.maxWidth;
        const maxLeftWidth = axisConfig.left.tickLabel.maxWidth;

        if (scale.id === this.bottomScaleId) {
            const maxBottomWidth = axisConfig.bottom.tickLabel.maxWidth;
            const calculatedBottomWidth = (scale as any).bandwidth ? (scale as IBandScale<any>).bandwidth() : this.getTickDistance(axisLabels);

            if (!isUndefined(maxBottomWidth)) {
                widthLimit = calculatedBottomWidth > maxBottomWidth ? maxBottomWidth : calculatedBottomWidth;
            } else {
                widthLimit = calculatedBottomWidth;
            }

            horizontalPadding = axisConfig.bottom.tickLabel.horizontalPadding;
            overflowHandler = axisConfig.bottom.tickLabel.overflowHandler;

        } else if (scale.id === this.rightScaleId && !axisConfig.right.fit) {
            const calculatedRightWidth = margin.right - axisConfig.right.padding - axisConfig.right.tickSize;

            if (!isUndefined(maxRightWidth)) {
                widthLimit = calculatedRightWidth > maxRightWidth ? maxRightWidth : calculatedRightWidth;
            } else {
                widthLimit = calculatedRightWidth;
            }

            horizontalPadding = axisConfig.right.tickLabel.horizontalPadding;
            overflowHandler = axisConfig.right.tickLabel.overflowHandler;

        } else if (scale.id === this.leftScaleId && !axisConfig.left.fit) {
            const calculatedLeftWidth = margin.left - axisConfig.left.padding - axisConfig.left.tickSize;

            if (!isUndefined(maxLeftWidth)) {
                widthLimit = calculatedLeftWidth > maxLeftWidth ? maxLeftWidth : calculatedLeftWidth;
            } else {
                widthLimit = calculatedLeftWidth;
            }

            horizontalPadding = axisConfig.left.tickLabel.horizontalPadding;
            overflowHandler = axisConfig.left.tickLabel.overflowHandler;

        } else if (scale.id === this.rightScaleId && axisConfig.right.fit && !isUndefined(maxRightWidth)) {
            widthLimit = maxRightWidth;
            horizontalPadding = axisConfig.right.tickLabel.horizontalPadding;
            overflowHandler = axisConfig.right.tickLabel.overflowHandler;

        } else if (scale.id === this.leftScaleId && axisConfig.left.fit && !isUndefined(maxLeftWidth)) {
            widthLimit = maxLeftWidth;
            horizontalPadding = axisConfig.left.tickLabel.horizontalPadding;
            overflowHandler = axisConfig.left.tickLabel.overflowHandler;

        } else {
            return;
        }

        if (!overflowHandler) {
            return;
        }

        // sample the length of an ellipsis in the current environment
        let ellipsisWidth = 0;
        if (labelGroup.select(".sample-ellipsis").empty()) {
            const testText = labelGroup.append("text");
            const ellipsis = testText.classed("sample-ellipsis", true).attr("opacity", 0).append("tspan").text("...");
            ellipsisWidth = ellipsis.node()?.getComputedTextLength() || 0;
            testText.remove();
        }

        // reset debounce if necessary
        if (this.handleTickLabelOverflowDebounceIndex[scale.id]) {
            clearTimeout(this.handleTickLabelOverflowDebounceIndex[scale.id]);
            this.handleTickLabelOverflowDebounceIndex[scale.id] = null;
        }

        // hide the labels and disable pointer-events while debouncing
        labelGroup.classed("tick-hidden-text", true);
        axisLabels.forEach((group: HTMLElement) => {
            select(group).classed("pointer-events", false);
        });
        // setTimeout used for debounce when the chart is resized
        this.handleTickLabelOverflowDebounceIndex[scale.id] = setTimeout(() => {
            axisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                // invoke the handler for each text element
                groupSelection.select("text").call(overflowHandler as TextOverflowHandler, { widthLimit, horizontalPadding, ellipsisWidth });
                // restore pointer events
                groupSelection.classed("pointer-events", true);
            });

            // display the labels
            labelGroup.classed("tick-hidden-text", false);
        }, XYGrid.TICK_LABEL_OVERFLOW_DEBOUNCE_INTERVAL);
    }

    protected selectAllAxisLabels(axisGroup: D3Selection<SVGGElement>) {
        const actualTextElements: HTMLElement[] = [];
        axisGroup.selectAll("g:not(.tick-hidden-text)").each(function () {
            actualTextElements.push(<HTMLElement>this);
        });
        return actualTextElements;
    }

    protected getOuterWidthDimensionCorrection() {
        return this.config().axis.bottom.visible ? Grid.TICK_DIMENSION_CORRECTION : 0;
    }

    private hasRightYAxis(): boolean {
        return this.config().axis.right.visible && this.rightScaleId?.length > 0;
    }

    private buildAxes(container: D3Selection) {
        // Grid lines: no sense to have right
        this.gridY.tickGroup = container.append("g")
            .classed("sw-axis sw-axis-grid sw-axis-gridY", true);
        this.gridX.tickGroup = container.append("g")
            .classed("sw-axis sw-axis-grid sw-axis-gridX", true);

        // Axis groups
        this.axisX.group = container.append("g")
            .classed("sw-axis sw-axis-x", true);
        this.axisX.tickGroup = this.axisX.group.append("g")
            .classed("sw-axis sw-axis-x sw-axis-x-ticks", true);
        this.axisX.labelGroup = this.axisX.group.append("g")
            .classed("sw-axis sw-axis-x sw-axis-x-labels", true);

        this.axisYLeft.group = container.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-left", true);
        this.axisYLeft.tickGroup = this.axisYLeft.group.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-ticks", true);
        this.axisYLeft.labelGroup = this.axisYLeft.group.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-labels", true);

        this.axisYRight.group = container.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-right", true);
        this.axisYRight.tickGroup = this.axisYRight.group.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-ticks", true);
        this.axisYRight.labelGroup = this.axisYRight.group.append("g")
            .classed("sw-axis sw-axis-y sw-axis-y-labels", true);
    }

    private filterRepeatedElements(elementsToFilter: HTMLElement[]) {
        const arr: HTMLElement[] = [elementsToFilter[0]];
        elementsToFilter.reduce((prev: any, next: any) => {
            const textInsideNext = select(next).text();
            if (textInsideNext !== prev) {
                arr.push(next);
            }
            return textInsideNext;
        }, elementsToFilter[0] && select(elementsToFilter[0]).text());
        return elementsToFilter.filter(element => arr.indexOf(element) === -1);
    }

    private getElementsToHide(elementsToFilter: HTMLElement[], measurement: number, isBottomAxis: boolean) {
        let elementsToDisplay: HTMLElement[];
        const measureType = isBottomAxis ? "width" : "height";
        const measurementComparison = (this.getTextMeasurement(elementsToFilter, measureType) < measurement);
        const bottomAxisComparison
            = isBottomAxis ? this.getMaxTextWidth(elementsToFilter) < this.getTickDistance(elementsToFilter) : false;
        const shouldNotFilter = isBottomAxis ? measurementComparison && bottomAxisComparison : measurementComparison;

        if (shouldNotFilter) {
            return [];
        }

        elementsToDisplay = this.elementsFiltering(elementsToFilter, measurement, measureType);

        return elementsToFilter.filter(element => elementsToDisplay.indexOf(element) === -1);
    }

    private elementsFiltering(elementsToFilter: HTMLElement[],
                              parameter: number,
                              measureType: string) {
        let elementsToDisplay: HTMLElement[];
        let counter = 2;
        const condition = (array: HTMLElement[]) => measureType === "width"
            ? this.getMaxTextWidth(array) > this.getTickDistance(array)
            : this.getTextMeasurement(array, measureType) > parameter;
        do {
            elementsToDisplay = elementsToFilter.filter((element: HTMLElement, index: number) => (index % counter) === 0);
            counter++;
            // Break the loop when we have only 1 tick and its size is bigger than available width/height
            if (elementsToDisplay.length === 1 && condition(elementsToDisplay)) {
                break;
            }
        } while (condition(elementsToDisplay));
        return elementsToDisplay;
    }

    private getTextMeasurement(array: HTMLElement[], measureType: string) {
        const textPadding = measureType === "width" ? 5 : 0;
        return array.reduce((prev: number, next: HTMLElement) =>
            prev + (next.getBoundingClientRect() as any)[measureType] + textPadding, 0);
    }

    private getMaxTextWidth(array: HTMLElement[]) {
        if (array.length === 0) {
            return 0;
        }
        return Math.max.apply(null, array.map((tick: HTMLElement) => tick.getBoundingClientRect().width));
    }

    private getTickDistance(array: HTMLElement[]) {
        if (array.length === 0) {
            return 0;
        }
        let smallestDiff = Infinity;
        const arrayOfPositions = array.map((tick: HTMLElement) => {
            const transformVal = tick.getAttribute("transform");

            if (isNil(transformVal)) {
                throw new Error("tick transform is not defined");
            }

            return parseFloat(transformVal.slice(transformVal.indexOf("(") + 1, transformVal.indexOf(",")));
        });

        arrayOfPositions.reduce((p: number, n: number) => {
            const diff = n - p;
            if (diff < smallestDiff) {
                smallestDiff = diff;
            }
            return n;
        });
        return smallestDiff;
    }

    private recalculateMargins(container: D3Selection<SVGGElement>) {
        if (!container) {
            return;
        }
        const d = this._config.dimension;
        const axis = this.config().axis;

        const oldOuterWidth = d.outerWidth();
        const oldOuterHeight = d.outerHeight();

        if (axis.left.fit && axis.left.visible) {
            d.margin.left = this.getMaxTextWidth(this.selectAllAxisLabels(this.axisYLeft.labelGroup)) + axis.left.tickSize + axis.left.padding;
        }

        if (axis.right.fit && this.hasRightYAxis()) {
            d.margin.right = this.getMaxTextWidth(this.selectAllAxisLabels(this.axisYRight.labelGroup)) + axis.right.tickSize + axis.right.padding;
        }

        const bottomScale = this.bottomScaleId && this.scales ? this.scales["x"]?.index[this.bottomScaleId] : undefined;
        if (axis.bottom.fit && axis.bottom.visible && (bottomScale?.isContinuous() || !axis.bottom.tickLabel.overflowHandler)) {
            this.fitBottomAxis(d);
        }

        const newTopMargin = d.margin.top; // TODO: Do the calculation, if needed
        const newBottomMargin = d.margin.bottom; // TODO: Do the calculation, based on bottom Axis height

        d.margin.top = newTopMargin;
        d.margin.bottom = newBottomMargin;

        // adjust width and height accordingly
        d.outerWidth(oldOuterWidth);
        d.outerHeight(oldOuterHeight);

        const tx = this.config().dimension.margin.left;
        const ty = this.config().dimension.margin.top;
        container.attr("transform", `translate(${tx}, ${ty})`);
    }

    private fitBottomAxis(d: IDimensionConfig) {
        const scale = this.scales?.x?.list[0].d3Scale;
        if (!scale) {
            return;
        }
        let lastTextWidth: number = 0;
        let lastTickScaleValue: number = 0;
        const node = this.axisX.labelGroup.select(".tick:not(.tick-hidden-text):last-child text").node();
        if (node) {
            lastTextWidth = (node as any).getBoundingClientRect().width;
            lastTickScaleValue = scale((node as any).innerHTML) ?? 0;
            const topOfRange = scale.range()[1];
            const diff = (lastTextWidth / 2) - (Math.abs(topOfRange - lastTickScaleValue) / 2);
            d.margin.right = diff > 0 ? diff : 0;
        }
    }

    /**
     * This method invokes updateRanges if the margins have changed, but only after a debounce period.
     * ----
     * The debounce is necessary because, in the case of a very short axis, repeated attempts to
     * alternately fit axis labels and recalculate ticks may conflict with each other
     * causing the old and new margins to never be equal upon comparison. This scenario can cause a d3
     * call stack overflow, but with a debounce, d3 can keep up with the recalculations until the chart
     * is resized to consistently accommodate the width of the labels.
     */
    private reconcileMarginsWithDebounce(oldMargin: IAllAround<number>) {
        if (this.reconcileMarginsDebounce) {
            clearTimeout(this.reconcileMarginsDebounce);
            this.reconcileMarginsDebounce = null;
        }

        this.reconcileMarginsDebounce = setTimeout(() => {
            if (!this.areMarginsApproximatelyEqual(oldMargin, this._config.dimension.margin)) {
                this.updateChartDimensionsSubject?.next();
            }
        }, 100);
    }

    private isApproximatelyEqual = (first: number, second: number) => Math.abs(first - second) < 0.1;

    private areMarginsApproximatelyEqual(margin1: IAllAround<number>, margin2: IAllAround<number>): boolean {
        return this.isApproximatelyEqual(margin1.top, margin2.top) &&
            this.isApproximatelyEqual(margin1.right, margin2.right) &&
            this.isApproximatelyEqual(margin1.bottom, margin2.bottom) &&
            this.isApproximatelyEqual(margin1.left, margin2.left);
    }
}
