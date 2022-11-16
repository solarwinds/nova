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
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy,
    Output,
} from "@angular/core";
import debounce from "lodash/debounce";

import { RESIZE_DEBOUNCE_TIME } from "../../../constants/resize.constants";

/**
 * @ignore
 */
@Directive({
    selector: "[nuiResizeObserver]",
})
export class ResizeObserverDirective implements OnDestroy, AfterViewInit {
    @Output()
    public containerResize = new EventEmitter();
    public resizeHandler: Function;
    private _debounceTime = RESIZE_DEBOUNCE_TIME;
    private resizeObserver?: ResizeObserver;

    constructor(private _element: ElementRef, private ngZone: NgZone) {}

    public set debounceTime(debounceTime: number) {
        this._debounceTime = debounceTime;
    }

    public ngAfterViewInit(): void {
        this.resizeHandler = debounce(
            (entry) => this.containerResize.emit(entry),
            this._debounceTime
        );
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry: ResizeObserverEntry) => {
                this.ngZone.run(() => {
                    this.resizeHandler(entry);
                });
            });
        });
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver?.observe(<Element>this._element.nativeElement);
        });
    }

    public ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(<Element>this._element.nativeElement);
        }
    }
}
