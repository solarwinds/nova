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

@Component({
    selector: "nui-chart-docs-tooltips",
    templateUrl: "./chart-docs-tooltips.component.html",
})
export class ChartDocsTooltipsComponent {
    public tooltipsTypeScript = `this.tooltipsPlugin = new ChartTooltipsPlugin();
this.chart.addPlugin(this.tooltipsPlugin);
...`;
    public tooltipsHtml = `...
<nui-chart-tooltips [plugin]="tooltipsPlugin" [template]="tooltipTemplate"></nui-chart-tooltips>

<ng-template let-dataPoint="dataPoint"
             #tooltipTemplate>
    <div class="p-1 d-flex align-items-center">
        <nui-chart-marker [marker]="chartAssist.markers.get(dataPoint.seriesId)"
                          [color]="chartAssist.palette.standardColors.get(dataPoint.seriesId)"></nui-chart-marker>
        <span class="pl-2">{{dataPoint.data.y}}</span>
    </div>
</ng-template>
...`;
}
