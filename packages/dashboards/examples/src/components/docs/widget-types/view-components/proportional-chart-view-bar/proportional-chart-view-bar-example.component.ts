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

import { Component } from "@angular/core";

import { IProportionalDataItem } from "@nova-ui/dashboards";

/**
 * Proportional Chart View - Bar chart with interaction.
 * Demonstrates horizontal bar chart variant with click handling.
 */
@Component({
    selector: "proportional-chart-view-bar-example",
    template: `
        <div style="height: 300px; width: 100%;">
            <nui-proportional-chart-view
                [data]="chartData"
                chartType="horizontalBar"
                legendPlacement="none"
                [colors]="colors"
                [interactive]="true"
                (itemClick)="onItemClick($event)"
            ></nui-proportional-chart-view>
        </div>

        <p class="mt-3" *ngIf="lastClicked">
            Clicked segment: <strong>{{ lastClicked.name }}</strong>
            (value: {{ lastClicked.value }})
        </p>
    `,
    standalone: false,
})
export class ProportionalChartViewBarExampleComponent {
    public lastClicked: IProportionalDataItem | null = null;

    public colors: Array<string> = [
        "#0058e9",
        "#2cc079",
        "#f3a002",
        "#dc3545",
        "#8a2be2",
    ];

    public chartData: Array<IProportionalDataItem> = [
        { id: "chrome", name: "Chrome", value: 64 },
        { id: "firefox", name: "Firefox", value: 18 },
        { id: "safari", name: "Safari", value: 10 },
        { id: "edge", name: "Edge", value: 5 },
        { id: "other", name: "Other", value: 3 },
    ];

    public onItemClick(item: IProportionalDataItem): void {
        this.lastClicked = item;
    }
}
