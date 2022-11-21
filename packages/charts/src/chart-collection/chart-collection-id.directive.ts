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
    Directive,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
} from "@angular/core";

import { CHART_COMPONENT } from "../constants";
import { IChartComponent } from "../core/common/types";
import { ChartCollectionService } from "./chart-collection.service";

/**
 * This directive represents a grouping behavior that is separated from chart components. Any chart component
 * registering the CHART_COMPONENT provider can be injected into this.
 *
 * A group of charts with the same associated chart collection id will share events broadcasted through their event buses.
 */
@Directive({
    selector: "[nuiChartCollectionId]",
})
export class ChartCollectionIdDirective implements OnChanges {
    @Input("nuiChartCollectionId")
    public collectionId: string;

    constructor(
        @Inject(CHART_COMPONENT) private chartComponent: IChartComponent,
        private chartCollectionService: ChartCollectionService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        const collectionIdChange = changes.collectionId;
        if (collectionIdChange) {
            if (collectionIdChange.previousValue) {
                this.chartCollectionService
                    .getChartCollection(collectionIdChange.previousValue)
                    .removeChart(this.chartComponent.chart);
            }
            if (collectionIdChange.currentValue) {
                this.chartCollectionService
                    .getChartCollection(collectionIdChange.currentValue)
                    .addChart(this.chartComponent.chart);
            }
        }
    }
}
