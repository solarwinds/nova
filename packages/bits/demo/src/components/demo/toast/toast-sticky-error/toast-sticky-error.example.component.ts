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

import { Component, Inject, OnInit } from "@angular/core";

import {
    IToastConfig,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-sticky-error-example",
    templateUrl: "./toast-sticky-error.example.component.html",
})
export class ToastStickyErrorExampleComponent implements OnInit {
    public selectedPosition: string;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowStickyError(highlightMode: boolean): void {
        this.toastService.error({
            title: $localize`Sticky Error`,
            message: $localize`Red Alert`,
            options: this.getOptions(),
        });
    }

    public onHideStickyError(highlightMode: boolean): void {
        this.toastService.clear();
    }

    private getOptions(): IToastConfig {
        return {
            clickToDismiss: false,
            closeButton: false,
            positionClass: ToastPositionClass.TOP_RIGHT,
            stickyError: true,
        };
    }
}
