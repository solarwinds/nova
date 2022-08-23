import { Arc, arc, DefaultArcObject } from "d3-shape";
import defaultsDeep from "lodash/defaultsDeep";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import {
    DATA_POINT_NOT_FOUND,
    HIGHLIGHT_DATA_POINT_EVENT,
    HIGHLIGHT_SERIES_EVENT,
    INTERACTION_DATA_POINTS_EVENT,
    SELECT_DATA_POINT_EVENT,
} from "../../constants";
import { Renderer } from "../../core/common/renderer";
import { Scales } from "../../core/common/scales/types";
import {
    IDataPoint,
    IDataSeries,
    InteractionType,
    IPosition,
    IRadialRendererConfig,
    IRendererEventPayload,
} from "../../core/common/types";
import { IRenderSeries, RenderLayerName } from "../types";
import { IRadialAccessors } from "./accessors/radial-accessors";

/**
 * Default configuration for Radial Renderer
 */
export const DEFAULT_RADIAL_RENDERER_CONFIG: IRadialRendererConfig = {
    annularWidth: 20,
    annularPadding: 5,
    maxThickness: 30,
    annularGrowth: 0.15,
    cursor: "default",
    enableSeriesHighlighting: true,
    enableDataPointHighlighting: true,
};

/**
 * Radial renderer is a generic renderer that is able to draw pie and donut charts
 */
export class RadialRenderer extends Renderer<IRadialAccessors> {
    protected segmentWidth?: number;

    /**
     * Creates an instance of RadialRenderer.
     * @param {IRadialRendererConfig} [config]
     * Renderer configuration object. Defaults to `DEFAULT_RADIAL_RENDERER_CONFIG` constant value.
     */
    constructor(public config: IRadialRendererConfig = {}) {
        super(config);
        this.config = defaultsDeep(this.config, DEFAULT_RADIAL_RENDERER_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<IRadialAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const dataContainer = renderSeries.containers[RenderLayerName.data];

        const data = renderSeries.dataSeries.data;
        const accessors = renderSeries.dataSeries.accessors;

        // TODO: This handles several data points withing one series as well. Most probably this can be abstracted to other renderer
        const arcGenerator = (d: any, index: number) => {
            const separateArc = this.getArc(
                renderSeries.scales.r.range(),
                arc(),
                index
            );
            return separateArc(d);
        };
        this.segmentWidth = this.getSegmentWidth(renderSeries);

        const g: any = dataContainer.selectAll("path.arc").data(data);

        g.exit().remove();

        g.enter()
            .append("path")
            .attr("class", "arc pointer-events nui-chart--path__outline")
            .style("stroke-width", this.config.strokeWidth)
            .style("cursor", this.config.cursor)
            .on("mouseenter", (d: any, i: number) => {
                this.emitDataPointHighlight(
                    renderSeries,
                    d,
                    i,
                    rendererSubject
                );
            })
            .on("mouseleave", (d: any, i: number) => {
                this.emitDataPointHighlight(
                    renderSeries,
                    null,
                    DATA_POINT_NOT_FOUND,
                    rendererSubject
                );
            })
            // TODO: testing event, remove in favor or generic interaction setup
            .on("click", (d: any, i: number) => {
                rendererSubject.next({
                    eventName: SELECT_DATA_POINT_EVENT,
                    data: {
                        seriesId: renderSeries.dataSeries.id,
                        index: i,
                        data: d.data,
                        position: this.getDataPointPosition(
                            renderSeries.dataSeries,
                            i,
                            renderSeries.scales
                        ),
                    },
                });
            })
            .merge(g)
            .attr("d", arcGenerator)
            .attr("fill", (d: any, i: number) =>
                accessors.data.color
                    ? accessors.data.color(
                          d.data,
                          i,
                          data,
                          renderSeries.dataSeries
                      )
                    : accessors.series.color?.(
                          renderSeries.dataSeries.id,
                          renderSeries.dataSeries
                      )
            );
    }

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(
        dataSeries: IDataSeries<IRadialAccessors>,
        index: number,
        scales: Scales
    ): IPosition | undefined {
        if (index < 0) {
            return undefined;
        }
        const pieArcData: DefaultArcObject = dataSeries.data[index];
        const dataPointArc = this.getArc(scales.r.range(), arc(), index);
        const centroid = dataPointArc.centroid(pieArcData);

        return {
            x: centroid[0],
            y: centroid[1],
            width: 0,
            height: 0,
        };
    }

    public getInnerRadius(range: number[], index: number): number {
        if (
            isUndefined(this.segmentWidth) ||
            isUndefined(this.config.annularPadding)
        ) {
            throw new Error("Can't compute inner radius");
        }

        const calculatedRadius =
            range[1] -
            range[0] -
            this.segmentWidth -
            index * (this.config.annularPadding + this.segmentWidth);
        return calculatedRadius >= 0 ? calculatedRadius : 0;
    }

    public getOuterRadius(range: [number, number], index: number): number {
        if (
            isUndefined(this.segmentWidth) ||
            isUndefined(this.config.annularPadding)
        ) {
            throw new Error("Can't compute outer radius");
        }

        const calculatedRadius =
            range[1] -
            range[0] -
            index * (this.config.annularPadding + this.segmentWidth);
        return calculatedRadius >= 0 ? calculatedRadius : 0;
    }

    protected getArc(
        range: [number, number],
        generatedArc: Arc<any, DefaultArcObject>,
        index: number
    ): Arc<any, DefaultArcObject> {
        const innerRadius = this.getInnerRadius(range, index);
        return generatedArc
            .outerRadius(this.getOuterRadius(range, index))
            .innerRadius(innerRadius);
    }

    protected getSegmentWidth(renderSeries: IRenderSeries<IRadialAccessors>) {
        if (!(this.config.maxThickness && this.config.annularGrowth)) {
            return this.config.annularWidth;
        } else {
            return Math.min(
                (renderSeries.scales.r.range()[1] -
                    renderSeries.scales.r.range()[0]) *
                    this.config.annularGrowth,
                this.config.maxThickness
            );
        }
    }

    private emitDataPointHighlight(
        renderSeries: IRenderSeries<IRadialAccessors>,
        data: any,
        i: number,
        rendererSubject: Subject<IRendererEventPayload>
    ) {
        const position: IPosition | undefined = this.getDataPointPosition(
            renderSeries.dataSeries,
            i,
            renderSeries.scales
        );

        const dataPoint: IDataPoint = {
            seriesId: renderSeries.dataSeries.id,
            dataSeries: renderSeries.dataSeries,
            index: i,
            data: data,
            position: position,
        };

        if (this.config.enableSeriesHighlighting) {
            rendererSubject.next({
                eventName: HIGHLIGHT_SERIES_EVENT,
                data: dataPoint,
            });
        }

        if (this.config.enableDataPointHighlighting) {
            rendererSubject.next({
                eventName: HIGHLIGHT_DATA_POINT_EVENT,
                data: dataPoint,
            });
        }

        // we're emitting this event manually, because it's not triggered by mouse interactive area in this case
        rendererSubject.next({
            eventName: INTERACTION_DATA_POINTS_EVENT,
            data: {
                interactionType: InteractionType.MouseMove,
                dataPoints: {
                    [renderSeries.dataSeries.id]: dataPoint,
                },
            },
        });
    }
}
