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
import moment from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";

@Component({
    selector: "nui-time-frame-picker-inline",
    templateUrl: "./time-frame-picker-inline.example.component.html",
})
export class TimeFramePickerInlineExampleComponent {
    public tf: ITimeframe = {
        startDatetime: moment("04/09/2018", "L"),
        endDatetime: moment("04/10/2018", "L"),
        // @ts-ignore
        selectedPresetId: null,
    };

    public minDate = moment("04/07/2018", "L"); // "L" is "MM/DD/YYY" in moment.js
    public maxDate = moment();

    public updateTf(value: any): void {
        this.tf = value;
    }
}
