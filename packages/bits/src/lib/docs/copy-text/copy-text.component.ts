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

import { Component, Inject, Input } from "@angular/core";

import { IToastService } from "../../toast/public-api";
import { ToastService } from "../../toast/toast.service";

/** @ignore */
@Component({
    templateUrl: "./copy-text.component.html",
    selector: "nui-copy-text",
    styleUrls: ["./copy-text.component.less"],
    standalone: false
})
export class CopyTextComponent {
    // file to which the copy applies
    @Input()
    public fileContent: string;
    public copyTooltip = $localize`copy snippet to clipboard`;

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public onSnippetCopied(): void {
        this.toastService.info({
            message: $localize`Code snippet copied to clipboard`,
            options: {
                timeOut: 2000,
                extendedTimeOut: 1000,
            },
        });
    }
}
