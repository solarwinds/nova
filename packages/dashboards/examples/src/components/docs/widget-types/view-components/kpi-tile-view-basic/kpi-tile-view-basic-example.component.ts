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

/**
 * Basic KPI Tile View example demonstrating standalone usage
 * without any Pizzagna framework dependencies.
 */
@Component({
    selector: "kpi-tile-view-basic-example",
    template: `
        <div class="d-flex gap-3" style="height: 150px;">
            <!-- Simple KPI tile with value, label, and background color -->
            <nui-kpi-tile-view
                [value]="42"
                label="Nodes Up"
                units="%"
                backgroundColor="#2cc079"
            ></nui-kpi-tile-view>

            <!-- KPI tile showing a warning state -->
            <nui-kpi-tile-view
                [value]="7"
                label="Critical Alerts"
                backgroundColor="#f3a002"
            ></nui-kpi-tile-view>

            <!-- KPI tile showing empty state -->
            <nui-kpi-tile-view
                [value]="null"
                label="Response Time"
                units="ms"
                backgroundColor="#707070"
                [empty]="true"
            ></nui-kpi-tile-view>

            <!-- KPI tile in loading state -->
            <nui-kpi-tile-view
                [value]="null"
                label="Throughput"
                units="req/s"
                backgroundColor="#3b5998"
                [loading]="true"
            ></nui-kpi-tile-view>
        </div>
    `,
    standalone: false,
})
export class KpiTileViewBasicExampleComponent {}
