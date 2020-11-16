import moment from "moment/moment";

import { ITimeframe } from "./public-api";
import { TimeFrameFormatPipe } from "./time-frame-format.pipe";

describe("pipes >", () => {
    describe("timeFrame pipe >", () => {
        interface ITimeFrameFormatPipeTestCase {
            condition: string;
            arguments: [ITimeframe, string?];
            expectation: string;
        }

        const pipe = new TimeFrameFormatPipe();
        const startDatetime = moment([2000]).add({ days: -1 });
        const endDatetime = moment([2000]).add({ minutes: -1 });
        const presetTimeFrame: ITimeframe = {
            startDatetime,
            endDatetime,
            selectedPresetId: "lastDayOfMillenium",
            title: "Last Day of Millenium",
        };
        const customTimeFrame: ITimeframe = {
            startDatetime,
            endDatetime,
        };

        const testCases: ITimeFrameFormatPipeTestCase[] = [
            {
                condition: "empty if time frame is not defined",
                // @ts-ignore: Suppressing error for testing purposes
                arguments: [undefined],
                expectation: "",
            },
            {
                condition: "empty if time frame is null",
                // @ts-ignore: Suppressing error for testing purposes
                arguments: [null],
                expectation: "",
            },
            {
                condition: "time frame title if time frame has a title",
                arguments: [presetTimeFrame],
                // @ts-ignore: Suppressing error for testing purposes
                expectation: presetTimeFrame.title,
            },
            {
                condition: "formatted start - end string if time frame has no title",
                arguments: [customTimeFrame],
                expectation: "December 31, 1999 12:00 AM - December 31, 1999 11:59 PM",
            },
            {
                condition: "formatted start - end string if time frame has no title",
                arguments: [customTimeFrame, "MMMM Do YYYY, h:mm:ss a"],
                expectation: "December 31st 1999, 12:00:00 am - December 31st 1999, 11:59:00 pm",
            },
        ];

        testCases.forEach(testCase => {
            it(`should return ${testCase.condition}`, () => {
                expect(pipe.transform(...testCase.arguments)).toBe(testCase.expectation);
            });
        });

    });
});
