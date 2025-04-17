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

import { OverlayConfig } from "@angular/cdk/overlay";
import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    OverlayComponent,
    OVERLAY_WITH_POPUP_STYLES_CLASS,
} from "@nova-ui/bits";

@Component({
    selector: "nui-overlay-popup-styles-example",
    templateUrl: "./overlay-popup-styles.example.component.html",
    standalone: false
})
export class OverlayPopupStylesExampleComponent
    implements AfterViewInit, OnDestroy
{
    private readonly destroy$ = new Subject<void>();

    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
    };

    @ViewChild("overlayWithStyles") public overlayWithStyles: OverlayComponent;
    @ViewChild("overlayNoStyles") public overlayNoStyles: OverlayComponent;

    public ngAfterViewInit(): void {
        this.overlayWithStyles.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => this.overlayWithStyles.hide());

        this.overlayNoStyles.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => this.overlayNoStyles.hide());
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
