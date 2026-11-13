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
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { ChartTooltipsPlugin } from "../core/plugins/tooltips/chart-tooltips-plugin";

export class ChartKeyboardTooltipController {
    private dataPointIndex = 0;
    private inspectionActive = false;

    public onConfigurationChange(
        previousPlugin: ChartTooltipsPlugin | undefined,
        currentPlugin: ChartTooltipsPlugin | undefined,
        changed: boolean
    ): void {
        if (!this.inspectionActive || !changed) {
            return;
        }
        (previousPlugin ?? currentPlugin)?.hideKeyboardTooltips();
        this.inspectionActive = false;
        this.dataPointIndex = 0;
    }

    public onFocus(
        plugin: ChartTooltipsPlugin | undefined,
        isFocusVisible: boolean
    ): void {
        this.dataPointIndex = -1;
        if (isFocusVisible) {
            this.dataPointIndex = 0;
            this.showKeyboardTooltip(plugin);
        }
    }

    public onKeydown(
        event: KeyboardEvent,
        plugin: ChartTooltipsPlugin | undefined,
        host: HTMLElement
    ): void {
        if (
            !plugin ||
            event.target !== host ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
        ) {
            return;
        }
        if (event.key === "Escape") {
            if (!this.inspectionActive) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            plugin.hideKeyboardTooltips();
            this.inspectionActive = false;
            return;
        }
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
        }
        const count = plugin.getKeyboardDataPointCount();
        if (count === 0) {
            plugin.hideKeyboardTooltips();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.dataPointIndex = Math.max(
            0,
            Math.min(
                count - 1,
                this.dataPointIndex + (event.key === "ArrowRight" ? 1 : -1)
            )
        );
        this.showKeyboardTooltip(plugin);
    }

    public onBlur(plugin: ChartTooltipsPlugin | undefined): void {
        plugin?.hideKeyboardTooltips();
        this.dataPointIndex = 0;
        this.inspectionActive = false;
    }

    private showKeyboardTooltip(plugin: ChartTooltipsPlugin | undefined): void {
        if (!plugin) {
            return;
        }
        const count = plugin.getKeyboardDataPointCount();
        if (count === 0) {
            plugin.hideKeyboardTooltips();
            return;
        }
        this.dataPointIndex = Math.min(this.dataPointIndex, count - 1);
        plugin.showForIndex(this.dataPointIndex);
        this.inspectionActive = true;
    }
}
