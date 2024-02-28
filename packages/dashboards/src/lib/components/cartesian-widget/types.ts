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

import { UnitOption } from "@nova-ui/bits";

import { IProperties } from "../../types";
import { LegendPlacement } from "../../widget-types/common/widget/legend";

/** Enumeration of chart presets supported by the timeseries widget */
export enum CartesianChartPreset {
    Line = "line",
    Bar = "bar",
    StackedArea = "stackedArea",
    StackedPercentageArea = "stackedPercentageArea",
    StackedBar = "stackedBar",
    StatusBar = "statusBar",
}
export interface CartesianWidgetConfig {
    interaction: null | "series" | "dataPoints";
    displayedSeries: CartesianWidgetSeries[];
    legendPlacement: LegendPlacement;
    leftAxisLabel?: string;
    // timeFramePickerPresets?: ITimeFramePresetDictionary;
    enableZoom: boolean; // might go under the 'chart' configuration
    chartColors?: string[] | Record<string, string>; // might go under the 'chart' configuration
    preset: CartesianChartPreset;
    scales: CartesianScalesConfig;
    units: UnitOption;
    collectionId?: string;
    leftYAxisUnits?: UnitOption;
    rightYAxisUnits?: UnitOption;
    gridConfig?: {
        [key: string]: any;
    };
    hasAdjacentChart?: boolean;
    groupUniqueId?: string;
    allowLegendMenu?: boolean;
    metricIds?: string;
    realTimeIds?: string[];
    type?: number;
    // projectType?: TimeseriesWidgetProjectType;
}
export interface CartesianOutput<T = CartesianWidgetSeriesData> {
    series: CartesianWidgetData<T>[];
    summarySerie?: CartesianWidgetData<T>;
}
export interface CartesianWidgetSeriesData {
    x: any; //
    y: any;
    [key: string]: any;
}

export interface CartesianWidgetSeries {
    id: string;
    label: string;
    selectedSeriesId: string;
}

/**
 * List of supported scale types for the timeseries widget
 */
export enum CartesianScaleType {
    /** Continous time scale */
    Time = "time",
    /** Time interval scale */
    TimeInterval = "timeInterval",
    /** Numeric linear scale */
    Linear = "linear",
    /** Band scale */
    Band = "band",
}

/** Configuration for a chart preset */
export interface IChartPreset {
    componentType: string;
}
/**
 * Configuration of a scale for timeseries widget
 */
export interface CartesianScaleConfig {
    /** Type of the scale */
    type: CartesianScaleType;
    /** Additional properties of the scale */
    properties?: IProperties;
}

/**
 * Configuration of scales for a x/y chart
 */
export interface CartesianScalesConfig {
    x: CartesianScaleConfig;
    y: CartesianScaleConfig;
    yRight?: CartesianScaleConfig;
}

export interface CartesianWidgetData<T = CartesianWidgetSeriesData> {
    id: string;
    name: string;
    description: string;
    data: T[];
    rawData?: T[];
    transformer?: (data: T[], hasPercentile?: boolean) => T[];
    link?: string;
    secondaryLink?: string;
    metricUnits?: UnitOption;
}

export enum CartesianChartTypes {
    line = 1, // Line
    counter = 2, // StackedBar
    event = 3, // StackedBar
    alert = 4, // StackedArea
    status = 5, // StackedArea
    multi = 6, // StatusBar
    dpaWaitTime = 7, // StatusBar
}
export enum CartesianTransformer {
    None = "none",
    Normalize = "normalize",
    ChangePoint = "changePoint",
    Difference = "difference",
    Linear = "linear",
    PercentileStd = "percentileStd",
    Smoothing = "smoothing",
    LoessStandardize = "loessStandardize",
    Standardize = "standardize",
    FloatingAverage = "floatingAverage",
}
export enum CartesianInteractionType {
    DataPoints = "dataPoints",
    Series = "series",
    Values = "values",
}
