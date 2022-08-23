import { IChartMarker, IValueProvider } from "../../../core/common/types";
import { IBarChartConfig } from "../types";
import { IBarAccessors } from "./bar-accessors";
import { HorizontalBarAccessors } from "./horizontal-bar-accessors";
import { VerticalBarAccessors } from "./vertical-bar-accessors";

/**
 * Creates {@link VerticalBarAccessors} or {@link VerticalBarAccessors}
 * using {@link IBarChartConfig#horizontal} horizontal property. Default orientation is **vertical**.
 *
 * @param {IBarChartConfig} [config]
 * @param {IValueProvider<string>} [colorProvider]
 * @param {IValueProvider<IChartMarker>} [markerProvider]
 * @returns {IBarAccessors}
 */
export function barAccessors(
    config?: IBarChartConfig,
    colorProvider?: IValueProvider<string>,
    markerProvider?: IValueProvider<IChartMarker>
): IBarAccessors {
    return config && config.horizontal
        ? new HorizontalBarAccessors(colorProvider, markerProvider)
        : new VerticalBarAccessors(colorProvider, markerProvider);
}
