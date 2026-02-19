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

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { StatusBarDataPointAtom } from "./atoms/status-bar-data-point.atom";

export class StatusChartAtom extends ChartAtom {
    public async getStatusBarDataPointByIndex(
        seriesID: string,
        barIndex: number
    ): Promise<StatusBarDataPointAtom> {
        const series: SeriesAtom | undefined = await this.getDataSeriesById(
            SeriesAtom,
            seriesID
        );

        if (!series) {
            throw new Error("series are not defined");
        }

        const barLocator = series
            .getLocator()
            .locator(`.${StatusBarDataPointAtom.CSS_CLASS}`)
            .nth(barIndex);

        return new StatusBarDataPointAtom(barLocator);
    }

    public async getAllBarDataPointsBySeriesID(
        seriesID: string
    ): Promise<StatusBarDataPointAtom[]> {
        const seriesById: SeriesAtom | undefined = await this.getDataSeriesById(
            SeriesAtom,
            seriesID
        );
        if (!seriesById) {
            throw new Error(`Series '${seriesID}' was not found in the chart`);
        }

        const barsLocator = seriesById
            .getLocator()
            .locator(`.${StatusBarDataPointAtom.CSS_CLASS}`);

        const count = await barsLocator.count();
        const result: StatusBarDataPointAtom[] = [];

        for (let i = 0; i < count; i++) {
            result.push(new StatusBarDataPointAtom(barsLocator.nth(i)));
        }

        return result;
    }
}
