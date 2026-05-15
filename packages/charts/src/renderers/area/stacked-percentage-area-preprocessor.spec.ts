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

import { AreaAccessors, IAreaAccessors } from "./area-accessors";
import { AreaRenderer } from "./area-renderer";
import { stackedPercentageAreaPreprocessor } from "./stacked-percentage-area-preprocessor";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { TimeScale } from "../../core/common/scales/time-scale";
import { IXYScales } from "../../core/common/scales/types";
import { IChartSeries } from "../../core/common/types";

describe("Stacked Area Preprocessor >", () => {
    let accessors: any;
    let renderer: any;
    let scales: IXYScales;

    beforeEach(() => {
        accessors = new AreaAccessors();
        accessors.data.x = (d: any) => d.x;
        accessors.data.y0 = () => 0;
        accessors.data.y1 = (d: any) => d.value;

        renderer = new AreaRenderer();

        scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };
    });

    it("should modify generated data and set the series values to be a percent", () => {
        const data = [
            {
                id: "series-1",
                name: "Series 1",
                data: [{ x: "test1", value: 2.5 }],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [{ x: "test1", value: 2.5 }],
            },
            {
                id: "series-3",
                name: "Series 3",
                data: [{ x: "test1", value: 5 }],
            },
        ];

        const seriesSet: IChartSeries<IAreaAccessors>[] = data.map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        const [firstSeries, secondSeries, thirdSeries] =
            stackedPercentageAreaPreprocessor(seriesSet, () => true);
        expect(firstSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(firstSeries.data[0]["__stack_y"].end).toEqual(25);
        expect(secondSeries.data[0]["__stack_y"].start).toEqual(25);
        expect(secondSeries.data[0]["__stack_y"].end).toEqual(50);
        expect(thirdSeries.data[0]["__stack_y"].start).toEqual(50);
        expect(thirdSeries.data[0]["__stack_y"].end).toEqual(100);
    });

    it("should modify generated data and set the series values to be a percent with missing domains", () => {
        const data = [
            {
                id: "series-1",
                name: "Series 1",
                data: [{ x: "test1", value: 2.5 }],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [{ x: "test2", value: 2.5 }],
            },
            {
                id: "series-3",
                name: "Series 3",
                data: [
                    { x: "test1", value: 2.5 },
                    { x: "test2", value: 7.5 },
                    { x: "test3", value: -4324.234 },
                ],
            },
        ];

        const seriesSet: IChartSeries<IAreaAccessors>[] = data.map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        const [firstSeries, secondSeries, thirdSeries] =
            stackedPercentageAreaPreprocessor(seriesSet, () => true);
        expect(firstSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(firstSeries.data[0]["__stack_y"].end).toEqual(50);
        expect(thirdSeries.data[0]["__stack_y"].start).toEqual(50);
        expect(thirdSeries.data[0]["__stack_y"].end).toEqual(100);
        expect(secondSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(secondSeries.data[0]["__stack_y"].end).toEqual(25);
        expect(thirdSeries.data[1]["__stack_y"].start).toEqual(25);
        expect(thirdSeries.data[1]["__stack_y"].end).toEqual(100);
        expect(thirdSeries.data[2]["__stack_y"].start).toEqual(0);
        expect(thirdSeries.data[2]["__stack_y"].end).toEqual(100);
    });

    it("should read x domain with a negative number", () => {
        const data = [
            {
                id: "series-1",
                name: "Series 1",
                data: [{ x: -123, value: 2.5 }],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [{ x: -123, value: 2.5 }],
            },
        ];

        const seriesSet: IChartSeries<IAreaAccessors>[] = data.map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        const [firstSeries, secondSeries] = stackedPercentageAreaPreprocessor(
            seriesSet,
            () => true
        );
        expect(firstSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(firstSeries.data[0]["__stack_y"].end).toEqual(50);
        expect(secondSeries.data[0]["__stack_y"].start).toEqual(50);
        expect(secondSeries.data[0]["__stack_y"].end).toEqual(100);
    });
});
