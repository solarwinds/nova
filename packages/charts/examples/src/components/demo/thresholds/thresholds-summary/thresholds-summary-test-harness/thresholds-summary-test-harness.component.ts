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

import { Component, OnInit } from "@angular/core";
import moment from "moment/moment";

import { ISimpleThresholdZone } from "@nova-ui/charts";

@Component({
    selector: "nui-thresholds-summary-test-harness",
    templateUrl: "./thresholds-summary-test-harness.component.html",
})
export class ThresholdsSummaryTestHarnessComponent implements OnInit {
    public data = {
        "series-1": [10, 30, 70, 30, 10],
        "series-2": [0, 40, 60, 40, 0],
    };
    public zones: ISimpleThresholdZone[] = [
        { status: "error", start: 50 },
        { status: "warning", start: 20, end: 50 },
    ];
    public startDate = moment([2016, 11, 25, 15, 14, 29]); // "2016-12-25T15:14:29.000Z"

    public ngOnInit(): void {}

    public dataChanged(value: string): void {
        this.data = this.validateInput(value) || this.data;
    }

    public zonesChanged(value: string): void {
        this.zones = this.validateInput(value) || this.zones;
    }

    private validateInput(value: string) {
        let validatedInput: any;
        try {
            validatedInput = JSON.parse(value);
        } catch {}
        return validatedInput;
    }
}
