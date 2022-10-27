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
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

enum DataInterval {
    Poll = 5,
    Hour = 60,
    // Day = 24 * 60,
    // Week = 7 * 24 * 60,
}

export class TimeFrameBarDataService {
    /* eslint-disable max-len */
    private factors = {
        day: [
            42, 7, 63, 33, 10, 16, 57, 16, 88, 44, 35, 85, 46, 73, 29, 35, 51,
            52, 100, 51, 40, 87, 42, 90, 75, 90, 70, 16, 4, 43, 18, 63, 28, 15,
            86, 81, 48, 86, 91, 89, 15, 89, 66, 35, 65, 18, 59, 75, 69, 64, 55,
            67, 60, 76, 29, 81, 87, 73, 10, 19, 29, 83, 16, 72, 80, 43, 28, 53,
            38, 24, 88, 81, 14, 68, 80, 44, 72, 56, 89, 83, 6, 1, 1, 11, 66, 39,
            42, 81, 31, 48, 11, 76, 41, 60, 40, 15, 75, 33, 90, 80, 37, 40, 39,
            58, 69, 31, 61, 80, 85, 57, 38, 3, 45, 36, 71, 66, 36, 58, 82, 70,
            90, 78, 33, 72, 98, 36, 32, 61, 44, 13, 22, 90, 66, 87, 55, 21, 63,
            70, 41, 61, 19, 42, 65, 79, 17, 14, 85, 69, 79, 77, 99, 86, 5, 31,
            94, 2, 37, 54, 79, 32, 63, 83, 64, 52, 59, 35, 18, 45, 58, 23, 58,
            99, 61, 60, 78, 95, 63, 35, 27, 93, 46, 86, 51, 80, 73, 6, 66, 72,
            96, 7, 90, 94, 3, 66, 1, 38, 30, 11, 58, 91, 84, 100, 90, 70, 51,
            77, 56, 53, 49, 42, 84, 10, 76, 11, 66, 41, 38, 68, 24, 84, 89, 72,
            74, 54, 29, 18, 36, 13, 17, 18, 82, 14, 50, 10, 47, 12, 1, 4, 63,
            59, 62, 78, 83, 5, 25, 8, 59, 59, 28, 56, 35, 33, 31, 37, 5, 67, 34,
            93, 25, 66, 69, 64, 23, 69, 60, 24, 26, 81, 88, 66, 80, 45, 91, 68,
            83, 8, 83, 43, 96, 85, 8, 47, 67, 14, 64, 26, 96, 45,
        ],
        year: [
            64, 70, 41, 96, 74, 38, 38, 79, 77, 24, 98, 78, 22, 90, 7, 42, 95,
            76, 92, 86, 13, 5, 80, 6, 9, 90, 40, 94, 66, 12, 28, 7, 76, 74, 23,
            79, 82, 9, 9, 84, 59, 92, 63, 15, 25, 18, 83, 35, 46, 14, 22, 84,
            34, 17, 9, 25, 34, 89, 48, 80, 76, 38, 60, 43, 41, 88, 35, 32, 62,
            80, 76, 64, 41, 49, 23, 61, 27, 56, 3, 88, 37, 24, 15, 88, 85, 18,
            41, 74, 81, 13, 40, 10, 39, 30, 45, 21, 32, 46, 54, 8, 28, 19, 74,
            87, 36, 43, 74, 15, 58, 24, 98, 14, 49, 96, 51, 83, 4, 4, 13, 72,
            42, 62, 26, 80, 85, 46, 74, 60, 14, 5, 97, 16, 90, 84, 52, 10, 18,
            26, 8, 49, 71, 34, 87, 32, 15, 46, 23, 10, 86, 7, 18, 51, 31, 72,
            20, 43, 10, 91, 74, 51, 86, 89, 32, 79, 94, 5, 41, 16, 79, 66, 84,
            24, 74, 78, 69, 85, 46, 57, 92, 92, 3, 14, 5, 12, 63, 1, 6, 37, 85,
            79, 18, 88, 42, 8, 25, 94, 87, 7, 52, 16, 35, 43, 65, 63, 46, 38,
            98, 55, 100, 14, 45, 50, 49, 90, 98, 47, 20, 83, 84, 84, 58, 79,
            100, 19, 75, 94, 34, 5, 94, 29, 96, 80, 46, 33, 73, 82, 58, 68, 98,
            100, 10, 46, 96, 87, 96, 5, 64, 53, 5, 7, 19, 65, 91, 78, 59, 14,
            19, 12, 15, 92, 8, 15, 19, 99, 26, 25, 45, 29, 39, 1, 61, 74, 88,
            27, 43, 1, 93, 75, 91, 97, 38, 39, 24, 94, 29, 18, 88, 56, 62, 7,
            88, 13, 34, 21, 20, 41, 90, 95, 2, 17, 26, 4, 44, 70, 18, 65, 75,
            62, 18, 46, 18, 73, 76, 95, 2, 30, 31, 77, 77, 80, 23, 51, 48, 42,
            78, 65, 78, 56, 37, 46, 96, 72, 49, 48, 8, 45, 89, 42, 87, 28, 42,
            53, 94, 73, 57, 30, 75, 53, 77, 62, 9, 71, 9, 48, 97, 92, 91, 24,
            44, 83, 8, 86, 41, 6, 21, 45,
        ],
        century: [
            85, 83, 87, 82, 77, 65, 67, 72, 75, 76, 82, 87, 91, 93, 94, 90, 84,
            89, 86, 88, 86, 85, 82, 84, 81, 77, 77, 77, 80, 97, 18, 6, 25, 85,
            90, 25, 72, 99, 61, 79, 62, 7, 50, 41, 40, 6, 60, 65, 1, 98, 90, 31,
            57, 74, 50, 57, 68, 20, 12, 16, 33, 1, 32, 53, 76, 57, 89, 33, 48,
            28, 89, 35, 15, 3, 33, 77, 10, 1, 36, 4, 36, 88, 26, 66, 50, 3, 66,
            37, 77, 70, 9, 40, 20, 14, 55, 96, 88, 14, 9, 54,
        ],
    };
    /* eslint-enable max-len */

