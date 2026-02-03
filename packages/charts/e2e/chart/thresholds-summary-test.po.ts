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

import { LegendAtom } from "../legend/legend.atom";
import { ChartAtom } from "./atoms/chart.atom";

export class ThresholdsSummaryTestPage {
    private readonly page: Page;
    private readonly root: Locator;
    private readonly dataInput: Locator;
    private readonly zonesInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator(".nui-thresholds-summary-test-harness");
        this.dataInput = this.root.locator("#data-input");
        this.zonesInput = this.root.locator("#zones-input");
    }

    public get mainChart(): ChartAtom {
        return new ChartAtom(
            this.page.locator(".thresholds-main-chart .nui-chart")
        );
    }

    public get summaryChart(): ChartAtom {
        return new ChartAtom(
            this.page.locator(".thresholds-summary-chart .nui-chart")
        );
    }

    public get legend(): LegendAtom {
        return new LegendAtom(this.page.locator(".thresholds-legend"));
    }

    public async changeData(input: Record<string, number[]>): Promise<void> {
        await this.dataInput.fill("");
        await this.dataInput.type(JSON.stringify(input));
    }

    public async changeZones(input: any[]): Promise<void> {
        await this.zonesInput.fill("");
        await this.zonesInput.type(JSON.stringify(input));
    }
}
