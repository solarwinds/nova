import * as d3 from "d3";
import cloneDeep from "lodash/cloneDeep";

import { ITimeseriesWidgetSeriesData } from "../types";
import { transformLoessSmoothing } from "./transformer-loess";

export function transformChangePoint(
    data: ITimeseriesWidgetSeriesData[],
    hasPercentile?: boolean
): ITimeseriesWidgetSeriesData[] {
    let transformed = cloneDeep(data);
    const sectionSize = 20; // to change section size
    const criticalValue = 1.729; // one-tail 0.05

    transformed = transformLoessSmoothing(transformed, hasPercentile);

    let tScore: number; // The t_score formula enables you to take an individual score and transform it into a standardized form>one which helps you to compare scores.
    let meanOfFirstSection: number = 0;
    let standardDeviationOfFirstSection: number;
    let meanOfSecondSection: number;
    let standardDeviationOfSecondSection: number;
    let yValuesOfFirstSection = [];
    let yValuesOfSecondSection = [];
    let merging: boolean = true;
    let startIndex: number = 0;
    let endIndex: number = sectionSize - 1;
    let startIndex2: number = sectionSize;
    let endIndex2: number = startIndex2 + endIndex;
    while (merging) {
        merging = false;
        yValuesOfFirstSection = [];
        yValuesOfSecondSection = [];
        for (let i = startIndex; i <= endIndex; i++) {
            yValuesOfFirstSection.push(data[i].y);
        }
        for (let j = startIndex2; j <= endIndex2; j++) {
            yValuesOfSecondSection.push(data[j].y);
        }
        meanOfFirstSection = d3.mean(yValuesOfFirstSection) ?? 0;
        meanOfSecondSection = d3.mean(yValuesOfSecondSection) ?? 0;
        standardDeviationOfFirstSection =
            d3.deviation(yValuesOfFirstSection) ?? 0;
        if (standardDeviationOfFirstSection < 1.0) {
            standardDeviationOfFirstSection = 1.0;
        }
        standardDeviationOfSecondSection =
            d3.deviation(yValuesOfSecondSection) ?? 0;
        if (standardDeviationOfSecondSection < 1.0) {
            standardDeviationOfSecondSection = 1.0;
        }
        tScore = getT_Score(
            meanOfFirstSection,
            meanOfSecondSection,
            standardDeviationOfFirstSection,
            standardDeviationOfSecondSection,
            yValuesOfFirstSection.length,
            yValuesOfSecondSection.length,
            criticalValue
        );
        if (tScore > criticalValue) {
            for (let k = startIndex; k <= endIndex; k++) {
                transformed[k].y = meanOfFirstSection;
            }
            startIndex = startIndex2;
        }
        endIndex = endIndex2;
        if (endIndex + sectionSize < data.length) {
            merging = true;
            startIndex2 = endIndex + 1;
            endIndex2 = startIndex2 + sectionSize - 1;
        } else {
            endIndex = data.length - 1;
        }
    }
    for (let k = startIndex; k <= endIndex; k++) {
        transformed[k].y = meanOfFirstSection;
    }
    return transformed;
}

function getT_Score(
    meanOfFirstSection1: number,
    meanOfSecondSection: number,
    standardDeviationOfFirstSection: number,
    standardDeviationOfSecondSection: number,
    sizeOfFirstSection: number,
    sizeOfSecondSection: number,
    criticalValue: number
) {
    const differenceOfSampleMeans = meanOfFirstSection1 - meanOfSecondSection;
    const standardDeviationOfBothSections =
        Math.pow(standardDeviationOfFirstSection, 2) / sizeOfFirstSection +
        Math.pow(standardDeviationOfSecondSection, 2) / sizeOfSecondSection;
    const squareRootofResult = Math.sqrt(standardDeviationOfBothSections);
    let tScore = differenceOfSampleMeans / squareRootofResult;
    if (tScore > criticalValue) {
        if (
            meanOfFirstSection1 <
                meanOfSecondSection + 2 * standardDeviationOfSecondSection &&
            meanOfFirstSection1 >
                meanOfSecondSection - 2 * standardDeviationOfSecondSection &&
            meanOfSecondSection <
                meanOfFirstSection1 + 2 * standardDeviationOfFirstSection &&
            meanOfSecondSection >
                meanOfFirstSection1 - 2 * standardDeviationOfFirstSection
        ) {
            tScore = 0.0;
        }
    }
    return Math.abs(tScore);
}
