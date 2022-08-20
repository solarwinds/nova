import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";
import { Subject } from "rxjs";

import { STANDARD_RENDER_LAYERS } from "../../constants";
import { CHART_PALETTE_CS1 } from "../../core/common/palette/palettes";
import { SequentialColorProvider } from "../../core/common/palette/sequential-color-provider";
import { LinearScale } from "../../core/common/scales/linear-scale";
import {
    D3Selection,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../core/common/types";
import { MarkerUtils } from "../marker-utils";
import { IRenderSeries, RenderLayerName } from "../types";

import { ILineAccessors, LineAccessors } from "./line-accessors";
import { LineRenderer } from "./line-renderer";

describe("Line Renderer >", () => {
    let renderer: LineRenderer;
    let accessors: ILineAccessors;

    beforeEach(() => {
        renderer = new LineRenderer();
        accessors = new LineAccessors();
    });

    it("should have correct render layers", () => {
        const layers = renderer.getRequiredLayers();
        expect(layers.length).toBe(3);
        expect(layers).toContain(STANDARD_RENDER_LAYERS[RenderLayerName.data]);
        expect(layers).toContain(
            STANDARD_RENDER_LAYERS[RenderLayerName.foreground]
        );
        expect(layers).toContain(
            STANDARD_RENDER_LAYERS[RenderLayerName.unclippedData]
        );
    });

    it("should have an unclipped data layer", () => {
        expect(
            renderer
                .getRequiredLayers()
                .find((layer) => layer.name === RenderLayerName.unclippedData)
                ?.clipped
        ).toEqual(false);
    });

    it("should disable enhanced line caps by default", () => {
        expect(renderer.config.useEnhancedLineCaps).toEqual(false);
    });

    it("should set the default enhanced line cap radius", () => {
        expect(typeof renderer.config.enhancedLineCap?.radius).toEqual(
            "number"
        );
        expect(renderer.config.enhancedLineCap?.radius).toEqual(
            (<any>renderer).DEFAULT_CONFIG.enhancedLineCap?.radius
        );
    });

    describe("draw()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let dataSeries: IDataSeries<ILineAccessors>;
        let renderSeries: IRenderSeries<ILineAccessors>;
        let path: D3Selection;
        let lineCaps: D3Selection;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            containers[RenderLayerName.unclippedData] = svg.append("g");
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                accessors: accessors,
            };
            renderSeries = {
                dataSeries,
                containers,
                scales: { x: new LinearScale(), y: new LinearScale() },
            };
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
            path = containers[RenderLayerName.data].select("path");
            lineCaps =
                containers[RenderLayerName.unclippedData].selectAll("circle");
        });

        it("should create the path", () => {
            const provider = new SequentialColorProvider(CHART_PALETTE_CS1);
            expect(path.node()).toBeTruthy();
            expect(path.attr("d")).toBe("M0,0L1,1");
            expect(path.attr("stroke")).toBe(provider.get(dataSeries.id));
            expect(path.attr("stroke-width")).toBe("2");
            expect(path.attr("fill")).toBe("none");
        });

        it("should update the path with new data", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries.data = [
                { x: 1, y: 1 },
                { x: 0, y: 0 },
            ];
            renderer.draw(newSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).toBe("M1,1L0,0");
        });

        it("should produce an empty path if the data is empty", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries.data = [];
            renderer.draw(newSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).toBe("");
        });

        describe("enhanced line caps", () => {
            it("should not draw enhanced line caps by default", () => {
                expect(lineCaps.nodes().length).toEqual(0);
            });

            it("should draw enhanced line caps if 'useEnhancedLineCaps' is 'true'", () => {
                renderer.config.useEnhancedLineCaps = true;
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                lineCaps =
                    containers[RenderLayerName.unclippedData].selectAll(
                        "circle"
                    );

                expect(lineCaps.nodes().length).toEqual(dataSeries.data.length);
                lineCaps.nodes().forEach((node, index) => {
                    expect(node.getAttribute("r")).toEqual(
                        renderer.config.enhancedLineCap?.radius?.toString() as string
                    );
                    expect(node.getAttribute("cx")).toEqual(
                        dataSeries.data[index].x.toString()
                    );
                    expect(node.getAttribute("cy")).toEqual(
                        dataSeries.data[index].y.toString()
                    );
                    expect(node.getAttribute("style")).toEqual(
                        `fill: ${
                            accessors?.series?.color &&
                            accessors?.series?.color(dataSeries.id, dataSeries)
                        };`
                    );
                    expect(node.classList).toContain(
                        LineRenderer.LINE_CAP_CLASS_NAME
                    );
                });
            });

            it("should update the positions of the line caps on redraw", () => {
                renderer.config.useEnhancedLineCaps = true;
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                renderSeries.dataSeries.data[1].x = 3;
                renderSeries.dataSeries.data[1].y = 4;
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                lineCaps =
                    containers[RenderLayerName.unclippedData].selectAll(
                        "circle"
                    );

                lineCaps.nodes().forEach((node, index) => {
                    expect(node.getAttribute("cx")).toEqual(
                        dataSeries.data[index].x.toString()
                    );
                    expect(node.getAttribute("cy")).toEqual(
                        dataSeries.data[index].y.toString()
                    );
                });
            });

            it("should allow stroke, stroke-width, and fill to be configured", () => {
                renderer.config.useEnhancedLineCaps = true;
                renderer.config.enhancedLineCap = {
                    stroke: "white",
                    strokeWidth: 3,
                    fill: "red",
                };
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                lineCaps =
                    containers[RenderLayerName.unclippedData].selectAll(
                        "circle"
                    );

                lineCaps.nodes().forEach((node) => {
                    expect(node.getAttribute("style")).toEqual(
                        `stroke-width: ${renderer.config.enhancedLineCap?.strokeWidth}; ` +
                            `fill: ${renderer.config.enhancedLineCap?.fill}; stroke: ${renderer.config.enhancedLineCap?.stroke};`
                    );
                });
            });

            it("should allow the radius to be configured", () => {
                renderer.config.useEnhancedLineCaps = true;
                renderer.config.enhancedLineCap = {
                    radius: 10,
                };
                renderer.draw(
                    renderSeries,
                    new Subject<IRendererEventPayload>()
                );
                lineCaps =
                    containers[RenderLayerName.unclippedData].selectAll(
                        "circle"
                    );

                lineCaps.nodes().forEach((node) => {
                    expect(node.getAttribute("r")).toEqual(
                        renderer.config.enhancedLineCap?.radius?.toString() as string
                    );
                });
            });
        });
    });

    describe("highlightDataPoint()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let dataSeries: IDataSeries<ILineAccessors>;
        let renderSeries: IRenderSeries<ILineAccessors>;
        let marker: D3Selection;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.foreground] = svg.append("g");

            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 0, y: 0 },
                    { x: 1, y: 1 },
                ],
                accessors: accessors,
            };

            renderSeries = {
                dataSeries,
                containers,
                scales: { x: new LinearScale(), y: new LinearScale() },
            };
        });

        it("should show marker", () => {
            renderer.highlightDataPoint(
                renderSeries,
                0,
                new Subject<IRendererEventPayload>()
            );
            marker = containers[RenderLayerName.foreground].select("g.marker");
            const el: Element | null = marker.node();

            expect(el).toBeTruthy();
            expect(marker.attr("transform")).toBe("translate(0, 0)");
            expect(marker.attr("cursor")).toBe("crosshair");
            expect(
                (
                    marker.select("path").node() as HTMLElement
                ).classList.contains(MarkerUtils.MARKER_PATH_CLASS)
            ).toEqual(true);
        });

        it("should not show marker when out of range", () => {
            renderSeries.scales.x.domain([0.1, 0.9]);

            renderer.highlightDataPoint(
                renderSeries,
                0,
                new Subject<IRendererEventPayload>()
            );
            marker = containers[RenderLayerName.foreground].select("g.marker");

            expect(marker.node()).toBeFalsy();
        });
    });
});
