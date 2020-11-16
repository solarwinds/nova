import { IAccessors, IDataSeries } from "@solarwinds/nova-charts";
import moment, { Moment } from "moment/moment";

export interface IDateValue {
    x: Date;
    y: number;
}

export class DataGenerator {
    public static generateMockStatusSeriesSet(seriesCount: number, pointCountPerSeries: number, statuses: string[]) {
        const dataSet = [];
        for (let i = 0; i < seriesCount; i++) {
            dataSet.push({
                id: `series-${i + 1}`,
                name: `Series ${i + 1}`,
                data: DataGenerator.mockStatusData(pointCountPerSeries, statuses),
            });
        }
        return dataSet;
    }

    public static generateMockLineSeriesSet(seriesCount: number, pointCountPerSeries: number) {
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

    public static generateMockTimeLineSeriesSet(seriesCount: number,
                                                pointCountPerSeries: number,
                                                startTime?: string,
                                                endTime?: string) {
        const dataSet = [];
        for (let i = 0; i < seriesCount; i++) {
            dataSet.push({
                id: `series-${i + 1}`,
                name: `Series ${i + 1}`,
                data: DataGenerator.mockTimeLineData(pointCountPerSeries, startTime, endTime),
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
    public static generateMockOrdinalSeriesSet(groupNames: string[],
        seriesCount: number = 1): IDataSeries<IAccessors>[] {
        return groupNames.map((el, index) => ({
            id: `series-${index + 1}`,
            name: el,
            // for ordinal scale it is useful to identify each data point here somehow
            data: Array.apply(null, Array(seriesCount)).map((_: any, i: any) => ({
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
                x: start.clone().add(step * index, "ms").toDate(),
                y: next,
            };
        });
    }

    public static mockLineData = (
        pointCount = 40,
        startData = 0,
        endData = 400
    ) => {
        const step = (endData - startData) / pointCount;
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
                x: startData + (step * index),
                y: next,
            };
        });
    }

    public static mockStatusData = (pointCount = 40, statuses: string[]) => {
        const generateValue = () => statuses[Math.floor(Math.random() * statuses.length)];
        return DataGenerator.range(0, pointCount).map((index: any) =>
            ({
                x: index,
                y: generateValue(),
            }));
    }

    public static buildTimeSeriesFromData(from: Moment, to: Moment, data: number[]): { x: Moment, y: number }[] {
        const count = data.length;
        if (!from || !to || count === 0) { return []; }

        const interval = count > 1 ? to.diff(from) / (count - 1) : 0;
        return data.map((y, i) => ({
            x: from.clone().add(moment.duration(i * interval)),
            y,
        }));
    }

    private static range(start: number, end: number) {
        return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
    }
}
