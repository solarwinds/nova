import { curveLinear, line } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { DATA_POINT_INTERACTION_RESET, STANDARD_RENDER_LAYERS } from "../../constants";
import { IXYScales, Scales } from "../../core/common/scales/types";
import { D3Selection, IDataSeries, ILasagnaLayer, IPosition, IRendererEventPayload } from "../../core/common/types";
import { UtilityService } from "../../core/common/utility.service";
import { DEFAULT_MARKER_INTERACTION_CONFIG } from "../constants";
import { MarkerUtils } from "../marker-utils";
import { ILineRendererConfig, IRenderSeries, RenderLayerName } from "../types";
import { XYRenderer } from "../xy-renderer";

import { ILineAccessors } from "./line-accessors";

/**
 * Renderer that is able to draw line chart
 */
export class LineRenderer extends XYRenderer<ILineAccessors> {

    /** @Deprecated, use getStrokeStyleDashed */
    public static STROKE_STYLE_DASHED = "2,2";
    /** @Deprecated, use getStrokeStyleDotted */
    public static STROKE_STYLE_DOTTED = "1,1";
    public static UNCLIPPED_DATA_LAYER_NAME = "unclipped-data";
    public static LINE_CAP_CLASS_NAME = "nui-chart-line-cap";

    public static getStrokeStyleDashed(width: number) {
        const dash = width * 2;
        return `${dash},${dash}`;
    }

    public static getStrokeStyleDotted(width: number) {
        return `${width},${width}`;
    }

    private DEFAULT_CONFIG: ILineRendererConfig = {
        strokeWidth: 2,
        curveType: curveLinear,
        interactive: true,
        strokeStyle: "",
        strokeLinecap: "round",
        markerInteraction: DEFAULT_MARKER_INTERACTION_CONFIG,
        useEnhancedLineCaps: false,
        enhancedLineCap: {
            radius: 3,
        },
    };

    /**
     * Creates an instance of LineRenderer.
     * @param {ILineRendererConfig} [config={}] Renderer configuration object
     */
    constructor(public readonly config: ILineRendererConfig = {}) {
        super(config);
        // setting default values to the properties that were not set by user
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<ILineAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
        const target = renderSeries.containers[RenderLayerName.data];

        const strokeValue = renderSeries.dataSeries.accessors.series.color?.(renderSeries.dataSeries.id, renderSeries.dataSeries);
        let path: D3Selection<SVGPathElement> = target.select("path.main");

        if (path.empty()) {
            path = target.append("path")
                .classed("main", true)
                // Assigning null value to match ValueMap<GElement, Datum> D3's signature
                .attrs({
                    "stroke": strokeValue ?? null,
                    "stroke-width": this.config.strokeWidth ?? null,
                    "stroke-dasharray": this.config.strokeStyle ?? null,
                    "stroke-linecap": this.config.strokeLinecap ?? null,
                    "fill": "none",
                });
        }
        this.drawLine(renderSeries, path);

        if (this.config.interactionStrategy) {
            this.config.interactionStrategy.draw(this, renderSeries, rendererSubject);
        }
    }

    /**
     * When the data contains only one data point with undefined 'x' value, it is considered an infinite line and special approach is applied
     *
     * @param renderSeries
     */
    public isInfiniteLineData(renderSeries: IRenderSeries<ILineAccessors>) {
        const dataSeries = renderSeries.dataSeries;
        return dataSeries.data.length === 1 && typeof dataSeries.accessors.data.x(dataSeries.data[0], 0, dataSeries.data, dataSeries) === "undefined";
    }

    /**
     * Renders the line in prepared <path> element
     *
     * @param {IRenderSeries<ILineAccessors>} renderSeries
     * @param {D3Selection} path D3 Selection with <path> element pre-created and pre-styled
     */
    public drawLine(renderSeries: IRenderSeries<ILineAccessors>, path: D3Selection<SVGPathElement>) {
        if (this.isInfiniteLineData(renderSeries)) {
            this.drawInfiniteLine(renderSeries, path);
        } else {
            this.drawStandardLine(renderSeries, path);
        }
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(series: IDataSeries<ILineAccessors>, values: { [p: string]: any }, scales: Scales): number {
        if (!this.config.interactive || isUndefined(values.x)) {
            return DATA_POINT_INTERACTION_RESET;
        }

        const index = UtilityService.getClosestIndex(series.data, (d, i) => series.accessors.data.x(d, i, series.data, series), values.x);

        if (isUndefined(index)) {
            throw new Error("Unable to get data point index");
        }

        return index;
    }

    /** See {@link Renderer#highlightDataPoint} */
    public highlightDataPoint(renderSeries: IRenderSeries<ILineAccessors>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>): void {
        if (!this.config.interactive) {
            return;
        }
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;
        if (!accessors.series.marker) {
            return;
        }

        MarkerUtils.manageMarker(dataSeries, renderSeries.scales as IXYScales, dataPointIndex,
            renderSeries.containers[RenderLayerName.foreground], rendererSubject, this.config.markerInteraction);
    }

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [
            STANDARD_RENDER_LAYERS[RenderLayerName.data],
            STANDARD_RENDER_LAYERS[RenderLayerName.foreground],
            {
                name: LineRenderer.UNCLIPPED_DATA_LAYER_NAME,
                // order calculated by adding 1 to the data layer order to ensure the unclipped data layer appears just after the data layer in the DOM
                order: STANDARD_RENDER_LAYERS[RenderLayerName.data].order + 1,
                clipped: false,
            },
        ];
    }

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(dataSeries: IDataSeries<ILineAccessors>, index: number, scales: Scales): IPosition | undefined {
        // TODO: consider including size of the marker once we have them rendered as symbols
        return super.getDataPointPosition(dataSeries, index, scales);
    }

