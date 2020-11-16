import { Duration } from "moment/moment";

import { TimeIntervalScale } from "../../core/common/scales/time-interval-scale";
import { IAccessors, IDataSeries } from "../../core/common/types";

/**
 * This function adds data points indicating that there is an interruption in the data.
 *
 * @param dataSeries
 * @param accessorKey
 * @param interval
 */
export function calculateMissingData(dataSeries: IDataSeries<IAccessors>, accessorKey: string, interval: Duration): any[] {
    const dataAccessors = dataSeries.accessors.data;
    const data = dataSeries.data;
    const accessor = dataAccessors?.[accessorKey];
    if (!accessor) {
        throw new Error("Accessor " + accessorKey + " not defined!");
    }
    const minValue = accessor(data[0], 0, data, dataSeries);
    const maxValue = accessor(data[data.length - 1], data.length - 1, data, dataSeries);
    if (!minValue || !maxValue) {
        throw new Error("First or last values not defined!");
    }

    const scale = new TimeIntervalScale(interval);
    scale.domain([
        // @ts-ignore
        scale.truncToInterval(minValue, scale.interval()),
        // @ts-ignore
        scale.truncToInterval(maxValue, scale.interval()),
    ]);
    const bands = scale.getBands();

    const newData: any[] = [];
    let b = 0; // band iterator index
    for (let i = 0; i < data.length; i++) {
        const value = accessor(data[i], i, data, dataSeries);
        const truncD = scale.truncToInterval(value, scale.interval());
        // if current data point value skipped a band, we'll insert missing data points and iterate bands to catch up
        if (truncD && truncD > bands[b]) {
            newData.push({ ...data[i - 1], defined: false });
            newData.push({ ...data[i], defined: false });
            while (bands[b] < value) {
                b++;
            }
        }
        newData.push(data[i]);
        b++;
    }

    return newData;
}
