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

import { IBarAccessors } from "./accessors/bar-accessors";
import { VerticalBarAccessors } from "./accessors/vertical-bar-accessors";
import { BarRenderer } from "./bar-renderer";
import { stackedPreprocessor } from "./stacked-preprocessor";
import { BandScale } from "../../core/common/scales/band-scale";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { IChartSeries } from "../../core/common/types";

const allVisible = (series: IChartSeries<IBarAccessors>) => true;
const allExceptSecondVisible = (series: IChartSeries<IBarAccessors>) =>
    series.id !== "1";

const seriesGenerator = (
    data: (string | number | boolean)[][][]
): IChartSeries<IBarAccessors>[] => {
    const accessors = new VerticalBarAccessors();
    const renderer = new BarRenderer();
    const scales: any = {
        x: new BandScale(),
        y: new LinearScale(),
    };
    return data.map(
        (innerData: (string | number | boolean)[][], index: number) => ({
            id: `${index}`,
            name: `Mocked Series ${index}`,
            accessors,
            renderer,
            scales,
            preprocess: innerData[index][2],
            data: innerData.map((d) => ({
                category: d[0],
                value: d[1],
            })),
        })
    );
};

const skipPreprocessingSeriesData = [
    [
        ["Cat 1", 23, false],
        ["Cat 2", 21, false],
        ["Cat 3", 4, false],
    ],
    [
        ["Cat 1", 700],
        ["Cat 2", 0],
        ["Cat 3", 4],
    ],
];
const sparseSeriesData = [
    [
        ["Cat 1", 23],
        ["Cat 2", 21],
        ["Cat 3", 4],
    ],
    [
        ["Cat 1", 700],
        ["Cat 2", 0],
        ["Cat 4", 4],
    ],
];
const fullSeriesData = [
    [
        ["Cat 1", 23],
        ["Cat 2", 21],
        ["Cat 3", 4],
    ],
    [
        ["Cat 1", 28],
        ["Cat 2", 17],
        ["Cat 3", 3],
    ],
    [
        ["Cat 1", 700],
        ["Cat 2", 3],
        ["Cat 4", 4],
    ],
];

describe("stacked preprocessor", () => {
    it("should return the same empty array", () => {
        const series: any = [];
        expect(stackedPreprocessor(series, allVisible)).toBe(series);
    });
    it("should not add metadata to all items in sparse dataset", () => {
        const preprocessed = stackedPreprocessor(
            seriesGenerator(sparseSeriesData),
            allVisible
        );
        const barMetadata = preprocessed.map((s) => s.data.map((d) => d.__bar));
        expect(barMetadata).toEqual([
            [
                { start: 0, end: 23 },
                { start: 0, end: 21 },
                { start: 0, end: 4 },
            ],
            [
                { start: 23, end: 723 },
                { start: 21, end: 21 },
                { start: 0, end: 4 },
            ],
        ]);
    });
    it("should have metadata indicating zero-length bars for items in invisible series", () => {
        const preprocessed = stackedPreprocessor(
            seriesGenerator(fullSeriesData),
            allExceptSecondVisible
        );
        preprocessed.forEach((s, i) => {
            s.data.forEach((d) => {
                if (i === 1) {
                    expect(d.__bar.end - d.__bar.start).toEqual(0);
                } else {
                    expect(d.__bar.end - d.__bar.start).toBeGreaterThan(0);
                }
            });
        });
    });
    it("should not add metadata to items on series where preprocess set to false", () => {
        const preprocessed = stackedPreprocessor(
            seriesGenerator(skipPreprocessingSeriesData),
            allVisible
        );
        preprocessed.forEach((s, i) => {
            s.data.forEach((d) => {
                if (s.preprocess !== undefined && !s.preprocess) {
                    expect(d.__bar).toBeUndefined();
                } else {
                    expect(d.__bar).toBeDefined();
                }
            });
        });
    });
});
