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

import { Atom } from "@nova-ui/bits/sdk/atoms";

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

        return Atom.findIn(
            StatusBarDataPointAtom,
            series.getElement(),
            barIndex
        );
    }

    public async getAllBarDataPointsBySeriesID(
        seriesID: string
    ): Promise<StatusBarDataPointAtom[]> {
        const allBarDataPoints = [];
        const seriesByIndex: SeriesAtom | undefined =
            await this.getDataSeriesById(SeriesAtom, seriesID);
        if (!seriesByIndex) {
            throw new Error("seriesByIndex are not defined");
        }
        for (
            let i = 0;
            i <
            (await Atom.findCount(
                StatusBarDataPointAtom,
                seriesByIndex.getElement()
            ));
            i++
        ) {
            allBarDataPoints.push(
                Atom.findIn(
                    StatusBarDataPointAtom,
                    seriesByIndex.getElement(),
                    i
                )
            );
        }
        return allBarDataPoints;
    }
}
