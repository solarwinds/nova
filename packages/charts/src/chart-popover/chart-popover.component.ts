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

import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { PopoverComponent } from "@nova-ui/bits";

import { IDataPointsPayload } from "../core/common/types";
import { ChartPopoverPlugin } from "../core/plugins/chart-popover-plugin";
import { IElementPosition } from "../core/plugins/types";

@Component({
    selector: "nui-chart-popover",
    templateUrl: "./chart-popover.component.html",
    styleUrls: ["./chart-popover.component.less"],
    standalone: false,
})
export class ChartPopoverComponent implements OnChanges, OnInit, OnDestroy {
    @Input() plugin: ChartPopoverPlugin;

    @Input() template: TemplateRef<any>;

    @Output() update = new EventEmitter<IDataPointsPayload>();

    @ViewChild(PopoverComponent) popover: PopoverComponent;

    private readonly destroy$ = new Subject<void>();
    private initPlugin$ = new Subject<void>();

    constructor(
        private changeDetector: ChangeDetectorRef,
        public element: ElementRef
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.plugin && !changes.plugin.isFirstChange()) {
            this.initPlugin();
        }
    }

    public ngOnInit(): void {
        this.initPlugin();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.initPlugin$.complete();
    }

    private initPlugin() {
        this.initPlugin$.next();

        this.plugin?.openPopoverSubject
            .pipe(takeUntil(this.initPlugin$), takeUntil(this.destroy$))
            .subscribe(() => {
                this.changeDetector.markForCheck();
            });

        this.plugin?.updatePositionSubject
            .pipe(takeUntil(this.initPlugin$), takeUntil(this.destroy$))
            .subscribe((position: IElementPosition) => {
                this.popover?.resetSize();
                // calculating a width offset to position the popover's host element at the midpoint of the popover target
                const widthOffset = position.width / 2;
                this.element.nativeElement.style.left =
                    position.left + widthOffset + "px";
                this.element.nativeElement.style.top = position.top + "px";
                this.popover?.updatePosition();
                this.update.next(this.plugin?.dataPoints);
            });
    }
}
