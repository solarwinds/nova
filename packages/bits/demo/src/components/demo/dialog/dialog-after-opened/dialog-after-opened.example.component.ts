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

import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

import { DialogContentExampleComponent } from "../component-as-content/dialog-content.example.component";

@Component({
    selector: "nui-dialog-after-opened-example",
    templateUrl: "./dialog-after-opened.example.component.html",
})
export class DialogAfterOpenedExampleComponent implements OnInit, OnDestroy {
    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public destroy$$: Subject<void> = new Subject<void>();

    public ngOnInit(): void {
        this.dialogService.afterOpened$
            .pipe(takeUntil(this.destroy$$))
            .subscribe((dialog: NuiDialogRef) => {
                if (dialog.componentInstance) {
                    this.toastService.info({
                        message: `${dialog.componentInstance.constructor.name} was opened`,
                    });
                }
            });
    }

    public ngOnDestroy(): void {
        this.destroy$$.next();
        this.destroy$$.complete();
    }

    public openConfirmationDialog(): void {
        this.dialogService.confirm({
            message: $localize`Are you sure you want to do it?`,
            severity: "info",
            setFocus: "confirm",
            title: "Confirmation dialog",
        });
    }

    public openWithComponent(): void {
        const dialogRef = this.dialogService.open(
            DialogContentExampleComponent,
            { size: "sm" }
        );
        dialogRef.componentInstance.name = $localize`Dialog title`;
    }
}
