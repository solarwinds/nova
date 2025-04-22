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

import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { takeUntil, tap } from "rxjs/operators";

import { ComboboxV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-v2-getting-value-example",
    templateUrl: "combobox-v2-getting-value.example.component.html",
    host: { class: "combobox-container" },
    standalone: false,
})
export class ComboboxV2GettingValueExampleComponent implements AfterViewInit {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxValueSelectedValue: string;
    public comboboxValueChangedValue: string;

    @ViewChild("comboboxValueSelectedExample")
    private comboboxValueSelectedExample: ComboboxV2Component;
    @ViewChild("comboboxValueChangedExample")
    private comboboxValueChangedExample: ComboboxV2Component;
    private destroy$: Subject<any> = new Subject<any>();

    public ngAfterViewInit(): void {
        this.comboboxValueSelectedExample.valueSelected
            .pipe(
                // eslint-disable-next-line import/no-deprecated
                tap(
                    (value) =>
                        (this.comboboxValueSelectedValue = value as string)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.comboboxValueChangedExample.valueChanged
            .pipe(
                // eslint-disable-next-line import/no-deprecated
                tap(
                    (value) =>
                        (this.comboboxValueChangedValue = value as string)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }
}
