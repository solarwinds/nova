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

import { LinearScale } from "../../core/common/scales/linear-scale";
import { IScale } from "../../core/common/scales/types";
import { IAccessors, IChartSeries } from "../../core/common/types";
import { radialPreprocessor } from "./radial-preprocessor";

describe("Radial Preprocessor >", () => {
    let scale: IScale<any>;
    let generatePieData: Function;
    let generateSeriesSet: Function;
    beforeEach(() => {
        scale = new LinearScale();
        generatePieData = (names: string[], count: number = 1) =>
            names.map((el, index) => ({
                id: `series-${index}`,
                name: el,
                data: Array.from({ length: count }, (_, i) => ({
                    value: 10 * (index + 1),
                    name: `${el}`,
                })),
                accessors: {
                    data: {
                        value: (d: any) => d.value,
                    },
                },
            }));
        generateSeriesSet = (donutSeriesSet: any): any[] =>
            donutSeriesSet.map((dataSeries: any) => ({
                ...dataSeries,
                scales: {
                    r: scale,
                },
                renderer: {},
                showInLegend: true,
            }));
    });
    it("should modify generated data", () => {
        const res = radialPreprocessor(
            generateSeriesSet(generatePieData(["Up", "Down"])),
            () => true
        );
        expect(res[0].data[0].value).toBe(10);
        expect(res[1].data[0].value).toBe(20);
        expect(res[1].name).toBe("Down");
        expect(res.length).toBe(2);
    });
    it("should modify pie value, but not series data when not visible", () => {
        const res = radialPreprocessor(
            generateSeriesSet(generatePieData(["Up", "Down"])),
            (series: IChartSeries<IAccessors>) => series.name === "Up"
        );
        expect(res[0].data[0].value).toBe(10);
        expect(res[0].data[0].data.value).toBe(10);
        expect(res[1].data[0].value).toBe(0);
        expect(res[1].data[0].data.value).toBe(20);
        expect(res[1].name).toBe("Down");
        expect(res.length).toBe(2);
    });
});
