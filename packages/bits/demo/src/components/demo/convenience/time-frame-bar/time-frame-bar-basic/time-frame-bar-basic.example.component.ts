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
import moment, { Moment } from "moment/moment";

import { ITimeframe } from "@nova-ui/bits";
import { NuiTimeFrameBarModule } from "../../../../../../../src/lib/convenience/time-frame-bar/time-frame-bar.module";
import { NuiIconModule } from "../../../../../../../src/lib/icon/icon.module";
import { NuiTimeFramePickerModule } from "../../../../../../../src/lib/time-frame-picker/time-frame-picker.module";
import { JsonPipe } from "@angular/common";

@Component({
    selector: "nui-convenience-time-frame-bar-basic-example",
    templateUrl: "./time-frame-bar-basic.example.component.html",
    imports: [NuiTimeFrameBarModule, NuiIconModule, NuiTimeFramePickerModule, JsonPipe]
})
export class TimeFrameBarBasicExampleComponent implements OnInit {
    public minDate: Moment;
    public maxDate: Moment;
    public timeFrame: ITimeframe;

    private baseDate = moment([2018, 5, 1, 15, 0, 0]);

    public ngOnInit(): void {
        // Set the minimum and maximum selectable dates (optional)
        this.minDate = this.baseDate.clone().subtract(1, "months");
        this.maxDate = moment();

        // Set the initial time frame
        this.timeFrame = {
            startDatetime: this.baseDate.clone().subtract(1, "weeks"),
            endDatetime: this.baseDate.clone(),
        };
    }
}
