import { IBarRendererConfig } from "../types";

/**
 * Convenience function for generating a standard renderer configuration for a linear gauge
 *
 * @returns {IBarRendererConfig} Standard renderer configuration for a linear gauge
 */
export function linearGaugeRendererConfig(): IBarRendererConfig {
    return {
        padding: 0,
        strokeWidth: 0,
        enableMinBarThickness: false,
    };
}
