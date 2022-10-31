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

import { Atom, TimeFrameBarAtom } from "@nova-ui/bits/sdk/atoms";

import { ChartAtom } from "./atoms/chart.atom";

export class TimeFrameBarTestPage {
    private root: ElementFinder;
    private delayCheckbox: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-time-frame-bar-test"));
        this.delayCheckbox = this.root.element(by.id("delay"));
    }

    public get chart(): ChartAtom {
        return Atom.findIn(ChartAtom, element(by.className("chart")));
    }

    public get timeFrameBar(): TimeFrameBarAtom {
        return Atom.findIn(
            TimeFrameBarAtom,
            element(by.className("time-frame-bar"))
        );
    }

    public async removeDelay(): Promise<void> {
        if (await this.delayCheckbox.isSelected()) {
            return this.delayCheckbox.click();
        }

        return;
    }
}
