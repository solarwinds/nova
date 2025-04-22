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

import { OverlayConfig } from "@angular/cdk/overlay";
import { Component } from "@angular/core";

const CHART_PALETTE_CS1: string[] = [
    "var(--nui-color-bg-secondary)",
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-ten)",
];

// Left and right paddings of .color-picker-container element
const CONTAINER_SIDE_PADDINGS_PX: number = 20;
// Width of the .box element
const BOX_WIDTH_PX: number = 30;

@Component({
    selector: "nui-select-v2-color-picker",
    templateUrl: "./select-v2-color-picker.component.html",
    styleUrls: ["./select-v2-color-picker.component.less"],
    standalone: false,
})
export class SelectV2ColorPickerComponent {
    // With this param one is able to configure how many columns wide should the color picker be
    public cols: number = 6;

    public overlayConfig: OverlayConfig = {
        // To automatically calculate the max-width use the approach below if you want to optionally change the amount of color boxes per row,
        // but for most cases just hardcoding the necessary value will be enough
        maxWidth: this.cols
            ? this.cols * BOX_WIDTH_PX + CONTAINER_SIDE_PADDINGS_PX + "px"
            : "150px", // defaults to 4 columns picker
    };
    public backgroundColors: string[] = CHART_PALETTE_CS1;
    public defaultColor = "var(--nui-color-bg-secondary)";
}
