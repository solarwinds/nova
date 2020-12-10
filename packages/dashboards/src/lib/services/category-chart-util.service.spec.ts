import {
    BandScale,
    BarRenderer,
    HorizontalBarAccessors,
    IAccessors,
    IChartAssistSeries,
    IDataSeries,
    IGrid,
    LineAccessors,
    LinearScale,
    LineRenderer,
    RadialAccessors,
    RadialGrid,
    RadialRenderer,
    Renderer,
    Scales,
    VerticalBarAccessors,
    XYGrid
} from "@nova-ui/charts";

import { ProportionalWidgetChartTypes } from "../components/proportional-widget/types";

import { CategoryChartUtilService } from "./category-chart-util.service";

describe("services >", () => {
    describe("CategoryChartUtilService >", () => {
        describe("buildChartSeries >", () => {
            const data: IDataSeries<IAccessors>[] = [
                {
                    id: "1",
                    name: "data-1",
                    data: [1],
                    // @ts-ignore: Suppressed for test purposes
                    accessors: null,
                },
                {
                    id: "2",
                    name: "data-2",
                    data: [2],
                    // @ts-ignore: Suppressed for test purposes
                    accessors: null,
                },
                {
                    id: "3",
                    name: "data-3",
                    data: [3],
                    // @ts-ignore: Suppressed for test purposes
                    accessors: null,
                },
            ];
            const accessors = new LineAccessors();
            const renderer = new LineRenderer();
            const scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };
            let series: IChartAssistSeries<IAccessors>[] = [];

            beforeAll(() => {
                series = CategoryChartUtilService.buildChartSeries(data, accessors, renderer, scales);
            });

            it("should return the same number of series", () => {
                expect(series.length).toEqual(data.length);
            });

            it("should preserve existing series properties", () => {
                for (let i = 0; i < series.length; i++) {
                    const s = series[i];
                    const d = data[i];
                    expect(s.id).toEqual(d.id);
                    expect(s.name).toEqual(d.name);
                    expect(s.data).toEqual(d.data);
                }
            });

            it("should assign a proper accessors", () => {
                for (const s of series) {
                    expect(s.accessors).toEqual(accessors);
                }
            });

            it("should assign a proper renderer", () => {
                for (const s of series) {
                    expect(s.renderer).toEqual(renderer);
                }
            });

            it("should assign a proper scales", () => {
                for (const s of series) {
                    expect(s.scales).toEqual(scales);
                }
            });

        });

        describe("getChartAttributes >", () => {
            let chartType: ProportionalWidgetChartTypes;

            let grid: IGrid;
            let accessors: IAccessors;
            let renderer: Renderer<IAccessors>;
            let scales: Scales;

            describe("For DonutChart type", () => {
                beforeAll(() => {
                    chartType = ProportionalWidgetChartTypes.DonutChart;
                    ({ grid, accessors, renderer, scales } = CategoryChartUtilService.getChartAttributes(chartType));
                });

                it("it should return correct grid", () => {
                    expect(grid instanceof RadialGrid).toBe(true);
                });
                it("it should return correct accessors", () => {
                    expect(accessors instanceof RadialAccessors).toBe(true);
                });
                it("it should return correct renderer", () => {
                    expect(renderer instanceof RadialRenderer).toBe(true);
                });
                it("it should return correct scales", () => {
                    expect(scales.r instanceof LinearScale).toBe(true);
                });
            });

            describe("For PieChart type", () => {
                beforeAll(() => {
                    chartType = ProportionalWidgetChartTypes.PieChart;
                    ({ grid, accessors, renderer, scales } = CategoryChartUtilService.getChartAttributes(chartType));
                });

                it("it should return correct grid", () => {
                    expect(grid instanceof RadialGrid).toBe(true);
                });
                it("it should return correct accessors", () => {
                    expect(accessors instanceof RadialAccessors).toBe(true);
                });
                it("it should return correct renderer", () => {
                    expect(renderer instanceof RadialRenderer).toBe(true);
                });
                it("it should return correct scales", () => {
                    expect(scales.r instanceof LinearScale).toBe(true);
                });
            });

            describe("For HorizontalBarChart type", () => {
                beforeAll(() => {
                    chartType = ProportionalWidgetChartTypes.HorizontalBarChart;
                    ({ grid, accessors, renderer, scales } = CategoryChartUtilService.getChartAttributes(chartType));
                });

                it("it should return correct grid", () => {
                    expect(grid instanceof XYGrid).toBe(true);
                });
                it("it should return correct accessors", () => {
                    expect(accessors instanceof HorizontalBarAccessors).toBe(true);
                });
                it("it should return correct renderer", () => {
                    expect(renderer instanceof BarRenderer).toBe(true);
                });
                it("it should return correct scales", () => {
                    expect(scales.x instanceof LinearScale).toBe(true);
                    expect(scales.y instanceof BandScale).toBe(true);
                });
            });

            describe("For VerticalBarChart type", () => {
                beforeAll(() => {
                    chartType = ProportionalWidgetChartTypes.VerticalBarChart;
                    ({ grid, accessors, renderer, scales } = CategoryChartUtilService.getChartAttributes(chartType));
                });

                it("it should return correct grid", () => {
                    expect(grid instanceof XYGrid).toBe(true);
                });
                it("it should return correct accessors", () => {
                    expect(accessors instanceof VerticalBarAccessors).toBe(true);
                });
                it("it should return correct renderer", () => {
                    expect(renderer instanceof BarRenderer).toBe(true);
                });
                it("it should return correct scales", () => {
                    expect(scales.x instanceof BandScale).toBe(true);
                    expect(scales.y instanceof LinearScale).toBe(true);
                });
            });

        });

        describe("bar accessors >", () => {
            let accessors: IAccessors;

            describe("vertical >", () => {
                describe("data >", () => {

                    beforeAll(() => {
                        ({ accessors } = CategoryChartUtilService.getChartAttributes(ProportionalWidgetChartTypes.VerticalBarChart));
                    });

                    it("should return primitive numbers as is", () => {
                        // @ts-ignore: Suppressed for test purposes
                        expect(accessors.data.value(5, 0, null, null)).toEqual(5);
                    });

                    it("should return the value property of an object", () => {
                        // @ts-ignore: Suppressed for test purposes
                        expect(accessors.data.value({ value: 5 }, 0, null, null)).toEqual(5);
                    });
                });
            });

            describe("horizontal >", () => {
                describe("data >", () => {

                    beforeAll(() => {
                        ({ accessors } = CategoryChartUtilService.getChartAttributes(ProportionalWidgetChartTypes.HorizontalBarChart));
                    });

                    it("should return primitive numbers as is", () => {
                        // @ts-ignore: Suppressed for test purposes
                        expect(accessors.data.value(5, 0, null, null)).toEqual(5);
                    });

                    it("should return the value property of an object", () => {
                        // @ts-ignore: Suppressed for test purposes
                        expect(accessors.data.value({ value: 5 }, 0, null, null)).toEqual(5);
                    });
                });
            });
        });
    });
});
