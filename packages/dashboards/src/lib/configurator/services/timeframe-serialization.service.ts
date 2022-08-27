import { Injectable } from "@angular/core";
import moment from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

import { ISerializableTimeframe } from "./types";

@Injectable({
    providedIn: "root",
})
export class TimeframeSerializationService {
    public convertToSerializable(
        timeframe: ITimeframe
    ): ISerializableTimeframe {
        return {
            startDatetime: timeframe.startDatetime.format(),
            endDatetime: timeframe.endDatetime.format(),
            selectedPresetId: timeframe.selectedPresetId,
            title: timeframe.title,
        };
    }

    public convertFromSerializable(
        timeframe: ISerializableTimeframe
    ): ITimeframe {
        return {
            startDatetime: moment(
                timeframe.startDatetime,
                moment.defaultFormat
            ),
            endDatetime: moment(timeframe.endDatetime, moment.defaultFormat),
            selectedPresetId: timeframe.selectedPresetId,
            title: timeframe.title,
        };
    }
}
