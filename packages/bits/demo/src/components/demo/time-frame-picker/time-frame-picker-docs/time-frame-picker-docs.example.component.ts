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
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { TimeFramePickerInlineExampleComponent } from "../time-frame-picker-inline/time-frame-picker-inline.example.component";
import { QuickPickerBasicExampleComponent } from "../quick-picker-basic/quick-picker-basic.example.component";
import { TimeFramePickerBasicExampleComponent } from "../time-frame-picker-basic/time-frame-picker-basic.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { TimeFramePickerDateExampleComponent } from "../time-frame-picker-date/time-frame-picker-date.example.component";
import { TimeFramePickerCustomExampleComponent } from "../time-frame-picker-custom/time-frame-picker-custom.example.component";
import { TimeFramePickerMultipleCustomPickersExampleComponent } from "../time-frame-picker-multiple-custom-pickers/time-frame-picker-multiple-custom-pickers.example.component";

@Component({
    selector: "nui-time-frame-picker-docs",
    templateUrl: "./time-frame-picker-docs.example.component.html",
    imports: [NuiDocsModule, TimeFramePickerInlineExampleComponent, QuickPickerBasicExampleComponent, TimeFramePickerBasicExampleComponent, NuiMessageModule, TimeFramePickerDateExampleComponent, TimeFramePickerCustomExampleComponent, TimeFramePickerMultipleCustomPickersExampleComponent]
})
export class TimeFramePickerDocsExampleComponent {}
