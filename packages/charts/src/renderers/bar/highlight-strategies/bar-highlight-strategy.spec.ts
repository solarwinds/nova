import { select } from "d3-selection";
import { duration } from "moment/moment";
import { Subject } from "rxjs";

import { DATA_POINT_INTERACTION_RESET, DATA_POINT_NOT_FOUND } from "../../../constants";
import { BandScale } from "../../../core/common/scales/band-scale";
import { LinearScale } from "../../../core/common/scales/linear-scale";
import { TimeIntervalScale } from "../../../core/common/scales/time-interval-scale";
import { D3Selection, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../../core/common/types";
import { flushAllD3Transitions } from "../../../spec-helpers/flush-transitions";
import { IRenderSeries, RenderLayerName, RenderState } from "../../types";
import { IBarAccessors } from "../accessors/bar-accessors";
import { VerticalBarAccessors } from "../accessors/vertical-bar-accessors";
import { BarRenderer } from "../bar-renderer";

import { BarHighlightStrategy } from "./bar-highlight-strategy";

describe("BarHighlightStrategy >", () => {

    let renderer: BarRenderer;
    let highlightStrategy: BarHighlightStrategy;
    let accessors: IBarAccessors;

    beforeEach(() => {
        highlightStrategy = new BarHighlightStrategy("x");
        renderer = new BarRenderer();
        accessors = new VerticalBarAccessors();
    });

    describe("highlightDataPoint", () => {
        let svg: D3Selection<SVGSVGElement>;
        let renderSeries: IRenderSeries<IBarAccessors>;
        let bandScale: BandScale;
        let linearScale: LinearScale;
        let dataSeries: IDataSeries<IBarAccessors>;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            // @ts-ignore: Suppressed for testing purposes
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            bandScale = new BandScale();
            linearScale = new LinearScale();
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "Edge",
                        value: 1,
                        "__bar": {
                            category: "Edge",
                            start: 0,
                            end: 5,
                        },
                    },
                    {
                        category: "Chrome",
                        value: 1,
                        "__bar": {
                            category: "Chrome",
                            start: 0,
                            end: 10,
                        },
                    },
                ],
                accessors,
            };
            bandScale.domain(["Edge", "Chrome"]);
            bandScale.range([0, 100]);
            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: bandScale, y: linearScale },
            };
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());
        });

        describe("DATA_POINT_INTERACTION_RESET", () => {
            it("should use 'RenderState.default' for the selected data point", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);

                const spy = spyOn(renderer, "getContainerStateStyles");
                highlightStrategy.highlightDataPoint(renderer, renderSeries, DATA_POINT_INTERACTION_RESET, new Subject());

                const args = spy.calls.allArgs();
                expect(args[0]).toEqual([RenderState.default]);
                expect(args[1]).toEqual([RenderState.deemphasized]);
            });

            it("should use 'RenderState.default' if there is no selected data point", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => DATA_POINT_NOT_FOUND);

                const spy = spyOn(renderer, "getContainerStateStyles");
                highlightStrategy.highlightDataPoint(renderer, renderSeries, DATA_POINT_INTERACTION_RESET, new Subject());

                const args = spy.calls.allArgs();
                expect(args[0]).toEqual([RenderState.default]);
                expect(args[1]).toEqual([RenderState.default]);
            });

            it("should use 'RenderState.deemphasized' for unselected data points", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => 1);

                const spy = spyOn(renderer, "getContainerStateStyles");
                highlightStrategy.highlightDataPoint(renderer, renderSeries, DATA_POINT_INTERACTION_RESET, new Subject());

                const args = spy.calls.allArgs();
                expect(args[0]).toEqual([RenderState.deemphasized]);
                expect(args[1]).toEqual([RenderState.default]);
            });
        });

        describe("hovering over the chart", () => {
            it("should use 'RenderState.emphasized' for the specified data point", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);

                const spy = spyOn(renderer, "getContainerStateStyles");
                highlightStrategy.highlightDataPoint(renderer, renderSeries, 0, new Subject());

                const args = spy.calls.allArgs();
                expect(args[0]).toEqual([RenderState.emphasized]);
                expect(args[1]).toEqual([RenderState.deemphasized]);
            });

            it("should use 'RenderState.emphasized' for the selected data point", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => 1);

                const spy = spyOn(renderer, "getContainerStateStyles");
                highlightStrategy.highlightDataPoint(renderer, renderSeries, 0, new Subject());

                const args = spy.calls.allArgs();
                expect(args[0]).toEqual([RenderState.emphasized]);
                expect(args[1]).toEqual([RenderState.emphasized]);
            });

            it("should apply the correct opacities to the 'bar-container'", () => {
                highlightStrategy = new BarHighlightStrategy("x", 1, () => DATA_POINT_NOT_FOUND);

                highlightStrategy.highlightDataPoint(renderer, renderSeries, 0, new Subject());

                flushAllD3Transitions();
                expect(svg.node()?.innerHTML)
                    .toEqual(`<g><g class="bar-container" opacity="1">` +
                        `<rect class="bar bar-outline pointer-events" x="1" width="48" y="0" height="5" style="fill: var(--nui-color-chart-one);"></rect></g>` +
                        `<g class="bar-container" opacity="0.1">` +
                        `<rect class="bar bar-outline pointer-events" x="51" width="48" y="0" height="10" style="fill: var(--nui-color-chart-one);"></rect>` +
                        `</g></g>`);
            });
        });
    });

    describe("finding the index", () => {
        let dataSeries: IDataSeries<IBarAccessors>;
        let renderSeries: IRenderSeries<IBarAccessors>;
        let linearScale: LinearScale;
        const containers: IRenderContainers = {};

        beforeEach(() => {
            linearScale = new LinearScale();

            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: 10,
                        value: 1,
                        "__bar": {
                            category: 10,
                            start: 0,
                            end: 5,
                        },
                    },
                    {
                        category: 15,
                        value: 1,
                        "__bar": {
                            category: 15,
                            start: 0,
                            end: 10,
                        },
                    },
                ],
                accessors,
            };

            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: linearScale, y: linearScale },
            };
        });

        it("should find the index with an exact value", () => {
            const values = {
                x: 10,
            };

            highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);
            const index = highlightStrategy.getDataPointIndex(renderer, dataSeries, values, renderSeries.scales);
            expect(index).toEqual(0);
        });

        it("should find the index closest if no exact value", () => {
            const values = {
                x: 14,
            };

            highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);
            const index = highlightStrategy.getDataPointIndex(renderer, dataSeries, values, renderSeries.scales);
            expect(index).toEqual(1);
        });

        it("should return -1 if there is no closest index or exact index", () => {
            const values = {
                x: "Edge",
            };
            highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);
            const index = highlightStrategy.getDataPointIndex(renderer, dataSeries, values, renderSeries.scales);
            expect(index).toEqual(-1);
        });

        it("should return -1 if there is no closest index or exact index while using a band scale", () => {
            accessors.data.category = (data: any) => new Date(data.category);

            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "2020-08-29T00:00:00.000-05:00",
                        value: 1,
                        "__bar": {
                            category: "2020-08-29T00:00:00.000-05:00",
                            start: 0,
                            end: 5,
                        },
                    },
                    {
                        category: "2020-08-31T00:00:00.000-05:00",
                        value: 1,
                        "__bar": {
                            category: "2020-08-31T00:00:00.000-05:00",
                            start: 0,
                            end: 10,
                        },
                    },
                ],
                accessors,
            };

            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: new TimeIntervalScale(duration(1, "day")), y: linearScale },
            };

            const values = {
                x: new Date("2020-08-30T00:00:00.000-05:00"),
            };
            highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);
            const index = highlightStrategy.getDataPointIndex(renderer, dataSeries, values, renderSeries.scales);
            expect(index).toEqual(-1);
        });

        it("should return correct index if there is an exact index while using a band scale", () => {
            accessors.data.category = (data: any) => new Date(data.category);

            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [
                    {
                        category: "2020-08-29T00:00:00.000-05:00",
                        value: 1,
                        "__bar": {
                            category: "2020-08-29T00:00:00.000-05:00",
                            start: 0,
                            end: 5,
                        },
                    },
                    {
                        category: "2020-08-31T00:00:00.000-05:00",
                        value: 1,
                        "__bar": {
                            category: "2020-08-31T00:00:00.000-05:00",
                            start: 0,
                            end: 10,
                        },
                    },
                ],
                accessors,
            };

            renderSeries = {
                dataSeries: {
                    ...dataSeries,
                },
                containers,
                scales: { x: new TimeIntervalScale(duration(1, "day")), y: linearScale },
            };

            const values = {
                x: new Date("2020-08-31T00:00:00.000-05:00"),
            };
            highlightStrategy = new BarHighlightStrategy("x", 1, () => 0);
            const index = highlightStrategy.getDataPointIndex(renderer, dataSeries, values, renderSeries.scales);
            expect(index).toEqual(1);
        });
    });

});
