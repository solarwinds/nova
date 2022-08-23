import { Pipe, PipeTransform } from "@angular/core";

import { ITimeframe } from "./public-api";

/**
 * Pipe used for formatting ITimeframe values
 *
 * __Usage :__
 *
 *   value | timeFrame:formatString
 *
 * __Parameters  :__
 *
 * value - value to be converted
 *
 * momentFormat - Optional string of format tokens
 *
 * __Example :__
 *
 *   <code>{{ myTimeFrame | timeFrame }}</code>
 *
 * or
 *
 *   <code>{{ myTimeFrame | timeFrame: "MMMM Do YYYY, h:mm:ss a" }}</code>
 *
 */

@Pipe({
    name: "timeFrame",
})
export class TimeFrameFormatPipe implements PipeTransform {
    transform(timeFrame: ITimeframe, momentFormat: string = "LLL"): string {
        return timeFrame
            ? timeFrame.title ||
                  `${timeFrame.startDatetime.format(
                      momentFormat
                  )} - ${timeFrame.endDatetime.format(momentFormat)}`
            : "";
    }
}
