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

import { DialogService, NuiDialogRef } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-visual-test",
    templateUrl: "./dialog-visual-test.component.html",
})
export class DialogVisualTestComponent {
    public severity: string;
    private activeDialog: NuiDialogRef;
    public isResponsiveMode = false;
    public dataset = {
        items: [
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
            "Item 5",
            "Item 6",
            "Item 7",
            "Item 8",
            "Item 9",
            "Item 10",
            "Item 11",
            "Item 12",
            "Item 13",
            "Item 14",
            "Item 15",
            "Item 16",
            "Item 17",
            "Item 18",
            "Item 19",
            "Item 20",
        ],
    };

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public open(content: TemplateRef<string>, severity = ""): void {
        this.severity = severity;
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }

    public openSizes(content: TemplateRef<string>, size: any): void {
        this.activeDialog = this.dialogService.open(content, { size });
    }

    public openResponsive(content: TemplateRef<string>, options: any): void {
        this.isResponsiveMode = options.isResponsiveMode;
        this.activeDialog = this.dialogService.open(content);
    }

    public onButtonClick(): void {
        this.activeDialog.close();
    }

    public confirmationDefaults(): void {
        this.dialogService.confirm({
            message: "Should I do it?",
        });
    }

    public confirmationOverrides(): void {
        this.dialogService.confirm({
            message: "Are you sure you want to do it?",
            title: "Format hard drive",
            confirmText: "Format",
            dismissText: "No!",
            severity: "warning",
        });
    }
}
