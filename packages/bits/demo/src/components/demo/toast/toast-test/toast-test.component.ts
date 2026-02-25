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
    IToastDeclaration,
    IToastService,
    ToastPositionClass,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-toast-test",
    templateUrl: "./toast-test.component.html",
    standalone: false,
})
export class ToastTestComponent implements OnInit {
    private toastService = inject<IToastService>(ToastService);


    private defaults: IToastDeclaration = {
        message: "",
        title: "",
        options: {
            timeOut: 5000,
            extendedTimeOut: 2000,
            closeButton: true,
            progressBar: true,
            progressAnimation: "decreasing",
            toastClass: "nui-toast",
            positionClass: ToastPositionClass.TOP_RIGHT,
            maxOpened: 0, // unlimited
            newestOnTop: true,
            enableHtml: false,
        },
    };
    // Using intersection type to avoid adding optional chaining operator (?) multiple times in template
    // because options property is optional.
    public toast: IToastDeclaration & { options: IToastConfig };
    public count: number;
    public type: string;

    public ngOnInit(): void {
        this.reset();
    }

    public fireToast(): void {
        const funcs: Record<
            string,
            (toast: IToastDeclaration) => IActiveToast
        > = {
            error: (toast) => this.toastService.error(toast),
            info: (toast) => this.toastService.info(toast),
            success: (toast) => this.toastService.success(toast),
            warning: (toast) => this.toastService.warning(toast),
        };

        for (let i = 0; i < this.count; i++) {
            funcs[this.type](this.toast);
        }
    }

    public reset(): void {
        this.count = 1;
        this.type = "info";
        this.toast = {
            ...this.defaults,
            options: { ...this.defaults.options },
        };
        this.toastService.clear();
    }
}
