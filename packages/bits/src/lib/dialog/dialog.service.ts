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

import { ComponentFactoryResolver, Injectable, Injector } from "@angular/core";
import assign from "lodash/assign";
import defaults from "lodash/defaults";
import pick from "lodash/pick";
import { Subject } from "rxjs";

import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { NuiDialogRef } from "./dialog-ref";
import { DialogStackService } from "./dialog-stack.service";
import { IConfirmationDialogOptions, IDialogOptions } from "./public-api";

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class DialogService {
    constructor(
        private moduleCFR: ComponentFactoryResolver,
        private injector: Injector,
        private dialogStack: DialogStackService
    ) {}

    public afterOpened$: Subject<NuiDialogRef> = new Subject<NuiDialogRef>();

    public open(content: any, options: IDialogOptions = {}): NuiDialogRef {
        const dialog = this.dialogStack.open(
            this.moduleCFR,
            this.injector,
            content,
            options
        );
        this.afterOpened$.next(dialog);

        return dialog;
    }

    public confirm(options: IConfirmationDialogOptions): NuiDialogRef {
        const dialog = this.dialogStack.open(
            this.moduleCFR,
            this.injector,
            ConfirmationDialogComponent,
            options
        );
        const component: ConfirmationDialogComponent = dialog.componentInstance;

        const optionsWithDefaults = defaults(
            options,
            pick(component, ["title", "confirmText", "dismissText"])
        );
        assign(component, optionsWithDefaults);

        component.updateInputs();
        this.afterOpened$.next(dialog);

        return dialog;
    }
}
