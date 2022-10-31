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

import { select, Selection } from "d3-selection";
import { Subject } from "rxjs";

import {
    DATA_POINT_INTERACTION_RESET,
    INTERACTION_DATA_POINT_EVENT,
} from "src/constants";

import { LinearScale } from "../core/common/scales/linear-scale";
import { IXYScales } from "../core/common/scales/types";
import {
    D3Selection,
    IDataPoint,
    IDataSeries,
    IInteractionDataPointEvent,
    InteractionType,
    IRenderContainers,
    IRendererEventPayload,
} from "../core/common/types";
import { ILineAccessors, LineAccessors } from "./line/line-accessors";
import { MarkerUtils } from "./marker-utils";
import { RenderLayerName } from "./types";

describe("Marker Utils", () => {
    let svg: Selection<SVGSVGElement, any, null, undefined>;
    let dataSeries: IDataSeries<ILineAccessors>;
    let scales: IXYScales;
    const containers: IRenderContainers = {};

    beforeEach(() => {
        svg = select(document.createElement("div")).append("svg");

        // @ts-ignore: Disabled for testing purposes
        containers[RenderLayerName.foreground] = svg.append("g");

        const accessors = new LineAccessors();
        scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };

        dataSeries = {
            id: "1",
            name: "Series 1",
            data: [
                { x: 50, y: 50 },
                { x: 1000, y: 1000 },
            ],
            accessors: accessors,
        };
    });

    describe("manageMarker", () => {
        beforeEach(() => {
            scales.x.range([0, 100]);
            scales.x.domain([0, 100]);
            scales.y.range([0, 100]);
            scales.y.domain([0, 100]);
        });

        it("creates a marker when it doesn't exist", () => {
            const drawMarkerSpy = spyOn(
                MarkerUtils,
                "drawMarker"
            ).and.callThrough();

            MarkerUtils.manageMarker(
                dataSeries,
                scales,
                0,
                containers[RenderLayerName.foreground],
                new Subject<IRendererEventPayload>()
            );

            expect(drawMarkerSpy).toHaveBeenCalled();
        });

        it("removes a marker when it doesn't exist", () => {
            const drawMarkerSpy = spyOn(
                MarkerUtils,
                "drawMarker"
            ).and.callThrough();
            const removeMarkerSpy = spyOn(
                MarkerUtils,
                "removeMarker"
            ).and.callThrough();

            MarkerUtils.manageMarker(
                dataSeries,
                scales,
                0,
                containers[RenderLayerName.foreground],
                new Subject<IRendererEventPayload>()
            );

            expect(drawMarkerSpy).toHaveBeenCalled();
            expect(removeMarkerSpy).not.toHaveBeenCalled();

            MarkerUtils.manageMarker(
                dataSeries,
                scales,
                1,
                containers[RenderLayerName.foreground],
                new Subject<IRendererEventPayload>()
            );

            expect(removeMarkerSpy).toHaveBeenCalled();
        });

        it("removes the marker when the data series is empty", () => {
            const removeMarkerSpy = spyOn(
                MarkerUtils,
                "removeMarker"
            ).and.callThrough();

            dataSeries.data = [];
            MarkerUtils.manageMarker(
                dataSeries,
                scales,
                0,
                containers[RenderLayerName.foreground],
                new Subject<IRendererEventPayload>()
            );

            expect(removeMarkerSpy).toHaveBeenCalled();
        });
    });

    describe("drawMarker", () => {
        let markerTarget: D3Selection | D3Selection<SVGGElement>;
        let dataPointSubject: Subject<
            IRendererEventPayload<IInteractionDataPointEvent>
        >;
        let dataPoint: IDataPoint;

        beforeEach(() => {
            const x = scales.x.convert(
                dataSeries.accessors.data.x(
                    dataSeries.data[1],
                    1,
                    dataSeries.data,
                    dataSeries
                )
            );
            const y = scales.y.convert(
                dataSeries.accessors.data.y(
                    dataSeries.data[1],
                    1,
                    dataSeries.data,
                    dataSeries
                )
            );
            dataPoint = {
                index: 1,
                data: dataSeries.data[1],
                seriesId: dataSeries.id,
                position: { x, y },
                dataSeries,
            };

            dataPointSubject = new Subject<
                IRendererEventPayload<IInteractionDataPointEvent>
            >();
        });

        it("should add a 'mouseenter' listener to the marker target", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            markerTarget = container.select("g.marker");

            const spy = spyOn(dataPointSubject, "next");
            // @ts-ignore - possibly undefined
            markerTarget.on("mouseenter")();
            expect(spy).toHaveBeenCalledWith({
                eventName: INTERACTION_DATA_POINT_EVENT,
                data: {
                    interactionType: InteractionType.Hover,
                    dataPoint,
                },
            });
        });

        it("should add a 'mouseleave' listener to the marker target", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            markerTarget = container.select("g.marker");

            const spy = spyOn(dataPointSubject, "next");
            // @ts-ignore - possibly undefined
            markerTarget.on("mouseleave")();
            expect(spy).toHaveBeenCalledWith({
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

        it("should add a 'click' listener to the marker target", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            markerTarget = container.select("g.marker");

            const spy = spyOn(dataPointSubject, "next");
            // @ts-ignore - possibly undefined
            markerTarget.on("click")();
            expect(spy).toHaveBeenCalledWith({
                eventName: INTERACTION_DATA_POINT_EVENT,
                data: {
                    interactionType: InteractionType.Click,
                    dataPoint,
                },
            });
        });

        it("should not add the 'pointer-events' class to the target's class list by default", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            markerTarget = container.select("g.marker");

            expect(markerTarget.classed("pointer-events")).toEqual(false);
        });

        it("should add the 'pointer-events' class to the target's class list if interaction is enabled", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject,
                MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
                { enabled: true }
            );
            markerTarget = container.select("g.marker");

            expect(markerTarget.classed("pointer-events")).toEqual(true);
        });

        it("should not add the 'pointer-events-click' class to the target's class list by default", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            markerTarget = container.select("g.marker");

            expect(markerTarget.classed("pointer-events-click")).toEqual(false);
        });

        it("should not add the 'pointer-events-click' class to the target's class list if 'clickable' is 'true' but interaction is not enabled", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject,
                MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
                { enabled: false, clickable: true }
            );
            markerTarget = container.select("g.marker");

            expect(markerTarget.classed("pointer-events-click")).toEqual(false);
        });

        it("should add the 'pointer-events-click' class to the target's class list if interaction is enabled and 'clickable' is 'true'", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject,
                MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
                { enabled: true, clickable: true }
            );
            markerTarget = container.select("g.marker");

            expect(markerTarget.classed("pointer-events-click")).toEqual(true);
        });

        it("should add the MarkerUtils.MARKER_PATH_CLASS class to the path's classList", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            expect(
                (
                    container.select("path").node() as HTMLElement
                ).classList.contains(MarkerUtils.MARKER_PATH_CLASS)
            ).toEqual(true);
        });

        it("should not define 'x' and 'y' attribute values on the path element by default", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject
            );
            const pathElement = container.select("path").node() as HTMLElement;
            expect((<any>pathElement.attributes).x).toBeUndefined();
            expect((<any>pathElement.attributes).y).toBeUndefined();
        });

        it("should define 'x' and 'y' attribute values on the path element if interaction is enabled", () => {
            const container = containers[RenderLayerName.foreground];
            MarkerUtils.drawMarker(
                dataPoint,
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.marker(dataSeries.id, dataSeries),
                // @ts-ignore - possibly undefined
                dataSeries.accessors.series.color(dataSeries.id, dataSeries),
                container,
                dataPointSubject,
                MarkerUtils.DEFAULT_MARKER_CONTAINER_CLASS,
                { enabled: true }
            );
            const pathElement = container.select("path").node() as HTMLElement;
            expect((<any>pathElement.attributes).x.value).toEqual(
                dataPoint.position?.x.toString()
            );
            expect((<any>pathElement.attributes).y.value).toEqual(
                dataPoint.position?.y.toString()
            );
        });
    });
});
