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
    selector: "nui-chart-docs-chart-setup",
    templateUrl: "./chart-docs-chart-setup.component.html",
})
export class ChartDocsChartSetupComponent {
    public basicChartTemplate = `<nui-chart [chart]="chart"></nui-chart>`;
    public basicSeries = `const chartSeries: IChartSeries = {
    id: "series-1",
    name: "Series 1",
    data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
    ],
    scales: {
        x: new LinearScale(),
        y: new LinearScale(),
    },
    renderer: new LineRenderer(),
};
...`;
    public basicData = `const chartSeries: IChartSeries = {
    id: "series-1",
    name: "Series 1",
    data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
    ],
    ...
};`;
    public basicScales = `const chartSeries: IChartSeries = {
    ...
    scales: {
        x: new LinearScale(),
        y: new LinearScale(),
    },
    ...
};`;
    public renderer = `const chartSeries: IChartSeries = {
    ...
    renderer: new LineRenderer(),
    ...
};`;
    public chartSetup = `const chart = new Chart(new XYGrid());
...`;
    public chartUpdate = `const seriesSet: IChartSeries[] = [...];
chart.update(seriesSet);
...`;
}
