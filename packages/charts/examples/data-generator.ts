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

import moment, { Moment } from "moment/moment";

import { IAccessors, IDataSeries } from "@nova-ui/charts";

export interface IDateValue {
    x: Date;
    y: number;
}

export type IDataSet<T> = { id: string; name: string; data: T[] }[];

export class DataGenerator {
    public static generateMockStatusSeriesSet(
        seriesCount: number,
        pointCountPerSeries: number,
        statuses: string[]
    ): IDataSet<{ x: any; y: string }> {
        const dataSet = [];
        for (let i = 0; i < seriesCount; i++) {
            dataSet.push({
                id: `series-${i + 1}`,
                name: `Series ${i + 1}`,
                data: DataGenerator.mockStatusData(
                    pointCountPerSeries,
                    statuses
                ),
            });
        }
        return dataSet;
    }

    public static generateMockLineSeriesSet(
        seriesCount: number,
        pointCountPerSeries: number
    ): IDataSet<{ x: number; y: number }> {
        const dataSet = [];
        for (let i = 0; i < seriesCount; i++) {
            dataSet.push({
                id: `series-${i + 1}`,
                name: `Series ${i + 1}`,
                data: DataGenerator.mockLineData(pointCountPerSeries),
            });
        }
        return dataSet;
    }

    public static generateMockTimeLineSeriesSet(
        seriesCount: number,
        pointCountPerSeries: number,
        startTime?: string,
        endTime?: string
    ): IDataSet<IDateValue> {
        const dataSet = [];
        for (let i = 0; i < seriesCount; i++) {
            dataSet.push({
                id: `series-${i + 1}`,
                name: `Series ${i + 1}`,
                data: DataGenerator.mockTimeLineData(
                    pointCountPerSeries,
                    startTime,
                    endTime
                ),
            });
        }
        return dataSet;
    }

    /**
     * With default seriesCount=1 it will generate groupNames.length series with one data point
     * @param {string[]} groupNames
     * @param {number} seriesCount
     * @returns {IDataSeries[]}
     */
    public static generateMockOrdinalSeriesSet(
        groupNames: string[],
        seriesCount: number = 1
    ): IDataSeries<IAccessors>[] {
        return groupNames.map((el, index) => ({
            id: `series-${index + 1}`,
            name: el,
            // for ordinal scale it is useful to identify each data point here somehow
            data: Array(seriesCount)
                .fill(undefined)
                .map((_: any, i: any) => ({
                    value: Math.floor(Math.random() * 100),
                    description: `Category ${i + 1}`,
                })),
            accessors: {
                data: {
                    category: (d: any) => d.description,
                    value: (d: any) => d.value,
                },
            },
        }));
    }

    public static mockTimeLineData = (
        pointCount = 40,
        startDatetime = "2017-02-15T15:14:29.909Z",
        endDatetime = "2017-02-15T16:14:29.909Z"
    ): IDateValue[] => {
        const start = moment(startDatetime);
        const end = moment(endDatetime);
        const step = end.diff(start) / pointCount;
        let prev: any;
        const generateValue = () => Math.random() * 100 + 50;
        const maxThreshold = 10;

        return DataGenerator.range(0, pointCount).map((index: any) => {
            let next = generateValue();
            if (prev) {
                while (Math.abs(next - prev) > maxThreshold) {
                    next = generateValue();
                }
            }
            prev = next;
            return {
                x: start
                    .clone()
                    .add(step * index, "ms")
                    .toDate(),
                y: next,
            };
        });
    };

    public static mockLineData = (
        pointCount = 40,
        startData = 0,
        endData = 400
    ): { x: number; y: number }[] => {
        const step = (endData - startData) / pointCount;
        let prev: any;
        const generateValue = () => Math.random() * 100 + 50;
        const maxThreshold = 10;

        return DataGenerator.range(0, pointCount).map((index) => {
            let next = generateValue();
            if (prev) {
                while (Math.abs(next - prev) > maxThreshold) {
                    next = generateValue();
                }
            }
            prev = next;
            return {
                x: startData + step * index,
                y: next,
            };
        });
    };

    public static mockStatusData = (
        pointCount = 40,
        statuses: string[]
    ): { x: number; y: string }[] => {
        const generateValue = () =>
            statuses[Math.floor(Math.random() * statuses.length)];
        return DataGenerator.range(0, pointCount).map((index: number) => ({
            x: index,
            y: generateValue(),
        }));
    };

    public static buildTimeSeriesFromData(
        from: Moment,
        to: Moment,
        data: number[]
    ): { x: Moment; y: number }[] {
        const count = data.length;
        if (!from || !to || count === 0) {
            return [];
        }

        const interval = count > 1 ? to.diff(from) / (count - 1) : 0;
        return data.map((y, i) => ({
            x: from.clone().add(moment.duration(i * interval)),
            y,
        }));
    }

    private static range(start: number, end: number): number[] {
        return new Array(end - start + 1)
            .fill(undefined)
            .map((_, i) => i + start);
    }
}
