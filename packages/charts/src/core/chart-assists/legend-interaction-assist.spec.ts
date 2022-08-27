import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { RenderState } from "../../renderers/types";
import { Chart } from "../chart";
import { IAccessors, IChartAssistSeries } from "../common/types";
import { XYGrid } from "../grid/xy-grid";
import { ChartAssist, LegendInteractionAssist } from "./chart-assist";

describe("legend interaction assist >", () => {
    let chartAssist: ChartAssist;
    let legendInteractionAssist: LegendInteractionAssist;
    let seriesSet: IChartAssistSeries<IAccessors>[];

    beforeEach(() => {
        chartAssist = new ChartAssist(new Chart(new XYGrid()));
        legendInteractionAssist = new LegendInteractionAssist(chartAssist);

        const lineAccessors = new LineAccessors();
        const lineRenderer = new LineRenderer();

        seriesSet = [
            {
                id: "series-1",
                scales: {},
                data: [],
                accessors: lineAccessors,
                renderer: lineRenderer,
                showInLegend: true,
            },
            {
                id: "series-1__trendline",
                scales: {},
                data: [],
                accessors: lineAccessors,
                renderer: lineRenderer,
                showInLegend: false,
            },
            {
                id: "series-2",
                scales: {},
                data: [],
                accessors: lineAccessors,
                renderer: lineRenderer,
                showInLegend: true,
            },
        ];
    });

    describe("update >", () => {
        it("initializes states to default values", () => {
            legendInteractionAssist.update(seriesSet);

            const seriesStatesBeforeIndex =
                legendInteractionAssist.renderStatesIndex;
            expect(Object.keys(seriesStatesBeforeIndex).length).toBe(3);
            expect(seriesStatesBeforeIndex["series-1"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesBeforeIndex["series-1__trendline"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesBeforeIndex["series-2"].state).toBe(
                RenderState.default
            );
        });

        it("initializes states to provided values", () => {
            // provided hidden state
            seriesSet[0].renderState = RenderState.hidden;

            legendInteractionAssist.update(seriesSet);

            const seriesStatesBeforeIndex =
                legendInteractionAssist.renderStatesIndex;
            expect(seriesStatesBeforeIndex["series-1"].state).toBe(
                RenderState.hidden
            );
            expect(seriesStatesBeforeIndex["series-1"].emphasisState).toBe(
                RenderState.default
            );
            expect(seriesStatesBeforeIndex["series-1"].visible).toBe(false);

            // provided hidden state
            seriesSet[0].renderState = RenderState.emphasized;

            legendInteractionAssist.update(seriesSet);

            expect(seriesStatesBeforeIndex["series-1"].state).toBe(
                RenderState.emphasized
            );
            expect(seriesStatesBeforeIndex["series-1"].emphasisState).toBe(
                RenderState.emphasized
            );
            expect(seriesStatesBeforeIndex["series-1"].visible).toBe(true);
        });

        it("emphasizes single series on update", () => {
            // provided hidden state
            seriesSet[0].renderState = RenderState.hidden;

            legendInteractionAssist.update(seriesSet);

            const seriesStatesBeforeIndex =
                legendInteractionAssist.renderStatesIndex;
            expect(seriesStatesBeforeIndex["series-1"].state).toBe(
                RenderState.hidden
            );
            expect(seriesStatesBeforeIndex["series-1"].emphasisState).toBe(
                RenderState.default
            );
            expect(seriesStatesBeforeIndex["series-1"].visible).toBe(false);

            // provided hidden state
            seriesSet[0].renderState = RenderState.emphasized;

            chartAssist.update([seriesSet[0]]);
            legendInteractionAssist.update([seriesSet[0]]);

            expect(seriesStatesBeforeIndex["series-1"].state).toBe(
                RenderState.emphasized
            );
            expect(seriesStatesBeforeIndex["series-1"].emphasisState).toBe(
                RenderState.emphasized
            );
            expect(seriesStatesBeforeIndex["series-1"].visible).toBe(true);
        });
    });

    describe("setGroupState >", () => {
        beforeEach(() => {
            legendInteractionAssist.update(seriesSet);
        });

        it("sets state to a single series", () => {
            legendInteractionAssist.setGroupState(
                "series-2",
                RenderState.deemphasized
            );

            const seriesStatesAfterIndex =
                legendInteractionAssist.renderStatesIndex;

            expect(Object.keys(seriesStatesAfterIndex).length).toBe(3);
            expect(seriesStatesAfterIndex["series-1"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesAfterIndex["series-1__trendline"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesAfterIndex["series-2"].state).toBe(
                RenderState.deemphasized
            );
        });

        it("propagates state to a group of series", () => {
            legendInteractionAssist.setGroupState(
                "series-1",
                RenderState.deemphasized
            );

            const seriesStatesAfterIndex =
                legendInteractionAssist.renderStatesIndex;

            expect(Object.keys(seriesStatesAfterIndex).length).toBe(3);
            expect(seriesStatesAfterIndex["series-1"].state).toBe(
                RenderState.deemphasized
            );
            expect(seriesStatesAfterIndex["series-1__trendline"].state).toBe(
                RenderState.deemphasized
            );
            expect(seriesStatesAfterIndex["series-2"].state).toBe(
                RenderState.default
            );
        });
    });

    describe("setGroupVisibility >", () => {
        beforeEach(() => {
            legendInteractionAssist.update(seriesSet);
        });

        it("propagates visibility to a group of series", () => {
            legendInteractionAssist.setGroupVisibility("series-1", false);

            const seriesStatesAfterIndex =
                legendInteractionAssist.renderStatesIndex;

            expect(Object.keys(seriesStatesAfterIndex).length).toBe(3);
            expect(seriesStatesAfterIndex["series-1"].state).toBe(
                RenderState.hidden
            );
            expect(seriesStatesAfterIndex["series-1__trendline"].state).toBe(
                RenderState.hidden
            );
            expect(seriesStatesAfterIndex["series-2"].state).toBe(
                RenderState.default
            );
        });

        it("persists state after visibility revert to a group of series", () => {
            // set series-2 to emphasized
            legendInteractionAssist.setGroupState(
                "series-2",
                RenderState.emphasized
            );

            expect(
                legendInteractionAssist.renderStatesIndex["series-2"].state
            ).toBe(RenderState.emphasized);

            // then hide it
            legendInteractionAssist.setGroupVisibility("series-2", false);

            expect(
                legendInteractionAssist.renderStatesIndex["series-2"].state
            ).toBe(RenderState.hidden);

            // then show it again
            legendInteractionAssist.setGroupVisibility("series-2", true);

            expect(
                legendInteractionAssist.renderStatesIndex["series-2"].state
            ).toBe(RenderState.emphasized);
        });
    });

    describe("resetValues >", () => {
        it("resets states of single series, which becomes emphasized", () => {
            const singleSeriesSet = [seriesSet[0]];

            chartAssist.update(singleSeriesSet); // needs to be updated as well to return visible series with legend properly
            legendInteractionAssist.update(singleSeriesSet);

            // mess with the states a little bit
            legendInteractionAssist.setGroupState(
                "series-1",
                RenderState.deemphasized
            );

            expect(
                legendInteractionAssist.renderStatesIndex["series-1"].state
            ).toBe(RenderState.deemphasized);

            legendInteractionAssist.resetSeries();

            const seriesStatesAfterIndex =
                legendInteractionAssist.renderStatesIndex;
            expect(seriesStatesAfterIndex["series-1"].state).toBe(
                RenderState.emphasized
            );
        });

        it("resets states of multiple series", () => {
            chartAssist.update(seriesSet); // needs to be updated as well to return visible series with legend properly
            legendInteractionAssist.update(seriesSet);

            // mess with the states a little bit
            legendInteractionAssist.setGroupState(
                "series-2",
                RenderState.deemphasized
            );

            expect(
                legendInteractionAssist.renderStatesIndex["series-2"].state
            ).toBe(RenderState.deemphasized);

            legendInteractionAssist.resetSeries();

            const seriesStatesAfterIndex =
                legendInteractionAssist.renderStatesIndex;
            expect(seriesStatesAfterIndex["series-1"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesAfterIndex["series-1__trendline"].state).toBe(
                RenderState.default
            );
            expect(seriesStatesAfterIndex["series-2"].state).toBe(
                RenderState.default
            );
        });
    });
});
