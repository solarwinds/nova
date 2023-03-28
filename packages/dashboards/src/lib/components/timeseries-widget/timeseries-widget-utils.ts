import { TimeseriesChartTypes } from "./types";

export function hasTimeseriesWidgetSummaryLegend(type: TimeseriesChartTypes): boolean {
  return type === TimeseriesChartTypes.alert || type === TimeseriesChartTypes.event || type === TimeseriesChartTypes.multi;
}

export const SUMMARY_LEGEND_BCG_COLOR = "var(--nui-color-brand-six)";
export const SUMMARY_LEGEND_COLOR = "var(--nui-color-text-light)";