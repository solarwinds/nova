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
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from "@angular/core";
import { Subscription } from "rxjs";

import { ChartDonutContentPlugin } from "../core/plugins/chart-donut-content-plugin";
import { IElementPosition } from "../core/plugins/types";

@Component({
    selector: "nui-chart-donut-content",
    templateUrl: "./chart-donut-content.component.html",
    styleUrls: ["./chart-donut-content.component.less"],
})
export class ChartDonutContentComponent implements OnDestroy, OnChanges {
    /** The plugin instance */
    @Input() public plugin: ChartDonutContentPlugin;

    /** The current content position */
    public contentPosition: IElementPosition;

    private contentPositionUpdateSubscription: Subscription;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.plugin) {
            this.contentPositionUpdateSubscription?.unsubscribe();

            this.contentPositionUpdateSubscription =
                this.plugin.contentPositionUpdateSubject.subscribe(
                    (contentPosition: IElementPosition) => {
                        this.contentPosition = contentPosition;
                    }
                );

            this.plugin.chart.updateDimensions();
        }
    }

    public ngOnDestroy() {
        if (this.contentPositionUpdateSubscription) {
            this.contentPositionUpdateSubscription.unsubscribe();
        }
    }
}
