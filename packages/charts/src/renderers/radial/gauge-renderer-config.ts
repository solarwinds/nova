import { IRadialRendererConfig } from "../../core/common/types";

/**
 * Convenience function for generating a standard radial renderer configuration for a gauge
 *
 * @returns {IRadialRendererConfig} Standard renderer configuration for a gauge
 */
export function gaugeRendererConfig(): IRadialRendererConfig {
    return {
        annularGrowth: 0,
        strokeWidth: 0,
        enableSeriesHighlighting: false,
    };
}
