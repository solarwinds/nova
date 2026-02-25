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

import { Component, OnInit, inject } from "@angular/core";

import {
    IActiveToast,
    IToastConfig,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-events-example",
    templateUrl: "./toast-events.example.component.html",
    standalone: false,
})
export class ToastEventsExampleComponent implements OnInit {
    private toastService = inject<IToastService>(ToastService);

    public lastShown?: number;
    public clickCount = 0;
    public toastCount = 0;
    public isDisplayed: boolean;

    public ngOnInit(): void {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        const toastInstance: IActiveToast = this.toastService.info({
            title: $localize`Toast Events`,
            message: $localize`Click Me!`,
            options: this.getOptions(),
        });
        toastInstance.onShown?.subscribe(() => {
            ++this.toastCount;
            this.isDisplayed = true;
            this.lastShown = toastInstance.toastId;
        });

        toastInstance.onClick?.subscribe(() => {
            ++this.clickCount;
        });

        toastInstance.onHidden?.subscribe(() => {
            --this.toastCount;
            this.isDisplayed = this.toastCount > 0;
        });
    }

    private getOptions(): IToastConfig {
        return {
            extendedTimeOut: 5000,
            clickToDismiss: false,
            closeButton: false,
            positionClass: ToastPositionClass.TOP_RIGHT,
            progressBar: true,
            progressAnimation: "increasing",
            timeOut: 10000,
        };
    }
}
