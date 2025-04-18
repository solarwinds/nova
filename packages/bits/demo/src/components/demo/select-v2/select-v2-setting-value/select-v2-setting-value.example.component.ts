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
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NuiSelectV2Module } from "../../../../../../src/lib/select-v2/select-v2.module";
import { NgFor } from "@angular/common";

@Component({
    selector: "nui-select-v2-setting-value-example",
    templateUrl: "select-v2-setting-value.example.component.html",
    host: { class: "select-container" },
    imports: [NuiSelectV2Module, NgFor, FormsModule, ReactiveFormsModule]
})
export class SelectV2SettingValueExampleComponent implements OnInit {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public selectControl = new FormControl<string | null>(null);

    public ngOnInit(): void {
        this.selectControl.setValue(this.items[1]);
    }
}
