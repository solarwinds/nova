import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";
import each from "lodash/each";
import { Subject } from "rxjs";

import {
    HIGHLIGHT_DATA_POINT_EVENT, HIGHLIGHT_SERIES_EVENT, INTERACTION_DATA_POINTS_EVENT, SELECT_DATA_POINT_EVENT, STANDARD_RENDER_LAYERS
} from "../../constants";
import { CHART_PALETTE_CS1 } from "../../core/common/palette/palettes";
import { SequentialColorProvider } from "../../core/common/palette/sequential-color-provider";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { IScale } from "../../core/common/scales/types";
import { D3Selection, IDataSeries, IRenderContainers, IRendererEventPayload } from "../../core/common/types";
import { IRenderSeries, RenderLayerName } from "../types";

import { IRadialAccessors, RadialAccessors } from "./accessors/radial-accessors";
import { PieRenderer } from "./pie-renderer";
import { radialPreprocessor } from "./radial-preprocessor";
import { RadialRenderer } from "./radial-renderer";

describe("Radial renderer >", () => {
    let renderer: RadialRenderer;
    let scale: IScale<any>;
    let generatePieData: Function;
    let generateSeriesSet: Function;

    beforeEach(() => {
        renderer = new RadialRenderer();
    });

    it("should have correct render layers", () => {
        const layers = renderer.getRequiredLayers();
        expect(layers.length).toBe(1);
        expect(layers).toContain(STANDARD_RENDER_LAYERS[RenderLayerName.data]);
    });

    describe("draw()", () => {
        // Using any as a fallback type to avoid strict mode error
        let svg: D3Selection<SVGSVGElement> | any;
        let renderSeries: IRenderSeries<IRadialAccessors>;
        let path: D3Selection;
        const containers: IRenderContainers = {};
        let dataSeries: IDataSeries<IRadialAccessors>;
        let spy: jasmine.Spy;
        const defaultDonutPath =
            "M0.7550764872065807,0.6556367122635601A1,1,0,1,1,-0.19025980487066171,-0.9817337758529946L-0.19025980487066144,18.99904737629365Z";

        const accessors = new RadialAccessors();
        accessors.series.color = new SequentialColorProvider(CHART_PALETTE_CS1).get;

        beforeEach(() => {
            scale = new LinearScale();
            generatePieData = (names: string[], count: number = 1) => names.map((el, index) => ({
                id: `series-${index}`,
                name: el,
                data: Array.from({ length: count }, (_, i) => ({ value: 10 * (index + 1), name: `${el}` })),
                accessors: accessors,
            }));
            generateSeriesSet = (donutSeriesSet: any): any[] => donutSeriesSet.map((series: any) => ({
                ...series,
                scales: {
                    r: scale,
                },
                renderer: {},
                showInLegend: true,
            }));
            renderer.interaction = {
                arc: {
                    "mouseleave": "newLeave",
                    "over": "newOver",
                    "click": "newClick",
                },
            };
            const subj = new Subject<IRendererEventPayload>();
            spy = spyOn(subj, "next");
            dataSeries = radialPreprocessor(generateSeriesSet(generatePieData(["Up", "Down"])), () => true)[1];
            svg = select(document.createElement("div")).append("svg");
            containers[RenderLayerName.data] = svg.append("g");
            renderSeries = {
                dataSeries,
                containers,
                scales: { r: new LinearScale() },
            };
            renderer.draw(renderSeries, subj);
            path = containers[RenderLayerName.data].select(".arc");
        });

        it("should create the path", () => {
            const provider = new SequentialColorProvider(CHART_PALETTE_CS1);
            expect(path.node()).toBeTruthy();
            expect(path.attr("fill")).toBe(provider.get(dataSeries.id));
        });

        it("should update the path with new data", () => {
            const newSeries = cloneDeep(renderSeries);
            newSeries.dataSeries = radialPreprocessor(generateSeriesSet([{
                id: `series-1`,
                name: "Down",
                data: Array.from({ length: 1 }, (_, i) => ({ value: 10 * 3, name: `Down` })),
                accessors: accessors,
            }]), () => true)[0];
            renderer.draw(newSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).not.toBe(defaultDonutPath);
        });
        it("should update the path with new data - changing from donut to pie", () => {
            renderer = new PieRenderer();
            renderer.draw(renderSeries, new Subject<IRendererEventPayload>());

            expect(path.attr("d")).not.toBe(defaultDonutPath);
        });
        it("should handle click event", () => {
            path.dispatch("click");
            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ eventName: SELECT_DATA_POINT_EVENT }));
        });
        it("should handle mouseenter event", () => {
            path.dispatch("mouseenter");
            each([
                HIGHLIGHT_SERIES_EVENT,
                HIGHLIGHT_DATA_POINT_EVENT,
                INTERACTION_DATA_POINTS_EVENT,
            ], eventName => {
                expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ eventName }));
            });
        });
        it("should handle mouseleave event", () => {
            path.dispatch("mouseleave");
            each([
                HIGHLIGHT_SERIES_EVENT,
                HIGHLIGHT_DATA_POINT_EVENT,
                INTERACTION_DATA_POINTS_EVENT,
            ], eventName => {
                expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ eventName }));
            });
        });
    });
});
