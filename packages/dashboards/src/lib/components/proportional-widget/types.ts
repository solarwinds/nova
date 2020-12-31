import { IDataField, IDataFieldsConfig } from "@solarwinds/nova-bits";
import { BehaviorSubject } from "rxjs";

import { IProportionalDonutContentAggregator } from "../../functions/proportional-aggregators/types";
import { ILegendPlacementOption } from "../../types";
import { IFormatter, IFormatterDefinition, LegendPlacement } from "../types";

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

export interface IProportionalWidgetChartOptions {
    type: ProportionalWidgetChartTypes;
    contentFormatter?: IFormatter;
    legendPlacement?: LegendPlacement;
    legendFormatter?: IFormatter;
    chartFormatterComponentType?: string;
    donutContentConfig?: IDonutContentConfig;
}

export interface IProportionalWidgetConfig {
    chartDonutContentLabel?: string;
    chartDonutContentIcon?: string;
    chartOptions: IProportionalWidgetChartOptions;
    /** Chart and legend will emit an INTERACTION event on click if this property is enabled */
    interactive?: boolean;
    chartColors?: string[];
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
