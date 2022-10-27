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

import { Subject } from "rxjs";

import { UtilService } from "@nova-ui/bits";

import {
    DATA_POINT_INTERACTION_RESET,
    INTERACTION_DATA_POINT_EVENT,
} from "../constants";
import { isInRange } from "../core/common/scales/helpers/is-in-range";
import { IXYScales } from "../core/common/scales/types";
import {
    D3Selection,
    IAccessors,
    IChartMarker,
    IDataPoint,
    IDataSeries,
    IInteractionDataPointEvent,
    InteractionType,
    IRendererEventPayload,
} from "../core/common/types";
import { DEFAULT_MARKER_INTERACTION_CONFIG } from "./constants";

export class MarkerUtils {
    /** The default class for the marker's container */
    public static readonly DEFAULT_MARKER_CONTAINER_CLASS = "marker";

    /** The class used for the marker's svg path */
    public static readonly MARKER_PATH_CLASS = "marker-path";

    /**
     * This method impersonates marker related logic used in various renderers
     *
     * @param dataSeries
     * @param scales
     * @param dataPointIndex
     * @param container
     * @param rendererSubject
     */
    public static manageMarker(
        dataSeries: IDataSeries<IAccessors>,
        scales: IXYScales,
        dataPointIndex: number,
        container: D3Selection<SVGGElement>,
        rendererSubject: Subject<IRendererEventPayload>,
        markerInteractionConfig = DEFAULT_MARKER_INTERACTION_CONFIG
    ): void {
        if (!container) {
            throw new Error("Container doesn't exist!");
        }

        if (dataSeries.data.length === 0) {
            MarkerUtils.removeMarker(container);
            return;
        }

        const accessors = dataSeries.accessors;

        if (dataPointIndex < 0) {
            dataPointIndex = dataSeries.data.length - 1;
        }

        const dataPoint = dataSeries.data[dataPointIndex];

        if (!accessors.data?.x || !accessors.data.y) {
            throw new Error("Color or marker are undefined");
        }

        const x = scales.x.convert(
            accessors.data.x(
                dataPoint,
                dataPointIndex,
                dataSeries.data,
                dataSeries
            )
        );
        const y = scales.y.convert(
            accessors.data.y(
                dataPoint,
                dataPointIndex,
                dataSeries.data,
                dataSeries
            )
        );

        if (
            typeof x !== "undefined" &&
            typeof y !== "undefined" &&
            isInRange(scales.x, x) &&
            isInRange(scales.y, y)
        ) {
            const seriesId = dataSeries.id;
            const dataPointInfo: IDataPoint = {
                index: dataPointIndex,
                data: dataPoint,
                seriesId: seriesId,
                position: { x, y },
                dataSeries,
            };

            if (!accessors.series?.marker || !accessors.series?.color) {
                throw new Error("Color or marker are undefined");
            }

            MarkerUtils.drawMarker(
                dataPointInfo,
                accessors.series.marker(seriesId, dataSeries),
                accessors.series.color(seriesId, dataSeries),
                container,
                rendererSubject,
                MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
                markerInteractionConfig
            );
        } else {
            MarkerUtils.removeMarker(container);
        }
    }

    public static drawMarker(
        dataPoint: IDataPoint,
        marker: IChartMarker,
        color: string,
        target: D3Selection<SVGGElement>,
        dataPointSubject: Subject<
            IRendererEventPayload<IInteractionDataPointEvent>
        >,
        className: string = MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
        markerInteractionConfig = DEFAULT_MARKER_INTERACTION_CONFIG
    ) {
        let markerTarget: D3Selection | D3Selection<SVGGElement> =
            target.select(`g.${className}`);
        const xCoord = dataPoint?.position?.x;
        const yCoord = dataPoint?.position?.y;
        const attrs = {
            transform: `translate(${xCoord}, ${yCoord})`,
            cursor: "crosshair",
        };

        const getPointerEventsClass = () =>
            `${markerInteractionConfig.enabled ? " pointer-events" : ""}`;
        const getPointerEventsClickClass = () =>
            `${
                markerInteractionConfig.enabled &&
                markerInteractionConfig.clickable
                    ? " pointer-events-click"
                    : ""
            }`;

        if (markerTarget.empty()) {
            markerTarget = target
                .append("g")
                .classed(
                    `${className}${getPointerEventsClass()}${getPointerEventsClickClass()}`,
                    true
                );
        }

        marker.setColor(color);
        markerTarget.attrs(attrs);

        markerTarget.on("mouseenter", () => {
            dataPointSubject.next({
                eventName: INTERACTION_DATA_POINT_EVENT,
                data: { interactionType: InteractionType.Hover, dataPoint },
            });
        });
        markerTarget.on("mouseleave", () => {
            dataPointSubject.next({
                eventName: INTERACTION_DATA_POINT_EVENT,
                data: {
                    interactionType: InteractionType.Hover,
                    dataPoint: {
                        ...dataPoint,
                        index: DATA_POINT_INTERACTION_RESET,
                    },
                },
            });
        });
        markerTarget.on("click", () => {
            dataPointSubject.next({
                eventName: INTERACTION_DATA_POINT_EVENT,
                data: { interactionType: InteractionType.Click, dataPoint },
            });
        });

        if (
            !(<D3Selection<SVGGElement>>markerTarget)
                .selectAll("g > *")
                .size() &&
            markerTarget.node()
        ) {
            markerTarget
                .node()
                ?.appendChild(UtilService.getSvgFromString(marker.getSvg()));
            (<D3Selection<SVGGElement>>markerTarget)
                .select("path")
                .classed(MarkerUtils.MARKER_PATH_CLASS, true);
        }

        const path = (<D3Selection<SVGGElement>>markerTarget)
            .select("path")
            .node() as HTMLElement;
        if (path && markerInteractionConfig.enabled) {
            // Hack to accommodate existing Firefox hack in MouseInteractiveArea
            const pathRect = path.getBoundingClientRect();
            // 'x' in this case represents the absolute position of the left side of the marker
            path.setAttribute(
                "x",
                Math.ceil(
                    (dataPoint?.position?.x as number) - pathRect.width / 2
                ).toString()
            );
            // 'y' in this case represents the absolute position of the top side of the marker
            path.setAttribute(
                "y",
                Math.ceil(
                    (dataPoint?.position?.y as number) - pathRect.height / 2
                ).toString()
            );
        }
    }

    public static removeMarker(
        target: D3Selection<SVGGElement>,
        className: string = MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS
    ) {
        target.select(`g.${className}`).remove();
    }
}
