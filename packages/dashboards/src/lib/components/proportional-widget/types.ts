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

import { BehaviorSubject } from "rxjs";

import { IDataField, IDataFieldsConfig } from "@nova-ui/bits";
import { IAllAround, IAccessors, IChartAssistSeries } from "@nova-ui/charts";

import { IProportionalDonutContentAggregator } from "../../functions/proportional-aggregators/types";
import {
    ILegendPlacementOption,
    LegendPlacement,
} from "../../widget-types/common/widget/legend";
import { IFormatter, IFormatterDefinition } from "../types";

export enum ProportionalWidgetChartTypes {
    DonutChart = "DonutChart",
    PieChart = "PieChart",
    VerticalBarChart = "VerticalBarChart",
    HorizontalBarChart = "HorizontalBarChart",
}

export interface IProportionalWidgetChartTypeConfiguration {
    id: ProportionalWidgetChartTypes;
    label: string;
}

export interface ITickLabelConfig {
    maxWidth: Partial<IAllAround<number>>;
}

export interface IProportionalWidgetChartOptions {
    type: ProportionalWidgetChartTypes;
    contentFormatter?: IFormatter;
    legendPlacement?: LegendPlacement;
    legendFormatter?: IFormatter;
    chartFormatterComponentType?: string;
    donutContentConfig?: IDonutContentConfig;
    horizontalBarTickLabelConfig?: ITickLabelConfig;
}

export interface IProportionalWidgetConfig {
    chartDonutContentLabel?: string;
    chartDonutContentIcon?: string;
    chartOptions: IProportionalWidgetChartOptions;
    /** Chart and legend will emit an INTERACTION event on click if this property is enabled */
    interactive?: boolean;
    chartColors?: string[] | { [key: string]: string };
    /** set "true" if you want for widget configuration to override colors that come built-in data */
    prioritizeWidgetColors?: boolean;
}

export interface ILegendFormat {
    displayValue: string;
    formatKey: string;
}

export interface IProportionalWidgetChartEditorOptions {
    chartTypes: ProportionalWidgetChartTypes[];
    legendPlacementOptions: ILegendPlacementOption[];
    legendFormats: Array<ILegendFormat>;
    legendFormatters: IFormatterDefinition[];
    contentFormatters?: IFormatterDefinition[];
}

export interface IDonutContentConfig {
    formatter: IFormatter;
    aggregator: IProportionalDonutContentAggregator;
}

export interface IProportionalDataFieldsConfig extends IDataFieldsConfig {
    chartSeriesDataFields$: BehaviorSubject<IDataField[]>;
}

export interface IProportionalWidgetData
    extends IChartAssistSeries<IAccessors> {
    link?: string;
}
