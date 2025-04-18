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
    standalone: false
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
