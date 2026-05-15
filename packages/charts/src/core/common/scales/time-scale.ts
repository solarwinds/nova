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

import { AxisScale } from "d3-axis";
import { scaleTime } from "d3-scale";

import { datetimeFormatter } from "./formatters/datetime-formatter";
import { Scale } from "./scale";

/**
 * Nova wrapper around [D3's scaleTime](https://d3indepth.com/scales/#scaletime)
 */
export class TimeScale extends Scale<Date> {
    constructor(id?: string) {
        super(id);

        this.formatters.tick = datetimeFormatter;
    }

    protected createD3Scale(): AxisScale<Date> {
        return scaleTime();
    }

    public convert(value: Date): number {
        return this._d3Scale(value);
    }

    public invert(coordinate: number): Date | undefined {
        const date = this._d3Scale.invert(coordinate);
        const result: Date | undefined = isNaN(date.getTime())
            ? undefined
            : date;
        return result;
    }

    public isContinuous(): boolean {
        return true;
    }

    public isDomainValid(): boolean {
        return (
            -1 === this.domain().findIndex((value) => isNaN(value.getTime()))
        );
    }
}
