import { ITimeframe } from "@nova-ui/bits";
import moment from "moment/moment";

import { TimeframeSerializationService } from "./timeframe-serialization.service";
import { ISerializableTimeframe } from "./types";

describe("TimeframeSerializationService > ", () => {
    const startDatetime = "2019-11-09T10:14:33-06:00";
    const endDatetime = "2019-11-16T10:14:33-06:00";
    const selectedPresetId = "last7Days";
    const title = "Last 7 Days";
    const nonSerializableTimeframe: ITimeframe = {
        startDatetime: moment(startDatetime, moment.defaultFormat),
        endDatetime: moment(endDatetime, moment.defaultFormat),
        selectedPresetId,
        title,
    };

    it("should deserialize a serializable timeframe", () => {
        const serializableTimeframe: ISerializableTimeframe = {
            startDatetime: startDatetime,
            endDatetime: endDatetime,
            selectedPresetId,
            title,
        };

        expect(new TimeframeSerializationService().convertFromSerializable(serializableTimeframe)).toEqual(nonSerializableTimeframe);
    });

    it("should render a serializable timeframe", () => {
        const serializableTimeframe: ISerializableTimeframe = {
            startDatetime: moment(startDatetime).format(),
            endDatetime: moment(endDatetime).format(),
            selectedPresetId,
            title,
        };

        expect(new TimeframeSerializationService().convertToSerializable(nonSerializableTimeframe)).toEqual(serializableTimeframe);
    });
});
