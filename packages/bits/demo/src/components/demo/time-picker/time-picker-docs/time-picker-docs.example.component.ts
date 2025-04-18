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
import { TimePickerBasicExampleComponent } from "../time-picker-basic/time-picker-basic.example.component";
import { TimePickerModelChangeExampleComponent } from "../time-picker-model-change/time-picker-model-change.example.component";
import { TimePickerPreserveInsignificantExampleComponent } from "../time-picker-preserve-isignificant/time-picker-preserve-insignificant.example.component";
import { TimePickerDisabledExampleComponent } from "../time-picker-disabled/time-picker-disabled.example.component";
import { TimePickerCustomFormatExampleComponent } from "../time-picker-custom-format/time-picker-custom-format.example.component";
import { TimePickerCustomStepExampleComponent } from "../time-picker-custom-step/time-picker-custom-step.example.component";
import { TimePickerReactiveFormExampleComponent } from "../time-picker-reactive-form/time-picker-reactive-form.example.component";

@Component({
    selector: "nui-time-picker-docs",
    templateUrl: "./time-picker-docs.example.component.html",
    imports: [NuiDocsModule, TimePickerBasicExampleComponent, TimePickerModelChangeExampleComponent, TimePickerPreserveInsignificantExampleComponent, TimePickerDisabledExampleComponent, TimePickerCustomFormatExampleComponent, TimePickerCustomStepExampleComponent, TimePickerReactiveFormExampleComponent]
})
export class TimePickerDocsExampleComponent {}
