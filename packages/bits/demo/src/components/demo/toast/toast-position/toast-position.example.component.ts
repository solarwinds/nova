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
    selector: "nui-toast-position-example",
    templateUrl: "./toast-position.example.component.html",
})
export class ToastPositionExampleComponent implements OnInit {
    public toastPositions = [
        {
            displayValue: $localize`Top Right`,
            className: ToastPositionClass.TOP_RIGHT,
        },
        {
            displayValue: $localize`Top Left`,
            className: ToastPositionClass.TOP_LEFT,
        },
        {
            displayValue: $localize`Bottom Right`,
            className: ToastPositionClass.BOTTOM_RIGHT,
        },
        {
            displayValue: $localize`Bottom Left`,
            className: ToastPositionClass.BOTTOM_LEFT,
        },
        {
            displayValue: $localize`Top Full Width`,
            className: ToastPositionClass.TOP_FULL_WIDTH,
        },
        {
            displayValue: $localize`Bottom Full Width`,
            className: ToastPositionClass.BOTTOM_FULL_WIDTH,
        },
        {
            displayValue: $localize`Top Center`,
            className: ToastPositionClass.TOP_CENTER,
        },
        {
            displayValue: $localize`Bottom Center`,
            className: ToastPositionClass.BOTTOM_CENTER,
        },
        {
            displayValue: $localize`CUSTOM CLASS (top: 200px; right: 200px)`,
            className: "demoToastCustomClass",
        },
    ];
    public selectedPosition: ToastPositionClass | string =
        this.toastPositions[0].className;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize`Position Example`,
            message: this.selectedPosition,
            options: this.getOptions(),
        });
    }

    private getOptions(): IToastConfig {
        return {
            timeOut: 5000,
            extendedTimeOut: 2000,
            positionClass: this.selectedPosition,
        };
    }
}
