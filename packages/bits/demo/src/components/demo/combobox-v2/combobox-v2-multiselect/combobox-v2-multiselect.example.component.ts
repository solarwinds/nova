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

import { Component, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
    selector: "nui-combobox-v2-multiselect-example",
    templateUrl: "combobox-v2-multiselect.example.component.html",
    styleUrls: ["combobox-v2-multiselect.example.component.less"],
    host: { class: "combobox-container" },
    standalone: false,
})
export class ComboboxV2MultiselectExampleComponent implements OnDestroy {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl<string[] | null>(null);
    public placeholder: string = $localize`Select Item`;

    private readonly destroy$ = new Subject<void>();

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public convertToChip(value: string): { label: string } {
        return { label: value };
    }

    public setModel(): void {
        this.comboboxControl.setValue([
            $localize`Item 10`,
            $localize`Item 12`,
            $localize`Item 14`,
        ]);
    }
}
