import { IRendererConfig } from "../core/common/types";

import { IMarkerInteractionConfig, RenderState } from "./types";

/** Renderer configuration for the thresholds on a chart */
export const THRESHOLDS_MAIN_CHART_RENDERER_CONFIG: IRendererConfig = {
    stateStyles: {
        [RenderState.default]: {
            opacity: 0,
        },
        [RenderState.hidden]: {
            opacity: 0,
        },
        [RenderState.deemphasized]: {
            opacity: 0,
        },
        [RenderState.emphasized]: {
            opacity: 1,
        },
    },
    ignoreForDomainCalculation: true,
};

/** Renderer configuration for a thresholds summary chart */
export const THRESHOLDS_SUMMARY_RENDERER_CONFIG: IRendererConfig = {
    stateStyles: {
        [RenderState.default]: {
            opacity: 0.3,
        },
        [RenderState.hidden]: {
            opacity: 0,
        },
        [RenderState.deemphasized]: {
            opacity: 0,
        },
        [RenderState.emphasized]: {
            opacity: 1,
        },
    },
    ignoreForDomainCalculation: true,
};

/** Default configuration for marker interaction */
export const DEFAULT_MARKER_INTERACTION_CONFIG: IMarkerInteractionConfig = {
    enabled: false,
    clickable: false,
};

/**
 * Class name for gauge threshold markers
 */
export const GAUGE_THRESHOLD_MARKER_CLASS = "gauge-threshold-marker";
