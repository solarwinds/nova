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

import { Component, Inject, TemplateRef } from "@angular/core";

import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";
import { NuiDialogModule } from "../../../../../../src/lib/dialog/dialog.module";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";

@Component({
    selector: "nui-dialog-with-static-backdrop-example",
    templateUrl: "./dialog-with-static-backdrop.example.component.html",
    imports: [NuiDialogModule, NuiButtonModule]
})
export class DialogWithStaticBackdropExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public openWith(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            backdrop: "static",
        });
    }
    public openWithout(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            keyboard: false,
            backdrop: "static",
        });
    }

    public actionDone(): void {
        this.toastService.success({
            message: $localize`Action Done!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }

    public actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Cancelled!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }
}
