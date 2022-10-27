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
    selector: "nui-toast-visual",
    templateUrl: "./toast-visual-test.component.html",
})
export class ToastVisualTestComponent implements OnInit {
    private errorMessage: string = `Something went wrong + in addition there is an extremely
    long line that verifies that the toast expands as more text comes into it. More or less text -
    Toast messages must look good either way!`;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig({}, "id");
    }

    public showToastsAllPositions(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false
    ): void {
        this.onShowInfo(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_LEFT
        );
        this.onShowError(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            "Error",
            this.errorMessage
        );
        this.onShowSuccess(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.BOTTOM_LEFT
        );
        this.onShowWarning(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.BOTTOM_RIGHT
        );
        this.onShowInfo(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_CENTER
        );
        this.onShowError(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.BOTTOM_CENTER
        );
    }

    public showToastsFullWidth(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false
    ) {
        this.onShowSuccess(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_FULL_WIDTH
        );
        this.onShowWarning(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.BOTTOM_FULL_WIDTH
        );
    }

    public showToastsAdjustSize(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false
    ): void {
        this.onShowInfo(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT
        );
        this.onShowSuccess(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT
        );
        this.onShowWarning(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT
        );
        this.onShowError(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            "Error",
            this.errorMessage
        );
    }

    public showToastsNoHeader(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false,
        header: string = ""
    ): void {
        this.onShowInfo(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            header
        );
        this.onShowSuccess(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            header
        );
        this.onShowWarning(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            header
        );
        this.onShowError(
            highlightMode,
            timeout,
            progress,
            ToastPositionClass.TOP_RIGHT,
            header
        );
    }

    public onShowInfo(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false,
        position: ToastPositionClass,
        title: string = "Information",
        message: string = "Some info message"
    ): void {
        this.toastService.info({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    public onShowError(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false,
        position: ToastPositionClass,
        title: string = "Failure!",
        message: string = "Something went wrong"
    ): void {
        this.toastService.error({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    public onShowSuccess(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false,
        position: ToastPositionClass,
        title: string = "Well Done!",
        message: string = "You're great!"
    ): void {
        this.toastService.success({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    public onShowWarning(
        highlightMode: boolean,
        timeout: number,
        progress: boolean = false,
        position: ToastPositionClass,
        title: string = "Attention!",
        message: string = "Pay attention!"
    ): void {
        this.toastService.warning({
            title: title,
            message: `${message}`,
            options: this.getOptions(timeout, position, progress),
        });
    }

    public callStickyToast(highlightMode: boolean) {
        this.toastService.error({
            title: "Failure",
            message: "This error is sticky!",
            options: { stickyError: true },
        });
    }

    public clearToast(highlightMode: boolean): void {
        this.toastService.clear();
    }

    private getOptions(
        timeout: number,
        position: ToastPositionClass,
        enableProgressBar: boolean = false
    ): IToastConfig {
        return {
            timeOut: timeout,
            extendedTimeOut: 2000,
            positionClass: position,
            progressBar: enableProgressBar,
        };
    }
}
