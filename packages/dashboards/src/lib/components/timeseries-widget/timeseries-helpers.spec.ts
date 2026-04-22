import { metricsSeriesMeasurementsMinMax } from "./timeseries-helpers";
import { ITimeseriesWidgetData } from "./types";

describe("metricsSeriesMeasurementsMinMax", () => {
    const makeSeries = (
        overrides: Partial<ITimeseriesWidgetData> = {}
    ): ITimeseriesWidgetData => ({
            id: "s1",
            name: "Series 1",
            description: "",
            data: [],
            metricUnits: undefined,
            ...overrides,
        });

    describe("when axisUnits is percent", () => {
        it("should return { min: 0, max: 100 } when all values are <= 100", () => {
            const series = [
                makeSeries({
                    metricUnits: "percent",
                    data: [
                        { x: 1, y: 50 },
                        { x: 2, y: 80 },
                    ],
                }),
            ];
            expect(metricsSeriesMeasurementsMinMax(series, "percent")).toEqual({
                min: 0,
                max: 100,
            });
        });

        it("should return max > 100 when percent data exceeds 100", () => {
            const series = [
                makeSeries({
                    metricUnits: "percent",
                    data: [
                        { x: 1, y: 50 },
                        { x: 2, y: 150 },
                    ],
                }),
            ];
            expect(metricsSeriesMeasurementsMinMax(series, "percent")).toEqual({
                min: 0,
                max: 150,
            });
        });

        it("should return { min: 0, max: 100 } when there are no percent metrics", () => {
            const series = [
                makeSeries({
                    metricUnits: "bytes",
                    data: [
                        { x: 1, y: 500 },
                    ],
                }),
            ];
            expect(metricsSeriesMeasurementsMinMax(series, "percent")).toEqual({
                min: 0,
                max: 100,
            });
        });

        it("should return { min: 0, max: 100 } when percent metrics have no data", () => {
            const series = [
                makeSeries({
                    metricUnits: "percent",
                    data: [],
                }),
            ];
            expect(metricsSeriesMeasurementsMinMax(series, "percent")).toEqual({
                min: 0,
                max: 100,
            });
        });

        it("should consider the highest value across multiple percent series", () => {
            const series = [
                makeSeries({
                    id: "s1",
                    metricUnits: "percent",
                    data: [{ x: 1, y: 120 }],
                }),
                makeSeries({
                    id: "s2",
                    metricUnits: "percent",
                    data: [{ x: 1, y: 201 }],
                }),
            ];
            expect(metricsSeriesMeasurementsMinMax(series, "percent")).toEqual({
                min: 0,
                max: 201,
            });
        });
    });
});
