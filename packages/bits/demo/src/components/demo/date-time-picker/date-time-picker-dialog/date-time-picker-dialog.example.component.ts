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
import { NuiDialogModule } from "../../../../../../src/lib/dialog/dialog.module";
import { NuiDateTimePickerModule } from "../../../../../../src/lib/date-time-picker/date-time-picker.module";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";

@Component({
    selector: "nui-date-time-picker-dialog-example",
    templateUrl: "./date-time-picker-dialog.example.component.html",
    imports: [NuiDialogModule, NuiDateTimePickerModule, NuiButtonModule]
})
export class DateTimePickerDialogExampleComponent {
    public dt: Moment;
    public selectedDate: Date;

    constructor(@Inject(DialogService) private dialogService: DialogService) {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    public open(content: TemplateRef<string>): void {
        this.dialogService.open(content, { size: "sm" });
    }

    public onModelChanged(event: any): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
