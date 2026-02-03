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

import type { Locator, Page } from "@playwright/test";

import { ChartAtom } from "./atoms/chart.atom";
import { LegendSeriesAtom } from "../legend/legend-series.atom";

export class SparkChartTestPage {
    private readonly page: Page;
    private readonly root: Locator;
    private readonly dataInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator(".nui-spark-chart-multiple-test");
        this.dataInput = this.root.locator("#data-input");
    }

    public async getChartCount(): Promise<number> {
        return this.root.locator(`.${ChartAtom.CSS_CLASS}`).count();
    }

    public async getSparkCountInStack(className: string): Promise<number> {
        return this.page.locator(`.${className} .${ChartAtom.CSS_CLASS}`).count();
    }

    public async getLegendSeriesCount(): Promise<number> {
        return this.root.locator(`.${LegendSeriesAtom.CSS_CLASS}`).count();
    }

    public getChart(index: number): ChartAtom {
        return new ChartAtom(this.root.locator(`.${ChartAtom.CSS_CLASS}`).nth(index));
    }

    public getLegendSeries(index: number): LegendSeriesAtom {
        return new LegendSeriesAtom(
            this.root.locator(`.${LegendSeriesAtom.CSS_CLASS}`).nth(index)
        );
    }

    public async changeData(input: number[][]): Promise<void> {
        await this.dataInput.fill("");
        await this.dataInput.type(JSON.stringify(input));
    }
}
