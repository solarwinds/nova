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
    OnInit,
    ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { SelectV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-virtual-scroll-example",
    templateUrl: "select-v2-virtual-scroll.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2VirtualScrollExampleComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public icons: any[] = ["check", "email", "execute"];
    public items = Array.from({ length: 100000 }).map(
        (_, i) => $localize`Item ${i}`
    );

    public selectControl = new FormControl<string | null>(null);
    public containerHeight: number = 300;

    private readonly destroy$ = new Subject<void>();
    private scrollOffset: number = 0;

    @ViewChild(CdkVirtualScrollViewport)
    private viewport: CdkVirtualScrollViewport;
    @ViewChild(SelectV2Component) private select: SelectV2Component;

    @HostListener("click", ["$event"])
    public handleClick(event: MouseEvent): void {
        if (this.viewport) {
            this.viewport.scrollToOffset(this.scrollOffset);
        }
    }

    public ngOnInit(): void {
        this.selectControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                console.log("Value from Select", value);
            });
    }

    public ngAfterViewInit(): void {
        this.select.valueSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectionText) => {
                this.scrollOffset = this.viewport.measureScrollOffset();
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
