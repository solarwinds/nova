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

import { DefaultArcObject } from "d3";
import { pie } from "d3-shape";

import { IGaugeThresholdDatum } from "../../../gauge/types";

export class DonutGaugeRenderingUtil {
    public static generateThresholdArcData(
        data: IGaugeThresholdDatum[]
    ): DefaultArcObject[] {
        if (!data.length) {
            return [];
        }

        const arcData: number[] =
            DonutGaugeRenderingUtil.generateArcValues(data);
        const thresholdsData: any[] = [];
        const pieGenerator = pie().sort(null);
        const arcsForMarkers = pieGenerator(arcData);

        arcsForMarkers.forEach((arcDatum: any, i: number) => {
            if (i % 2 === 1) {
                thresholdsData.push(arcDatum);
            }
        });
        return thresholdsData;
    }

    private static generateArcValues(data: IGaugeThresholdDatum[]): number[] {
        // arcs with a value of zero serve as the threshold points
        const arcData: number[] = Array(data.length * 2 - 1).fill(0);
        data.forEach((d: IGaugeThresholdDatum, i: number) => {
            // arcs with a non-zero value serve as the space between the threshold points
            arcData[i * 2] = i === 0 ? d.value : d.value - data[i - 1].value;
        });
        return arcData;
    }
}
