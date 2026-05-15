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

import { Component, TemplateRef } from "@angular/core";
import { take, takeUntil } from "rxjs/operators";

import { DialogService, NuiDialogEvent, NuiDialogRef } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-actions-before-closure-example",
    templateUrl: "./dialog-actions-before-closure.example.component.html",
    standalone: false,
})
export class DialogActionBeforeClosureExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) {}

    public open(content: TemplateRef<string>): void {
        // You can return 'false' from the optional beforeDismiss function anytime you want to prevent the dialog from closing.
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            beforeDismiss: this.beforeDismiss,
        });

        // You can use the beforeDismissed$ event to execute actions right before the dialog gets closed
        this.activeDialog.beforeDismissed$
            .pipe(
                // Be sure to unsubscribe on dialog closure
                takeUntil(this.activeDialog.closed$)
            )
            .subscribe((event) => {
                // A dialog will typically close in response to the escape key
                if (event === NuiDialogEvent.EscapeKey) {
                    console.log($localize`ESC CLOSED`);
                }
                // Covering the 'BACKDROP_CLICK' event in case of clearing the dialog by clicking the backdrop
                if (event === NuiDialogEvent.BackdropClick) {
                    console.log($localize`BACKDROP CLICK CLOSED`);
                    return;
                }
                // Here we cover the custom 'DONE' event which you can create and then capture within the 'beforeDismissed$' subscription
                // to run your custom logic in response to that event right before the dialog closure.  See 'actionDone' implementation below.
                if (event === "DONE") {
                    console.log($localize`DONE`);
                    return;
                }
                // Set of actions for all event origins before the dialog closes
                console.log($localize`BEFORE CLOSED`);
                // Manually close the dialog since the `beforeDismiss` implementation below short-circuits dismissal with its 'false' return value
                this.activeDialog.close();
            });

        // You can perform any required actions just after dialog closure here
        this.activeDialog.closed$.pipe(take(1)).subscribe(() => {
            console.log($localize`CLOSED`);
        });
    }

    public actionDone(): void {
        console.log($localize`ACTION DONE`);
        this.activeDialog.dismiss("DONE");
    }

    public actionCanceled(): void {
        console.log($localize`ACTION CANCELED`);
        this.activeDialog.dismiss();
    }

    public beforeDismiss(): boolean {
        return false;
    }

    public closeFromHeader(): void {
        console.log($localize`CLOSE BUTTON CLICKED`);
        this.activeDialog.dismiss();
    }
}
