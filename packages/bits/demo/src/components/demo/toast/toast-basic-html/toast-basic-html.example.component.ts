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

import { IToastService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-basic-html-example",
    templateUrl: "./toast-basic-html.example.component.html",
})
export class ToastBasicHtmlExampleComponent implements OnInit {
    constructor(@Inject(ToastService) private toastService: IToastService) {}

    ngOnInit() {
        this.toastService.setConfig(
            { timeOut: 5000, extendedTimeOut: 2000 },
            "id"
        );
    }

    public showToastWithEnabledHtml(): void {
        this.toastService.info({
            title: $localize`Toast with enableHtml set to true`,
            message: $localize`Hi there! I'm a simple toast message. <a href="#">Awesome link</a>`,
            options: {
                enableHtml: true, // Note: Default value
            },
        });
    }

    public showToastWithDisabledHtml(): void {
        this.toastService.info({
            title: $localize`Toast with enableHtml set to false`,
            message: $localize`Hi there! I'm a simple toast message <a href="#">Awesome link</a>`,
            options: {
                enableHtml: false,
            },
        });
    }

    public showToastWithScriptTagIncluded(): void {
        this.toastService.info({
            title: $localize`Toast with forbidden tags and enableHtml set to true`,
            message: $localize`
                Hi there! I'm a toast message with forbidden tags:
                <script>alert("You shall not pass")</script>
                <object width="400" height="400"></object>
                <iframe src="https://www.solarwinds.com/"></iframe>
                <embed src="https://www.solarwinds.com/">
                `,
            options: {
                enableHtml: true, // Note: Default value
            },
        });
    }
}
