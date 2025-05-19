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

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    Component,
    HostListener,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { delay, filter, takeUntil, tap } from "rxjs/operators";

import { ComboboxV2Component } from "@nova-ui/bits";

const defaultContainerHeight: number = 300;

@Component({
    selector: "nui-combobox-v2-virtual-scroll-example",
    templateUrl: "combobox-v2-virtual-scroll.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2VirtualScrollExampleComponent
    implements OnDestroy, AfterViewInit
{
    public items = Array.from({ length: 100000 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl("");
    public filteredItems: Observable<any[]> = of([...this.items]);
    public containerHeight: number = defaultContainerHeight;

    private readonly destroy$ = new Subject<void>();
    private scrollOffset: number = 0;

    @ViewChild(CdkVirtualScrollViewport)
    private viewport: CdkVirtualScrollViewport;
    @ViewChild(ComboboxV2Component) private combobox: ComboboxV2Component;

    @HostListener("click")
    public handleClick(): void {
        if (this.viewport) {
            this.viewport.scrollToOffset(this.scrollOffset);
        }
    }

    public ngAfterViewInit(): void {
        this.combobox.valueSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.scrollOffset = this.viewport.measureScrollOffset();
            });

        this.combobox.valueChanged
            .pipe(
                filter((v) => v !== undefined),
                // eslint-disable-next-line import/no-deprecated
                tap(
                    (v) =>
                        (this.filteredItems = of(this.filterItems(v as string)))
                ),
                delay(0),
                // eslint-disable-next-line import/no-deprecated
                tap(this.calculateContainerHeight),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private filterItems(value: string): string[] {
        if (!value) {
            return this.items;
        }
        const filterValue = value?.toLowerCase();

        return this.items.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    private calculateContainerHeight = (): void => {
        if (
            this.combobox.inputValue &&
            this.viewport.measureRenderedContentSize() < defaultContainerHeight
        ) {
            this.containerHeight = this.viewport.measureRenderedContentSize();
            return;
        }
        this.containerHeight = defaultContainerHeight;
    };
}
