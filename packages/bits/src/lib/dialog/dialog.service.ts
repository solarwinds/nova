import { ComponentFactoryResolver, Injectable, Injector } from "@angular/core";
import assign from "lodash/assign";
import defaults from "lodash/defaults";
import pick from "lodash/pick";

import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { NuiDialogRef } from "./dialog-ref";
import { DialogStackService } from "./dialog-stack.service";
import { IConfirmationDialogOptions, IDialogOptions } from "./public-api";

/**
 * @ignore
 */
@Injectable({providedIn: "root"})
export class DialogService {
    constructor(private moduleCFR: ComponentFactoryResolver, private injector: Injector,
                private dialogStack: DialogStackService) {
    }

    public open(content: any, options: IDialogOptions = {}): NuiDialogRef {
        return this.dialogStack.open(this.moduleCFR, this.injector, content, options);
    }

    public confirm(options: IConfirmationDialogOptions): NuiDialogRef {
        const dialog = this.dialogStack.open(this.moduleCFR, this.injector, ConfirmationDialogComponent, options);
        const component: ConfirmationDialogComponent = dialog.componentInstance;

        const optionsWithDefaults = defaults(options,
            pick(component, ["title", "confirmText", "dismissText"]));
        assign(component, optionsWithDefaults);

        component.updateInputs();

        return dialog;
    }
}
