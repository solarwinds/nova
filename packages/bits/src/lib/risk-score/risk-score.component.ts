// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";

/**
 * Component for displaying risk level from severity 'OK' to 'Critical'
 */
@Component({
    selector: "nui-risk-score",
    host: {
        class: "nui-risk-score",
    },
    templateUrl: "./risk-score.component.html",
    styleUrls: ["./risk-score.component.less"],
    encapsulation: ViewEncapsulation.None,
})

// <example-url>./../examples/index.html#/risk-score</example-url>
export class RiskScoreComponent implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild("colorLine") private colorLine!: ElementRef;

    @Input()
    public level: number = 0;

    @Input()
    public minLevel: number = 0;

    @Input()
    public maxLevel: number = 100;

    @Input()
    public title?: string;

    public floatOffset: number = 0;

    private resizeObserver: ResizeObserver;
    private colorLineWidth$: BehaviorSubject<number>;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        this.colorLineWidth$ = new BehaviorSubject<number>(0);
        this.resizeObserver = new ResizeObserver((entries) =>
            this.colorLineWidth$.next(entries[0].contentRect.width)
        );
    }

    public ngAfterViewInit(): void {
        this.colorLineWidth$.subscribe(this.updateOffset.bind(this));

        if (this.colorLine === undefined) {
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver.observe(this.colorLine.nativeElement);
        });
        this.colorLineWidth$.next(this.colorLine.nativeElement.offsetWidth);
    }

    public ngOnDestroy(): void {
        if (this.resizeObserver !== undefined && this.colorLine !== undefined) {
            this.resizeObserver.unobserve(this.colorLine.nativeElement);
            this.resizeObserver.disconnect();
        }

        this.colorLineWidth$.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.updateOffset(this.colorLineWidth$.getValue());
    }

    private updateOffset(width: number): void {
        if (this.minLevel >= this.maxLevel) {
            console.error("RiskScoreComponent - minLevel >= maxLevel");
            return;
        }

        const level = this.clamp(this.level, this.minLevel, this.maxLevel);

        const scaleInterval = this.maxLevel - this.minLevel;
        const widthPerOneLevel = width / scaleInterval;
        this.floatOffset = widthPerOneLevel * (level - this.minLevel);

        this.changeDetectorRef.detectChanges();
    }

    private clamp(a: number, min: number = 0, max: number = 1): number {
        return Math.min(max, Math.max(min, a));
    }
}
