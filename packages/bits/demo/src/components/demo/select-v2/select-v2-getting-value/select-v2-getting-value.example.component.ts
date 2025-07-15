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

import { AfterViewInit, Component, viewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { SelectV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-getting-value-example",
    templateUrl: "select-v2-getting-value.example.component.html",
    host: { class: "select-container" },
    standalone: false,
})
export class SelectV2GettingValueExampleComponent implements AfterViewInit {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public selectValueSelectedValue: string;

    private readonly selectValueSelectedExample = viewChild.required<SelectV2Component>("selectValueSelectedExample");
    private destroy$: Subject<any> = new Subject<any>();

    public ngAfterViewInit(): void {
        this.selectValueSelectedExample().valueSelected
            .pipe(
                tap(
                    (value) => (this.selectValueSelectedValue = value as string)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }
}
