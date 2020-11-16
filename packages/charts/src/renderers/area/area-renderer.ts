import { max, min } from "d3-array";
import { area, curveLinear } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { DATA_POINT_INTERACTION_RESET, STANDARD_RENDER_LAYERS } from "../../constants";
import { EMPTY_CONTINUOUS_DOMAIN, IScale, IXYScales, Scales } from "../../core/common/scales/types";
import { D3Selection, IDataSeries, ILasagnaLayer, IRendererEventPayload } from "../../core/common/types";
import { UtilityService } from "../../core/common/utility.service";
import { DEFAULT_MARKER_INTERACTION_CONFIG } from "../constants";
import { MarkerUtils } from "../marker-utils";
import { IAreaRendererConfig, IRenderSeries, RenderLayerName } from "../types";
import { XYRenderer } from "../xy-renderer";

import { IAreaAccessors } from "./area-accessors";

/**
 * Renderer that is able to draw line chart
 */
export class AreaRenderer extends XYRenderer<IAreaAccessors> {

    private DEFAULT_CONFIG: IAreaRendererConfig = {
        curveType: curveLinear,
        interactive: true,
        areaClass: "nui-chart-area",
        markerInteraction: DEFAULT_MARKER_INTERACTION_CONFIG,
    };

    /**
     * Creates an instance of AreaRenderer.
     * @param {IAreaRendererConfig} [config={}] Renderer configuration object
     */
    constructor(public config: IAreaRendererConfig = {}) {
        super(config);
        // setting default values to the properties that were not set by user
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<IAreaAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
        const target = renderSeries.containers[RenderLayerName.data];

        const accessors = renderSeries.dataSeries.accessors;
        let path: D3Selection<SVGPathElement> = target.select(`path.${this.config.areaClass}`);

        if (path.empty()) {
            if (!this.config.areaClass) {
                throw new Error("areaClass is not defined");
            }
            path = target.append("path")
                .classed(this.config.areaClass, true)
                .attrs({
                    "fill": accessors.series.color?.(renderSeries.dataSeries.id, renderSeries.dataSeries),
                });
        }
        this.drawArea(renderSeries, path);
    }

    /**
     * Renders the line in prepared <path> element
     *
     * @param {IRenderSeries<IAreaAccessors>} renderSeries
     * @param {D3Selection} path D3 Selection with <path> element pre-created and pre-styled
     */
    public drawArea(renderSeries: IRenderSeries<IAreaAccessors>, path: D3Selection<SVGPathElement>) {
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        let warned = false;
        const validatedData = dataSeries.data.filter((d, i) => {
            const valid = typeof accessors.data.absoluteX0?.(d, i, dataSeries.data, dataSeries) !== "undefined" &&
                typeof accessors.data.absoluteX1?.(d, i, dataSeries.data, dataSeries) !== "undefined" &&
                typeof accessors.data.absoluteY0?.(d, i, dataSeries.data, dataSeries) !== "undefined" &&
                typeof accessors.data.absoluteY1?.(d, i, dataSeries.data, dataSeries) !== "undefined";
            if (!valid && !warned) {
                console.warn("Data point", d, "was skipped as accessors didn't manage to extract any data.");
                console.warn(" -> accessors.data.x0:", accessors.data.x0);
                console.warn(" -> accessors.data.y0:", accessors.data.y0);
                console.warn(" -> accessors.data.x1:", accessors.data.x1);
                console.warn(" -> accessors.data.y1:", accessors.data.y1);
                warned = true;
            }
            return valid;
        });

        if (!this.config.curveType) {
            throw new Error("curveType is not defined");
        }

        const areaFunc = area()
            .x0((d: any, i: number) =>
                this.safetyCheck(renderSeries.scales.x.convert(accessors.data.absoluteX0?.(d, i, dataSeries.data, dataSeries))))
            .x1((d: any, i: number) =>
                this.safetyCheck(renderSeries.scales.x.convert(accessors.data.absoluteX1?.(d, i, dataSeries.data, dataSeries))))
            .y0((d: any, i: number) =>
                this.safetyCheck(renderSeries.scales.y.convert(accessors.data.absoluteY0?.(d, i, dataSeries.data, dataSeries))))
            .y1((d: any, i: number) =>
                this.safetyCheck(renderSeries.scales.y.convert(accessors.data.absoluteY1?.(d, i, dataSeries.data, dataSeries))))
            .curve(this.config.curveType);

        path.attr("d", areaFunc(validatedData) ?? "");
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(series: IDataSeries<IAreaAccessors>, values: { [p: string]: any }, scales: Scales) {
        if (isUndefined(values.x)) {
            return DATA_POINT_INTERACTION_RESET;
        }
        const index = UtilityService.getClosestIndex(series.data, (d, i) => series.accessors.data.x(d, i, series.data, series), values.x);

        if (isUndefined(index)) {
            throw new Error("Unable to get data point index");
        }

        return index;
    }

    public getDomain(data: any[], dataSeries: IDataSeries<IAreaAccessors>, scaleName: string, scale: IScale<any>): any[] {
        if (!data || data.length === 0) {
            return EMPTY_CONTINUOUS_DOMAIN;
        }
        const dataAccessors = dataSeries.accessors.data;

        if (scaleName !== "x" && scaleName !== "y") {
            return [undefined, undefined];
        }

        const accessor0 = dataAccessors[`absolute${scaleName.toUpperCase()}0`];
        const accessor1 = dataAccessors[`absolute${scaleName.toUpperCase()}1`];

        return [
            min(data, (datum, index, arr) =>
                min([accessor0?.(datum, index, arr as any[], dataSeries), accessor1?.(datum, index, arr as any[], dataSeries)])),
            max(data, (datum, index, arr) =>
                max([accessor0?.(datum, index, arr as any[], dataSeries), accessor1?.(datum, index, arr as any[], dataSeries)])),
        ];
    }

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [
            STANDARD_RENDER_LAYERS[RenderLayerName.data],
            STANDARD_RENDER_LAYERS[RenderLayerName.foreground],
        ];
    }

    /**
     * Filters given dataset by domain of provided scale
     *
     * @param data
     * @param dataSeries
     * @param scaleName
     * @param domain
     */
    public filterDataByDomain(data: any[], dataSeries: IDataSeries<IAreaAccessors>, scaleName: string, domain: any[]): any[] {
        const accessor0 = dataSeries.accessors.data[scaleName + "0"];
        const accessor1 = dataSeries.accessors.data[scaleName + "1"];

        return data.filter((d, i) => {
            const value0 = accessor0?.(d, i, data, dataSeries);
            const value1 = accessor1?.(d, i, data, dataSeries);

            return Math.max(value0, value1) >= domain[0] && Math.min(value0, value1) <= domain[1];
        });
    }

    public highlightDataPoint(renderSeries: IRenderSeries<IAreaAccessors>, dataPointIndex: number, rendererSubject: Subject<IRendererEventPayload>): void {
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;
        if (!accessors.series.marker || !this.config.interactive) {
            return;
        }

        const container = renderSeries.containers[RenderLayerName.foreground];
        MarkerUtils.manageMarker(renderSeries.dataSeries, renderSeries.scales as IXYScales,
            dataPointIndex, container, rendererSubject, this.config.markerInteraction);
    }

    public safetyCheck(value: number) {
        return isNaN(value) || typeof value === "undefined" ? 0 : value;
    }
}
