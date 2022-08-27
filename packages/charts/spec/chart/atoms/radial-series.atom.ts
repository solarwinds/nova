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
        const arcParams: number[][] = (path.match(matcher) || [])[0]
            .slice(1)
            .split("A")
            .map((array) => array.split(","))
            .map((params) => params.map((param) => parseFloat(param)));
        arcParams.forEach((array) =>
            array.forEach((param) => result.push(param))
        );
        return result;
    }
}
