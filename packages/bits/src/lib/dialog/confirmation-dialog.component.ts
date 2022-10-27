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

import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { NuiActiveDialog } from "./dialog-ref";
import { ConfirmationDialogButtons, SeverityLevels } from "./public-api";

/**
 * @ignore
 */
@Component({
    selector: "nui-confirmation-dialog-window",
    templateUrl: "./confirmation-dialog.component.html",
    host: {
        role: "dialog",
        "[attr.aria-label]": "getAriaLabel()",
    },
})
export class ConfirmationDialogComponent {
    @Input()
    public title: string = $localize`Confirmation`;

    @Input()
    public message: string;

    @Input()
    public confirmText: string = $localize`Yes`;

    @Input()
    public dismissText: string = $localize`No`;

    @Input()
    public setFocus: ConfirmationDialogButtons = "confirm";

    @Input()
    public severity: SeverityLevels;

    @Input()
    public ariaLabel: string = "";

    constructor(
        private activeDialog: NuiActiveDialog,
        private changeDetector: ChangeDetectorRef
    ) {}

    public updateInputs() {
        this.changeDetector.detectChanges();
    }

    public close(result: boolean) {
        this.activeDialog.close(result);
    }

    public dismiss() {
        this.activeDialog.dismiss();
    }

    public focusButton(buttonType: ConfirmationDialogButtons): boolean {
        return this.setFocus === buttonType ? true : false;
    }

    public getAriaLabel() {
        return (
            (this.severity ? `${this.severity} ${this.title}` : this.title) ||
            this.ariaLabel
        );
    }
}