    private drawStandardLine(renderSeries: IRenderSeries<ILineAccessors>, path: D3Selection<SVGPathElement>) {
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        let warned = false;
        const validatedData = dataSeries.data.filter((d, i) => {
            const valid = typeof accessors.data.x(d, i, dataSeries.data, dataSeries) !== "undefined" &&
                typeof accessors.data.y(d, i, dataSeries.data, dataSeries) !== "undefined";
            if (!valid && !warned) {
                console.warn("Data point", d, "was skipped as accessors didn't manage to extract any data.");
                console.warn(" -> accessors.data.x:", accessors.data.x);
                console.warn(" -> accessors.data.y:", accessors.data.y);
                warned = true;
            }
            return valid;
        });

        if (!this.config.curveType) {
            throw new Error("curveType is not defined");
        }

        const lineFunc = line()
            .x((d: any, i: number) => renderSeries.scales.x.convert(accessors.data.x(d, i, dataSeries.data, dataSeries)))
            .y((d: any, i: number) => renderSeries.scales.y.convert(accessors.data.y(d, i, dataSeries.data, dataSeries)))
            .defined((d: any, i: number) => accessors.data.defined ? accessors.data.defined(d, i, dataSeries.data, dataSeries) : true)
            .curve(this.config.curveType);

        path.attr("d", lineFunc(validatedData) ?? "");

        if (this.config.useEnhancedLineCaps) {
            this.updateLineCaps(validatedData, renderSeries, this.config.enhancedLineCap?.fill || path.attr("stroke"));
        }
    }

    private drawInfiniteLine(renderSeries: IRenderSeries<ILineAccessors>, path: D3Selection<SVGPathElement>) {
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        const y = renderSeries.scales.y.convert(accessors.data.y(dataSeries.data[0], 0, dataSeries.data, dataSeries));
        const data: [number, number][] = [
            [renderSeries.scales.x.range()[0], y],
            [renderSeries.scales.x.range()[1], y],
        ];

        const lineFunc = line()
            .x((d: any) => d[0])
            .y((d: any) => d[1]);

        const result: string | null = lineFunc(data);

        if (!result) {
            throw new Error("Line cannot be computed");
        }

        path
            .attr("shape-rendering", "crispEdges")
            .attr("d", result);
    }

    private updateLineCaps(validatedData: any[], renderSeries: IRenderSeries<ILineAccessors>, fill: string) {
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;
        const definedData = validatedData.filter((d, i) => accessors?.data?.defined ? accessors?.data?.defined(d, i, dataSeries.data, dataSeries) : true);

        const updateCx = (d: any, i: number) => renderSeries.scales.x.convert(accessors.data.x(d, i, dataSeries.data, dataSeries));
        const updateCy = (d: any, i: number) => renderSeries.scales.y.convert(accessors.data.y(d, i, dataSeries.data, dataSeries));

        // use an unclipped layer to ensure the line caps on the left and right sides of the chart don't get clipped
        const lineCaps = renderSeries.containers[LineRenderer.UNCLIPPED_DATA_LAYER_NAME].selectAll(`.${LineRenderer.LINE_CAP_CLASS_NAME}`)
            .data(definedData)
            .attr("cx", updateCx)
            .attr("cy", updateCy);

        lineCaps.enter().append("circle")
            .attr("class", LineRenderer.LINE_CAP_CLASS_NAME)
            .attr("r", this.config.enhancedLineCap?.radius as number)
            .attr("cx", updateCx)
            .attr("cy", updateCy)
            .style("stroke-width", this.config.enhancedLineCap?.strokeWidth as number)
            .style("fill", fill)
            .style("stroke", this.config.enhancedLineCap?.stroke as string);

        lineCaps.exit().remove();
    }
}
