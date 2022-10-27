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

import { by, element, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { LegendAtom } from "../legend/legend.atom";
import { ChartAtom } from "./atoms/chart.atom";

export class ThresholdsSummaryTestPage {
    private root: ElementFinder;
    private dataInput: ElementFinder;
    private zonesInput: ElementFinder;

    constructor() {
        this.root = element(
            by.className("nui-thresholds-summary-test-harness")
        );
        this.dataInput = this.root.element(by.id("data-input"));
        this.zonesInput = this.root.element(by.id("zones-input"));
    }

    public get mainChart(): ChartAtom {
        return Atom.findIn(
            ChartAtom,
            element(by.className("thresholds-main-chart"))
        );
    }

    public get summaryChart(): ChartAtom {
        return Atom.findIn(
            ChartAtom,
            element(by.className("thresholds-summary-chart"))
        );
    }

    public get legend(): LegendAtom {
        return Atom.findIn(
            LegendAtom,
            element(by.className("thresholds-legend"))
        );
    }

    public async changeData(input: Record<string, number[]>): Promise<void> {
        await this.dataInput.clear();
        return this.dataInput.sendKeys(JSON.stringify(input));
    }

    public async changeZones(input: any[]): Promise<void> {
        await this.zonesInput.clear();
        return this.zonesInput.sendKeys(JSON.stringify(input));
    }
}
