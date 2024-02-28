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

import {
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";

import { CartesianChartPresetService } from "./services/cartesian-chart-preset.service";
import {
    CartesianChartPreset,
    CartesianOutput,
    CartesianWidgetConfig,
    IChartPreset,
} from "./types";

@Component({
    selector: "cartesian-widget-component",
    templateUrl: "cartesian-widget-component.component.html",
})
export class CartesianWidgetComponent implements OnInit, OnChanges {
    public static lateLoadKey = "CartesianWidgetComponent";

    @Input() public widgetData: CartesianOutput;
    @Input() public configuration: CartesianWidgetConfig;
    @Input() @HostBinding("class") public elementClass: string;

    public allowPopover = false;
    public chartPreset: IChartPreset;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private cartesianChartPresetService: CartesianChartPresetService
    ) {}

    public ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.configuration) {
            const configurationCurrent: CartesianWidgetConfig =
                changes.configuration.currentValue;
            const configurationPrevious: CartesianWidgetConfig =
                changes.configuration.previousValue;

            if (
                configurationCurrent?.preset !== configurationPrevious?.preset
            ) {
                this.chartPreset =
                    this.cartesianChartPresetService.presets[
                        this.configuration?.preset ?? CartesianChartPreset.Line
                    ];
            }
        }
    }

    /** Checks if chart should be shown. */
    public shouldShowChart(): boolean {
        return (this.widgetData?.series?.length ?? 0) > 0;
    }

    public toggleLeave(): void {
        this.allowPopover = false;
    }

    public toggleEnter(): void {
        this.allowPopover = true;
    }
}
