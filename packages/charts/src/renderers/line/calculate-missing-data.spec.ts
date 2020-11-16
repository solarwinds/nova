import { duration } from "moment/moment";

import { IDataSeries } from "../../core/common/types";

import { calculateMissingData } from "./calculate-missing-data";
import { LineAccessors } from "./line-accessors";

describe("calculateMissingData", () => {

    it("calculates additional points indicating missing data", () => {
        const series: IDataSeries<LineAccessors> = {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: new Date(2016, 11, 25, 5), y: 30 },
                { x: new Date(2016, 11, 25, 6), y: 95 },
                { x: new Date(2016, 11, 25, 7), y: 60 },
                // there is a time gap here, we'll expect the missing points to be generated here
                { x: new Date(2016, 11, 25, 10), y: 35 },
                { x: new Date(2016, 11, 25, 11), y: 20 },
                { x: new Date(2016, 11, 25, 12), y: 35 },
            ],
            accessors: new LineAccessors(),
        };

        const newData = calculateMissingData(series, "x", duration(1, "hour"));

        expect(newData[3].x).toEqual(newData[2].x); // same data as previous
        expect(newData[3].defined).toBe(false);
        expect(newData[4].defined).toBe(false);
        expect(newData[4].x).toEqual(newData[5].x); // same data as next
    });

});
