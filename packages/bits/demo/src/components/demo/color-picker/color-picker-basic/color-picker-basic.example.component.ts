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
import {
    FormBuilder,
    FormControl,
    FormGroup,
} from "@angular/forms";

const CHART_PALETTE_CS1: string[] = [
    "var(--nui-color-bg-secondary)",
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-ten)",
];

@Component({
    selector: "nui-color-picker-basic-example",
    templateUrl: "./color-picker-basic.example.component.html",
    styles: [],
    standalone: false,
})
export class ColorPickerBasicExampleComponent implements OnInit {
    public myForm: FormGroup<{ backgroundColor: FormControl<string | null> }>;
    public colors: string[] = CHART_PALETTE_CS1;
    
    constructor(
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            backgroundColor: [this.colors[0]],
        });
    }
}