    /* Chart data */
    private seriesValueFunctions: Record<
        string,
        (fs: [number, number, number]) => number
    > = {
        "Tex-lab-aus-2621": ([a, b, c]) => a + 0.1 * (b - 30) + (c - 50),
        "Cz-lab-brn-02": ([a, b, c]) =>
            a + 0.01 * b * (b - 50) + 20 * Math.cos(c * 0.02 * Math.PI),
    };

    public getChartData(
        from: Moment,
        to: Moment,
        delayInterval: number = 0
    ): Observable<Record<string, { x: Moment; y: number }[]>> {
        const rules = this.seriesValueFunctions;
        const results: Record<string, { x: moment.Moment; y: number }[]> = {};

        const duration = moment.duration(to.diff(from));
        const dataInterval =
            duration.asHours() > 12 ? DataInterval.Hour : DataInterval.Poll;

        for (const seriesId of Object.keys(rules)) {
            results[seriesId] = this.getData(
                from,
                to,
                rules[seriesId],
                dataInterval
            );
        }

        return of(results).pipe(delay(delayInterval));
    }

    private getData(
        start: Moment,
        end: Moment,
        valueFn: (fs: [number, number, number]) => number,
        interval: DataInterval = DataInterval.Poll
    ): { x: moment.Moment; y: number }[] {
        const startCorrector = start.minutes() % interval;
        const currentDate = start
            .clone()
            .subtract(startCorrector, "minutes")
            .seconds(0); // rounds to pollInterval
        const endCorrector = interval - (end.minutes() % interval);
        const endDate = end.clone().add(endCorrector, "minutes").seconds(0); // rounds to 5 minutes pollInterval
        const count = Math.ceil(
            moment.duration(endDate.diff(currentDate)).asMinutes() / interval
        );
        const results = [];

        for (let i = 0; i < count; i++) {
            const fDay =
                this.factors.day[
                    Math.ceil(
                        (60 * currentDate.hours() + currentDate.minutes()) / 5
                    )
                ];
            const fYear = this.factors.year[currentDate.dayOfYear()];
            const fCentury = this.factors.century[currentDate.year() % 100];
            results.push({
                x: currentDate.clone(),
                y: valueFn([fCentury, fYear, fDay]),
            });
            currentDate.add(interval, "minutes");
        }

        return results;
    }
}
