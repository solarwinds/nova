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

import { Component } from "@angular/core";

import { ToastService } from "@nova-ui/bits";

/* eslint-disable-next-line */
import { default as colors } from "../../../../src/styles/data/framework-colors-dark.json";

@Component({
    selector: "framework-colors-dark.example",
    styleUrls: ["./framework-colors-dark.example.component.less"],
    templateUrl: "./framework-colors-dark.example.component.html",
})
export class FrameworkColorsDarkExampleComponent {
    public colors = colors;
    constructor(private toastService: ToastService) {}

    public onClipboardSuccess() {
        this.toastService.success({
            message: $localize`Color successfully copied to clipboard`,
        });
    }

    public keyValueCompare(a: any, b: any) {
        return parseInt(a.key, 10) - parseInt(b.key, 10);
    }
}
