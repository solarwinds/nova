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
