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

import { max, min } from "d3-array";
import { local } from "d3-selection";
import defaultsDeep from "lodash/defaultsDeep";
import flatten from "lodash/flatten";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import uniq from "lodash/uniq";
import { Subject } from "rxjs";

import {
    DATA_POINT_INTERACTION_RESET,
    SELECT_DATA_POINT_EVENT,
} from "../../constants";
import { convert } from "../../core/common/scales/helpers/convert";
import {
    EMPTY_CONTINUOUS_DOMAIN,
    isBandScale,
    IScale,
    Scales,
} from "../../core/common/scales/types";
import {
    IDataPoint,
    IDataSeries,
    IPosition,
    IRendererEventPayload,
} from "../../core/common/types";
import {
    IRectangleAccessors,
    IRectangleDataAccessors,
} from "../accessors/rectangle-accessors";
import { IBarRendererConfig, IRenderSeries, RenderLayerName } from "../types";
import { XYRenderer } from "../xy-renderer";

/**
 * Renderer that is able to draw bar chart
 */
export class BarRenderer extends XYRenderer<IRectangleAccessors> {
    /**
     * Creates an instance of BarRenderer.
     * @param {IBarRendererConfig} [config] Renderer configuration object
     */
    constructor(public config: IBarRendererConfig = {}) {
        super(config);
        // setting default values to the properties that were not set by user
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    public static THICK = 11; // 10px + 1 to compensate outline
    public static THIN = 3; // 2px + 1 to compensate outline
    public static MIN_BAR_SIZE_FOR_ICON = 10; // Min bar size to render an icon inside.
    public static MIN_BAR_THICKNESS = 2;
    public static readonly BAR_RECT_CLASS = "bar";

    public DEFAULT_CONFIG: IBarRendererConfig = {
        transitionDuration: 300,
        padding: 1,
        barClass: "bar-outline",
        highlightStrategy: undefined,
        pointerEvents: true,
        enableMinBarThickness: true,
    };

    public readonly barContainerClass = "bar-container";

    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<IRectangleAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const target = renderSeries.containers[RenderLayerName.data];
        const dataSeries = renderSeries.dataSeries;
        const accessors = dataSeries.accessors;

        const attrsGenerator = this.getAttrsGenerator(
            dataSeries,
            renderSeries.scales
        );

        // We define here a local d3 variable to later re-use saved here data
        const generatedAttrs = local<IPosition>();

        // TODO: This is tricky: we should not draw anything for hidden data
        // (seriesOffset will be undefined and this means we should provide empty array to d3).
        // TODO fix this
        const bars = target
            .selectAll(`g.${this.barContainerClass}`)
            .data(dataSeries.data);

        bars.exit().remove();

        const barContainers = bars
            .enter()
            .append("g")
            .classed(this.barContainerClass, true);

        barContainers.append("rect").on("click", (d: any, i: number) => {
            this.emitBarClick(renderSeries, d, i, rendererSubject);
        });

        const getCssClass = (d: any, i: number) =>
            (typeof accessors.data?.cssClass !== "undefined" &&
                " " +
                    accessors.data.cssClass(
                        d,
                        i,
                        dataSeries.data,
                        dataSeries
                    )) ||
            "";

        barContainers
            .merge(bars as any)
            .property(generatedAttrs, (d, i) => attrsGenerator(d, i)) // This saves attrsGenerator() output to local d3 variable generatedAttrs
            .select<Element>("rect")
            .attr(
                "class",
                (d, i) =>
                    `${BarRenderer.BAR_RECT_CLASS} ${this.config.barClass}${
                        this.config.pointerEvents ? " pointer-events" : ""
                    }` + getCssClass(d, i)
            )
            .style("cursor", this.config.cursor ?? "")
            .style("stroke-width", this.config?.strokeWidth ?? "")
            .style("fill", (d: any, i: number) =>
                accessors.data.color
                    ? accessors.data.color(d, i, dataSeries.data, dataSeries)
                    : accessors.series.color?.(dataSeries.id, dataSeries)
            )
            .attrs(function () {
                // @ts-ignore: Suppressing shadowed this and implicit any type error
                return generatedAttrs.get(this) as any;
            })
            .select<Element>("rect")
            .style("fill", (d: any, i: number) =>
                accessors.data.color
                    ? accessors.data.color(d, i, dataSeries.data, dataSeries)
                    : accessors.series.color?.(dataSeries.id, dataSeries)
            )
            .attrs(generatedAttrs.get as any); // TODO: find a way to convert to ValueMap<>

        if (accessors.data.marker) {
            barContainers.append("g").classed("bar-icon", true);

            barContainers
                .merge(bars as any)
                .select<Element>("g.bar-icon")
                .html(function (d, i) {
                    const barSize = generatedAttrs.get(this);

                    if (
                        !barSize ||
                        isUndefined(barSize?.height) ||
                        isUndefined(barSize?.width)
                    ) {
                        throw new Error("barSize is undefined");
                    }

                    const minBarSide =
                        Math.min(barSize.height, barSize.width) - 1;
                    if (minBarSide >= BarRenderer.MIN_BAR_SIZE_FOR_ICON) {
                        return accessors.data.marker?.(
                            d,
                            i,
                            dataSeries.data,
                            dataSeries
                        );
                    }
                })
                .attr("transform", function (this) {
                    const barAttrs = generatedAttrs.get(this);

                    if (
                        !barAttrs ||
                        isUndefined(barAttrs?.height) ||
                        isUndefined(barAttrs?.width)
                    ) {
                        throw new Error("barAttrs is undefined");
                    }

                    return `translate(${
                        barAttrs.x + barAttrs.width / 2
                    }, ${barAttrs.y + barAttrs.height / 2})`;
                });
        }
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(
        series: IDataSeries<IRectangleAccessors>,
        values: { [p: string]: any },
        scales: Scales
    ): number {
        return this.config.highlightStrategy
            ? this.config.highlightStrategy.getDataPointIndex(
                  this,
                  series,
                  values,
                  scales
              )
            : DATA_POINT_INTERACTION_RESET;
    }

    /** See {@link Renderer#highlightDataPoint} */
    public highlightDataPoint(
        renderSeries: IRenderSeries<IRectangleAccessors>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        if (this.config.highlightStrategy) {
            this.config.highlightStrategy.highlightDataPoint(
                this,
                renderSeries,
                dataPointIndex,
                rendererSubject
            );
        }
    }

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(
        dataSeries: IDataSeries<IRectangleAccessors>,
        index: number,
        scales: Scales
    ): IPosition {
        const d = dataSeries.data[index];
        return d && this.getAttrsGenerator(dataSeries, scales)(d, index);
    }

    public getDataPoint(
        renderSeries: IRenderSeries<IRectangleAccessors>,
        data: any,
        i: number
    ): IDataPoint {
        return {
            seriesId: renderSeries.dataSeries.id,
            dataSeries: renderSeries.dataSeries,
            index: i,
            data: data,
            position: data
                ? this.getDataPointPosition(
                      renderSeries.dataSeries,
                      i,
                      renderSeries.scales
                  )
                : undefined,
        };
    }

    public filterDataByDomain(data: any[]): any[] {
        return data;
    }

    public getDomain(
        data: any[],
        dataSeries: IDataSeries<IRectangleAccessors>,
        scaleKey: string,
        scale: IScale<any>
    ): any[] {
        const accessors = dataSeries.accessors.data;
        const accessorSuffix = scaleKey.toUpperCase();
        const accessor =
            (name: string) => (d: any, i: number, arr: ArrayLike<unknown>) =>
                accessors[name + accessorSuffix]?.(
                    d,
                    i,
                    Array.from(arr),
                    dataSeries
                );
        if (scale.isContinuous()) {
            return !data || data.length === 0
                ? EMPTY_CONTINUOUS_DOMAIN
                : [min(data, accessor("start")), max(data, accessor("end"))];
        } else {
            const values =
                data && data.length > 0 ? data.map(accessor("start")) : [];
            const maxLength = Math.max(
                ...values.map((d) => (isArray(d) ? d.length : -1))
            );
            if (maxLength >= 0) {
                return Array.from(Array(maxLength)).map((e, i) => {
                    const scalesDomains = values.map((d) =>
                        i < d.length ? d[i] : []
                    );
                    return uniq(flatten(scalesDomains));
                });
            } else {
                return [uniq(values)];
            }
        }
    }

    protected emitBarClick(
        renderSeries: IRenderSeries<IRectangleAccessors>,
        data: any,
        i: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        rendererSubject.next({
            eventName: SELECT_DATA_POINT_EVENT,
            data: this.getDataPoint(renderSeries, data, i),
        });
    }

    /**
     * Returns function to generate attributes to draw bar from dataSeries that typically comes from preprocessor with help of accessors that
     * are aware of how to access renderParameters to draw individual bars
     * @param dataSeries Series to draw
     * @param scales Scales used to draw bars
     * Except of bars this is also used for highlights (which may have a bit different values)
     */
    protected getAttrsGenerator(
        dataSeries: IDataSeries<IRectangleAccessors>,
        scales: Scales
    ): (d: any, i: number) => IPosition {
        const accessors = dataSeries.accessors.data;
        return (d: any, i: number): IPosition => {
            const x = this.getDimensions(
                accessors,
                d,
                i,
                dataSeries,
                scales.x,
                "X"
            );
            const y = this.getDimensions(
                accessors,
                d,
                i,
                dataSeries,
                scales.y,
                "Y"
            );

            return {
                x: x.start,
                width: x.thickness,
                y: y.start,
                height: y.thickness,
            };
        };
    }

    private getDimensions(
        accessors: IRectangleDataAccessors,
        d: any,
        i: number,
        dataSeries: IDataSeries<IRectangleAccessors>,
        scale: IScale<any>,
        accessorSuffix: string
    ): { thickness: number; start: number } {
        let start: number;
        let thickness: number;

        const thicknessAccessor = accessors["thickness" + accessorSuffix];
        const startAccessor =
            dataSeries.accessors.data["start" + accessorSuffix];
        const endAccessor = dataSeries.accessors.data["end" + accessorSuffix];
        thickness = thicknessAccessor?.(d, i, dataSeries.data, dataSeries);

        if (!isUndefined(thickness)) {
            if (!startAccessor) {
                throw new Error("Can't compute dimensions");
            }

            start =
                convert(
                    scale,
                    startAccessor(d, i, dataSeries.data, dataSeries),
                    0.5
                ) -
                thickness / 2;
        } else {
            if (!startAccessor || !endAccessor) {
                throw new Error("Can't compute dimensions");
            }

            const x1 = convert(
                scale,
                startAccessor(d, i, dataSeries.data, dataSeries),
                0
            );
            const x2 = convert(
                scale,
                endAccessor(d, i, dataSeries.data, dataSeries),
                1
            );

            start = Math.min(x1, x2);
            thickness = Math.abs(x1 - x2);

            if (isBandScale(scale)) {
                if (isUndefined(this.config.padding)) {
                    throw new Error("Config is not defined");
                }
                start += this.config.padding;
                thickness -= this.config.padding * 2;
            }

            if (this.config.enableMinBarThickness) {
                thickness = Math.max(thickness, BarRenderer.MIN_BAR_THICKNESS);
            }
        }
        return { start, thickness };
    }
}
