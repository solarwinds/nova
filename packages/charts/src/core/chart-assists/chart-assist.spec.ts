import { DATA_POINT_INTERACTION_RESET, DESTROY_EVENT } from "../../constants";
import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { RenderState } from "../../renderers/types";
import { Chart } from "../chart";
import { LinearScale } from "../common/scales/linear-scale";
import { NoopScale } from "../common/scales/noop-scale";
import { IAccessors, IChartSeries, IDataPoint } from "../common/types";
import { XYGrid } from "../grid/xy-grid";

import { ChartAssist } from "./chart-assist";
import { ChartAssistEventType } from "./types";

describe("chart assist >", () => {
    let ca: ChartAssist;
    let series: IChartSeries<IAccessors>;
    let dataPoint: IDataPoint;

    beforeEach(() => {
        ca = new ChartAssist(new Chart(new XYGrid()));
        const seriesId = "series1";

        const yScale = new LinearScale();
        yScale.formatters.tick = (v) => Math.round(v * 100) + "%";

        const renderer = new LineRenderer();

        series = {
            id: seriesId,
            name: "Series 1",
            data: [{
                x: 1,
                y: 0.5,
            }],
            renderer: renderer,
            accessors: new LineAccessors(),
            scales: {
                x: new LinearScale(),
                y: yScale,
            },
        };

        dataPoint = {
            seriesId: seriesId,
            dataSeries: series,
            index: 0,
            data: {
                x: 1,
                y: 0.5,
            },
            position: undefined,
        };

        ca.highlightedDataPoints = {
            [seriesId]: dataPoint,
        };
    });

    describe("getLabel", () => {
        it("should not throw if the data series is empty and the data point index is less than zero", () => {
            series.data = [];
            dataPoint.index = DATA_POINT_INTERACTION_RESET;
            expect(() => ChartAssist.getLabel(series, dataPoint, "x")).not.toThrow();
        });

        it("should return null if the data series is empty", () => {
            series.data = [];
            expect(ChartAssist.getLabel(series, dataPoint, "x")).toBeNull();
        });
    });

    describe("highlighted values", () => {
        it("returns formatted value", () => {
            expect(ca.getHighlightedValue(series, "y", "tick")).toBe("50%");
        });

        it("returns null for missing data accessor", () => {
            expect(ca.getHighlightedValue(series, "z", "tick")).toBeNull();
        });

        it("returns raw string value for missing formatter", () => {
            series.data[0].y = "test";
            expect(ca.getHighlightedValue(series, "y", "nonexistent")).toBe("test");
        });

        it("returns localized string value for missing formatter", () => {
            series.data[0].y = 1000.01
            expect(ca.getHighlightedValue(series, "y", "nonexistent")).toBe("1,000.01");
        });
    });

    describe("update", () => {
        let seriesSet: IChartSeries<IAccessors>[];

        beforeEach(() => {
            const renderer = new LineRenderer();
            const accessors = new LineAccessors();
            const scales = {
                x: new NoopScale(),
                y: new NoopScale(),
            };

            seriesSet = [
                {
                    id: "series1",
                    name: "Series 1",
                    data: [{
                        x: 1,
                        y: 0.5,
                    }],
                    renderer,
                    accessors,
                    scales,
                },
                {
                    id: "series2",
                    name: "Series 2",
                    data: [{
                        x: 1,
                        y: 0.5,
                    }],
                    renderer,
                    accessors,
                    scales,
                },
            ];
        });

        it("creates data arrays on the legend series set in the case of null data", () => {
            // @ts-ignore: Disabled for testing purposes
            seriesSet.forEach(s => s.data = null);
            ca.update(seriesSet);
            ca.legendSeriesSet.forEach(async s => expect(s.data).toEqual([]));
        });

        it("leaves the data of the input series set untouched in the case of null data", () => {
            // @ts-ignore: Disabled for testing purposes
            seriesSet.forEach(s => s.data = null);
            ca.update(seriesSet);
            ca.inputSeriesSet.forEach(async s => expect(s.data).toBeNull());
        });

        /**
         * Toggle triggers an internal update, so it is important to check whether the series states remained intact
         */
        it("doesn't reset legend on visibility toggle", () => {
            ca.update(seriesSet);

            expect(ca.renderStatesIndex["series1"].state).toBe(RenderState.default);

            ca.emphasizeSeries("series1");

            expect(ca.renderStatesIndex["series1"].state).toBe(RenderState.emphasized);
            expect(ca.renderStatesIndex["series2"].state).toBe(RenderState.deemphasized);

            ca.toggleSeries("series1", false);

            expect(ca.renderStatesIndex["series1"].state).toBe(RenderState.hidden);
            // series 2 state remained deemphasized
            expect(ca.renderStatesIndex["series2"].state).toBe(RenderState.deemphasized);
        });
    });

    describe("chart assist sync", () => {
        let syncedAssist: ChartAssist;

        beforeEach(() => {
            syncedAssist = new ChartAssist(new Chart(new XYGrid()));
            syncedAssist.syncWithChartAssist(ca);
        });

        it("should have the correct sync handler map", () => {
            expect((<any>syncedAssist).syncHandlerMap[ChartAssistEventType.ToggleSeries]).toBe(syncedAssist.toggleSeries);
            expect((<any>syncedAssist).syncHandlerMap[ChartAssistEventType.EmphasizeSeries]).toBe(syncedAssist.emphasizeSeries);
            expect((<any>syncedAssist).syncHandlerMap[ChartAssistEventType.ResetVisibleSeries]).toBe(syncedAssist.resetVisibleSeries);
        });

        it("should override the chart assist's getVisibleSeriesWithLegend method with that of the specified chart assist", () => {
            expect(syncedAssist.getVisibleSeriesWithLegend).toBe(ca.getVisibleSeriesWithLegend);
        });

        it("should invoke the method mapped to the toggle series event", () => {
            const spy = jasmine.createSpy("toggleSeriesSpy");
            (<any>syncedAssist).syncHandlerMap[ChartAssistEventType.ToggleSeries] = spy;
            const args: [string, boolean] = ["seriesId", true];
            ca.toggleSeries(...args);
            expect(spy).toHaveBeenCalledWith(...args);
        });

        it("should invoke the method mapped to the emphasize series event", () => {
            const spy = jasmine.createSpy("emphasizeSeriesSpy");
            (<any>syncedAssist).syncHandlerMap[ChartAssistEventType.EmphasizeSeries] = spy;
            const seriesId = "seriesId";
            ca.emphasizeSeries(seriesId);
            expect(spy).toHaveBeenCalledWith(seriesId);
        });

        it("should invoke the method mapped to the reset visible series event", () => {
            const spy = jasmine.createSpy("resetSeriesSpy");
            (<any>syncedAssist).syncHandlerMap[ChartAssistEventType.ResetVisibleSeries] = spy;
            ca.resetVisibleSeries();
            expect(spy).toHaveBeenCalled();
        });

        it("should remove the sync observer if the master chart assist chart emits a destroy event", () => {
            ca.chart.getEventBus().getStream(DESTROY_EVENT).next({ data: null });
            const spy = jasmine.createSpy("resetSeriesSpy");
            (<any>syncedAssist).syncHandlerMap[ChartAssistEventType.ResetVisibleSeries] = spy;
            ca.resetVisibleSeries();
            expect(ca.chartAssistSubject.observers.length).toEqual(0);
            expect(spy).not.toHaveBeenCalled();
        });

        it("should unsync from the master chart assist", () => {
            expect((<any>syncedAssist).getVisibleSeriesWithLegendBackup).not.toBe(syncedAssist.getVisibleSeriesWithLegend);
            expect(ca.chartAssistSubject.observers.length).toEqual(1);
            syncedAssist.unsyncChartAssist();
            expect((<any>syncedAssist).getVisibleSeriesWithLegendBackup).toBe(syncedAssist.getVisibleSeriesWithLegend);
            expect(ca.chartAssistSubject.observers.length).toEqual(0);
        });
    });

});
