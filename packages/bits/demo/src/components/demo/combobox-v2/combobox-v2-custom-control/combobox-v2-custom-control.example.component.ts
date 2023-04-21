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

import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

import { ComboboxV2Component } from "@nova-ui/bits";

interface IExampleItem {
    id: string;
    name: string;
}

@Component({
    selector: "nui-combobox-v2-custom-control-example",
    templateUrl: "combobox-v2-custom-control.example.component.html",
    styleUrls: ["combobox-v2-custom-control.example.component.less"],
    host: { class: "combobox-container d-flex" },
})
export class ComboboxV2CustomControlExampleComponent
    implements OnDestroy, AfterViewInit
{
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl<string | null>(null);
    public placeholder: string = $localize`Select Item`;
    public handleClicksOutside: boolean = false;

    @ViewChild("combobox") public combobox: ComboboxV2Component;

    private readonly destroy$ = new Subject<void>();

    public ngAfterViewInit(): void {
        this.combobox.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) {
                this.combobox.hideDropdown();
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onChipRemoved(item: IExampleItem): void {
        this.combobox.deselectItem(item);
    }

    public convertToChip(value: IExampleItem): { label: IExampleItem } {
        return { label: value };
    }

    public showList(event: Event): void {
        event.stopPropagation();
        this.combobox.showDropdown();
        this.combobox.inputElement.nativeElement.focus();
    }

    public hideList(event: Event): void {
        event.stopPropagation();
        this.combobox.hideDropdown();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.combobox.toggleDropdown();
        this.combobox.inputElement.nativeElement.focus();
    }
}
