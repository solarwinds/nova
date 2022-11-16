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

import { Injectable } from "@angular/core";
import moment from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

import { ISerializableTimeframe } from "../../types";

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
