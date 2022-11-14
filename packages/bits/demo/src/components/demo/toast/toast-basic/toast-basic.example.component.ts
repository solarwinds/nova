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

import { IToastConfig, IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-basic-example",
    templateUrl: "./toast-basic.example.component.html",
})
export class ToastBasicExampleComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public ngOnInit(): void {
        this.toastService.setConfig({}, "id");
    }

    public onShowToast(highlightMode: boolean): void {
        this.toastService.info({
            title: $localize`Simple Toast.`,
            message: $localize`Hi there! I'm a simple toast message`,
            options: this.getOptions(),
        });
    }

    private getOptions(): IToastConfig {
        return {
            timeOut: 5000,
            extendedTimeOut: 2000,
        };
    }
}
