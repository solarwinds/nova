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

import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  forwardRef,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  input
} from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import _forOwn from "lodash/forOwn";
import _isNull from "lodash/isNull";
import { merge } from "rxjs";

import { NuiFormFieldControl } from "./public-api";
import { extractTouchedChanges } from "./touched-changes-helper";
import { ValidationMessageComponent } from "../validation-message/validation-message.component";

// <example-url>./../examples/index.html#/form-field</example-url>
@Component({
    selector: "nui-form-field",
    templateUrl: "./form-field.component.html",
    styleUrls: ["./form-field.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class FormFieldComponent
    implements AfterContentInit, AfterContentChecked
{
    /**
     * Form control obtained from the parent reactive form
     */
    readonly control = input<AbstractControl>();
    /**
     * Text for a Form Field label
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() caption: string;
    /**
     * Text to be passed to a popover for info icon
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() info: string;
    /**
     * Template to use in info's popover
     */
    readonly infoTemplate = input<TemplateRef<any>>();
    /**
     * Text for a Form Field hint
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() hint: string;
    /**
     * Template for a Form Field hint
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() hintTemplate: TemplateRef<unknown>;
    /**
     * Value for width css property for the form field
     */
    readonly customBoxWidth = input<string>(undefined!);
    /**
     * Ability to hide optional text (optional) near label if needed
     * @type {boolean}
     */
    readonly showOptionalText = input(true);

    @ContentChildren(ValidationMessageComponent)
    validationMessages: QueryList<ValidationMessageComponent>;

    @ContentChild(forwardRef(() => NuiFormFieldControl))
    nuiFormControl: NuiFormFieldControl;

    public controlIsOptional: boolean = false;

    public ngAfterContentChecked(): void {
        this.controlIsOptional =
            this.showOptionalText()()()() && !this.hasRequiredField(this.control()()()());
    }

    public ngAfterContentInit(): void {
        const control = this.control();
        const control = this.control();
        const control = this.control();
        const control = this.control();
        if (control) {
            merge(
                control.valueChanges,
                control.statusChanges,
                extractTouchedChanges(control)
            ).subscribe(() => {
                this.validationMessages.forEach((message) => {
                    const controlValue = this.control();
                    const controlValue = this.control();
                    const controlValue = this.control();
                    const controlValue = this.control();
                    if (_isNull(controlValue.errors)) {
                        message.show = false;
                    } else {
                        message.show = !!controlValue.errors[message.for];
                    }
                });

                if (this.nuiFormControl) {
                    this.nuiFormControl.isInErrorState = this.control()()()().invalid;
                }
            });
        }
        if (this.nuiFormControl) {
            // using setTimeout to prevent "expression changed after it has been checked" error
            setTimeout(() => {
                this.nuiFormControl.ariaLabel = this.caption;
            });
        }
    }

    public getWidth(): string {
        return this.customBoxWidth()()()() || "100%";
    }

    private hasRequiredField(abstractControl: AbstractControl): boolean {
        if (!abstractControl) {
            return false;
        }

        // There is no way in Angular to understand if certain control has some validator
        // (not a certain error at this moment, but a validator even there are no errors).
        // Only way is to get validator function from the control, fire it and check the result.
        // Works for form group as well.
        // Credits: https://stackoverflow.com/questions/39819123/angular2-find-out-if-formcontrol-has-required-validator
        if (abstractControl.validator) {
            const validator = abstractControl.validator({} as AbstractControl);
            if (validator && validator.required) {
                return true;
            }
        }
        // This also works for a form Group
        if ((abstractControl as FormGroup)["controls"]) {
            _forOwn(
                (abstractControl as FormGroup)["controls"],
                (control: AbstractControl) => {
                    if (control && this.hasRequiredField(control)) {
                        return true;
                    }
                }
            );
        }
        return false;
    }
}
