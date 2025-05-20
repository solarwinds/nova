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
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

interface IExampleItem {
    id: string;
    name: string;
}

@Component({
    selector: "nui-combobox-v2-custom-typeahead-example",
    templateUrl: "combobox-v2-custom-typeahead.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2CustomTypeaheadExampleComponent {
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) => ({
        id: `value-${i}`,
        name: $localize`Item ${i}`,
    }));

    public comboboxControl = new FormControl<string | null>(null);

    // Use this in the template with async pipe to dynamically render the filtered items
    public filteredItems$: Subject<any[]> = new Subject<any[]>();

    public onValueChange(value: any): void {
        // Please be aware that there is a known issue (NUI-6131) which results in the
        // entire set of items appearing in the filtering results on input value set and change

        // Once the combobox input changes the new value is emitted.
        // Use this value to filter out the array of items
        value
            ? this.filteredItems$.next(this.filterItems(String(value)))
            : this.filteredItems$.next(this.items.slice());
    }

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    // For the sake of the example, the filtering is quite simple.
    // It filters out the combobox items depending on the user input.
    private filterItems(value: string): IExampleItem[] {
        const filterValue = value.toLowerCase();

        return this.items.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }
}
