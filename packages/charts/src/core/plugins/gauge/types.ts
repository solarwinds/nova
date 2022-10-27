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

/**
 * Configuration for the gauge labels plugins
 */
export interface IGaugeLabelsPluginConfig {
    /** Set the distance of the labels from the gauge (in pixels). */
    padding?: number;
    /** The name of the label formatter */
    formatterName?: string;
    /** Set whether labels should be disabled for the thresholds when the gauge is hovered. */
    disableThresholdLabels?: boolean;
    /**
     * Currently only supported on linear gauges. Set this to true to change the side
     * of the gauge that the labels appear on.
     */
    flippedLabels?: boolean;

    // TODO: NUI-5815
    /** Set whether labels should be displayed for each value interval when the gauge is hovered. */
    // enableIntervalLabels?: boolean;
}
