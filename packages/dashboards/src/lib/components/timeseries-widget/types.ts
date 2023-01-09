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

import { ITimeFramePresetDictionary, UnitOption } from "@nova-ui/bits";

import { IProperties } from "../../types";
import { LegendPlacement } from "../../widget-types/common/widget/legend";

export interface ITimeseriesWidgetConfig {
    interaction: null | "series" | "dataPoints";
    displayedSeries: ITimeseriesWidgetSeries[];
    legendPlacement: LegendPlacement;
    leftAxisLabel?: string;
    timeFramePickerPresets?: ITimeFramePresetDictionary;
    enableZoom: boolean; // might go under the 'chart' configuration
    chartColors?: string[]; // might go under the 'chart' configuration
    preset: TimeseriesChartPreset;
    scales: ITimeseriesScalesConfig;
    units: UnitOption;
    collectionId?: string;
    leftYAxisUnits?: UnitOption;
    rightYAxisUnits?: UnitOption;
    gridConfig?: {
        [key: string]: any;
    };
    hasAdjacentChart?: boolean;
}

export interface ITimeseriesWidgetSeries {
    id: string;
    label: string;
    selectedSeriesId: string;
}

export interface ITimeseriesWidgetData<T = ITimeseriesWidgetSeriesData> {
    id: string;
    name: string;
    description: string;
    data: T[];
    link?: string;
    secondaryLink?: string;
}

export interface ITimeseriesWidgetSeriesData {
    x: any; // used to be Moment, but TimeIntervalScale isn't Moment compatible, so it needs to support primarily Date type
    y: any;
    [key: string]: any;
}

export interface ITimeseriesWidgetStatusData
    extends ITimeseriesWidgetSeriesData {
    thick?: boolean;
    color?: string;
    icon?: string;
}

export interface ITimeseriesOutput<T = ITimeseriesWidgetSeriesData> {
    series: ITimeseriesWidgetData<T>[];
}

export enum TimeseriesInteractionType {
    DataPoints = "dataPoints",
    Series = "series",
    Values = "values",
}

/** Configuration for a chart preset */
export interface IChartPreset {
    componentType: string;
}

/**
 * Configuration of scales for a x/y chart
 */
export interface ITimeseriesScalesConfig {
    x: ITimeseriesScaleConfig;
    y: ITimeseriesScaleConfig;
    yRight?: ITimeseriesScaleConfig;
}

/**
 * Configuration of a scale for timeseries widget
 */
export interface ITimeseriesScaleConfig {
    /** Type of the scale */
    type: TimeseriesScaleType;
    /** Additional properties of the scale */
    properties?: IProperties;
}

/**
 * List of supported scale types for the timeseries widget
 */
export enum TimeseriesScaleType {
    /** Continous time scale */
    Time = "time",
    /** Time interval scale */
    TimeInterval = "timeInterval",
    /** Numeric linear scale */
    Linear = "linear",
}

/** Enumeration of chart presets supported by the timeseries widget */
export enum TimeseriesChartPreset {
    Line = "line",
    StackedArea = "stackedArea",
    StackedPercentageArea = "stackedPercentageArea",

    StackedBar = "stackedBar",
    StatusBar = "statusBar",
}
