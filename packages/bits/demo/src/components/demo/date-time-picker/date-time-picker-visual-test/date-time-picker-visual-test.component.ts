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

import { Component, Inject, TemplateRef } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { DialogService } from "@nova-ui/bits";

@Component({
    selector: "nui-date-time-picker-visual-test",
    templateUrl: "./date-time-picker-visual-test.component.html",
})
export class DateTimePickerVisualTestComponent {
    public dt: Moment = moment("2018-02-02");
    public minDate: Moment = this.dt.clone().date(1);
    public maxDate: Moment = this.dt.clone().date(20);

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public open(content: TemplateRef<string>) {
        this.dialogService.open(content, { size: "sm" });
    }
}
