import { IRadialRendererConfig } from "../../../core/common/types";

/**
 * Convenience function for generating a standard renderer configuration for a donut gauge
 *
 * @returns {IRadialRendererConfig} Standard renderer configuration for a gauge
 */
export function donutGaugeRendererConfig(): IRadialRendererConfig {
    return {
        strokeWidth: 0,
        enableSeriesHighlighting: false,
    };
}
