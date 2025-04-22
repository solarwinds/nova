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
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Host,
    Input,
    Optional,
    ViewEncapsulation,
} from "@angular/core";
import _isNil from "lodash/isNil";

import { LegendSeriesComponent } from "../../legend-series/legend-series.component";
import { LegendComponent } from "../../legend.component";

@Component({
    selector: "nui-rich-legend-tile",
    templateUrl: "./rich-legend-tile.component.html",
    styleUrls: ["./rich-legend-tile.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    standalone: false
})
export class RichLegendTileComponent
    implements AfterContentInit, AfterViewInit
{
    /**
     * The series unit label
     */
    @Input() public unitLabel: string;

    /**
     * The current value of the series
     */
    @Input() public value: string;

    /**
     * The series color
     */
    @Input() public backgroundColor: string;

    /**
     * Color for the text
     */
    @Input() public color: string;

    public seriesHasAdditionalContent: boolean;

    constructor(
        @Host() private legendSeries: LegendSeriesComponent,
        @Optional() @Host() private legend: LegendComponent,
        private changeDetector: ChangeDetectorRef
    ) {}

    public ngAfterContentInit(): void {
        if (this.legend) {
            this.unitLabel = this.unitLabel || this.legend.seriesUnitLabel;
            this.backgroundColor =
                this.backgroundColor || this.legend.seriesColor || "white";
        }
    }

    public ngAfterViewInit(): void {
        if (this.legendSeries) {
            this.seriesHasAdditionalContent =
                this.legendSeries.hasInputDescription() ||
                this.legendSeries.hasProjectedDescription();
            this.changeDetector.detectChanges();
        }
    }

    public hasInputValue(): boolean {
        return !_isNil(this.value);
    }

    public hasInputUnitLabel(): boolean {
        return !_isNil(this.unitLabel);
    }
}
