import isNil from "lodash/isNil";
import { Subject } from "rxjs";

import {
    DATA_POINT_NOT_FOUND,
    HIGHLIGHT_SERIES_EVENT,
    INTERACTION_SERIES_EVENT,
} from "../../../constants";
import { Scales } from "../../../core/common/scales/types";
import {
    D3Selection,
    IDataPoint,
    IDataSeries,
    InteractionType,
    IRendererEventPayload,
} from "../../../core/common/types";
import {
    IHighlightStrategy,
    IRenderSeries,
    RenderLayerName,
} from "../../types";
import { ILineAccessors } from "../line-accessors";
import { LineRenderer } from "../line-renderer";

export class LineSelectSeriesInteractionStrategy
    implements IHighlightStrategy<ILineAccessors, LineRenderer>
{
    public readonly INTERACTION_MARGIN = 8;

    public draw(
        renderer: LineRenderer,
        renderSeries: IRenderSeries<ILineAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const target = renderSeries.containers[RenderLayerName.data];

        let interactionPath: D3Selection<SVGPathElement> =
            target.select("path.interaction");

        if (isNil(renderer.config.strokeWidth)) {
            throw new Error("renderer.config.strokeWidth is not defined");
        }

        if (interactionPath.empty()) {
            interactionPath = target
                .append("path")
                .classed("interaction", true)
                .classed(`pointer-events pointer-events-click`, true)
                .attrs({
                    "stroke-width":
                        renderer.config.strokeWidth +
                        2 * this.INTERACTION_MARGIN,
                    stroke: "transparent",
                    fill: "none",
                })
                .on("mouseenter", () => {
                    const dataPoint: Omit<IDataPoint, "position"> = {
                        seriesId: renderSeries.dataSeries.id,
                        dataSeries: renderSeries.dataSeries,
                        // TODO: doesn't work with empty data
                        index: 0,
                        data: renderSeries.dataSeries.data[0],
                    };

                    rendererSubject.next({
                        eventName: HIGHLIGHT_SERIES_EVENT,
                        data: dataPoint,
                    });
                })
                .on("mouseleave", () => {
                    const dataPoint: Omit<IDataPoint, "position" | "data"> = {
                        seriesId: renderSeries.dataSeries.id,
                        dataSeries: renderSeries.dataSeries,
                        index: DATA_POINT_NOT_FOUND,
                    };

                    rendererSubject.next({
                        eventName: HIGHLIGHT_SERIES_EVENT,
                        data: dataPoint,
                    });
                })
                .on("click", (d: any, i: number) => {
                    this.emitEvent(
                        renderer,
                        INTERACTION_SERIES_EVENT,
                        InteractionType.Click,
                        renderSeries,
                        d,
                        i,
                        rendererSubject
                    );
                });
        }

        renderer.drawLine(renderSeries, interactionPath);
    }

    // TODO: Get rid of this function or make it optional in interface
    public getDataPointIndex(
        renderer: LineRenderer,
        series: IDataSeries<ILineAccessors>,
        values: { [p: string]: any },
        scales: Scales
    ): number {
        // @ts-ignore
        return;
    }

    public highlightDataPoint(
        renderer: LineRenderer,
        renderSeries: IRenderSeries<ILineAccessors>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    private emitEvent(
        renderer: LineRenderer,
        eventName: string,
        interactionType: InteractionType,
        renderSeries: IRenderSeries<ILineAccessors>,
        data: any,
        i: number,
        rendererSubject: Subject<IRendererEventPayload>
    ) {
        const dataPoint: IDataPoint = {
            seriesId: renderSeries.dataSeries.id,
            dataSeries: renderSeries.dataSeries,
            index: i,
            data: data,
            position: renderer.getDataPointPosition(
                renderSeries.dataSeries,
                i,
                renderSeries.scales
            ),
        };
        rendererSubject.next({
            eventName: eventName,
            data: {
                interactionType: interactionType,
                payload: dataPoint,
            },
        });
    }
}
