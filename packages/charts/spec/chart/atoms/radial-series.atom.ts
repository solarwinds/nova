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

import { by, ElementFinder } from "protractor";

import { SeriesAtom } from "./series.atom";

export class RadialSeriesAtom extends SeriesAtom {
    private path: ElementFinder = this.root.element(by.tagName("path"));

    /**
     * TODO: evaluate the centroid of the arc to select a proper arc. We can take this as an example:
     * https://stackoverflow.com/questions/9017100/calculate-center-of-svg-arc
     * The regexp matchers below are intended to be used in parseArcParams() method to parse the path of the svg to gather the parameters of the arc.
     */

    private firstCurveMatcher =
        /M{1}-?\d*\.?\d+\w?-?\d*,{1}-?\d+\.?\d*A{1}\d+,{1}\d+,{1}\d{1},{1}\d{1},{1}\d{1},{1}-?\d*\.?\d*\w{1}?-?\d*,?-?\d*\.?\d*/g;
    private secondCurveMatcher =
        /L{1}-?\d*\.?\d+\w?-?\d*,{1}-?\d+\.?\d*A{1}\d+,{1}\d+,{1}\d{1},{1}\d{1},{1}\d{1},{1}-?\d*\.?\d*\w{1}?-?\d*,?-?\d*\.?\d*Z{1}$/g;

    public parseArcParams(path: string, matcher: RegExp): number[] {
        const result: number[] = [];
        const match: string[] = path.match(matcher) || [];
        const arcParams: number[][] | undefined = match[0]
            .slice(1)
            .split("A")
            .map((array) => array.split(","))
            .map((params) => params.map((param) => parseFloat(param)));
        arcParams?.forEach((array) =>
            array.forEach((param) => result.push(param))
        );
        return result;
    }
}
