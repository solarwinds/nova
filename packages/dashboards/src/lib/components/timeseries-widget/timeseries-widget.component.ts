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
    SimpleChanges,
} from "@angular/core";

import { IHasChangeDetector } from "../../types";
import { TimeseriesChartPresetService } from "./timeseries-chart-preset.service";
import {
    IChartPreset,
    ITimeseriesOutput,
    ITimeseriesWidgetConfig,
    TimeseriesChartPreset,
} from "./types";

/** @ignore */
@Component({
    selector: "nui-timeseries-widget",
    styleUrls: ["./timeseries-widget.component.less"],
    templateUrl: "./timeseries-widget.component.html",
})
export class TimeseriesWidgetComponent
    implements OnChanges, IHasChangeDetector
{
    public static lateLoadKey = "TimeseriesWidgetComponent";

    @Input() public widgetData?: ITimeseriesOutput;
    @Input() public configuration?: ITimeseriesWidgetConfig;
    @Input() public collectionId?: string;

    @Input() @HostBinding("class") public elementClass = "";

    public chartPreset: IChartPreset;

    constructor(
        public timeseriesChartPresetService: TimeseriesChartPresetService,
        public changeDetector: ChangeDetectorRef
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.configuration) {
            const configurationCurrent: ITimeseriesWidgetConfig =
                changes.configuration.currentValue;
            const configurationPrevious: ITimeseriesWidgetConfig =
                changes.configuration.previousValue;

            if (
                configurationCurrent?.preset !== configurationPrevious?.preset
            ) {
                this.chartPreset =
                    this.timeseriesChartPresetService.presets[
                        this.configuration?.preset ?? TimeseriesChartPreset.Line
                    ];
            }
        }
    }

    /** Checks if chart should be shown. */
    public shouldShowChart(): boolean {
        return (this.widgetData?.series?.length ?? 0) > 0;
    }
}
