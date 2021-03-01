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
} from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import _forOwn from "lodash/forOwn";
import _isNull from "lodash/isNull";
import { merge } from "rxjs";

import { ValidationMessageComponent } from "../validation-message/validation-message.component";

import { NuiFormFieldControl } from "./public-api";
import { extractTouchedChanges } from "./touched-changes-helper";

// <example-url>./../examples/index.html#/form-field</example-url>
@Component({
    selector: "nui-form-field",
    templateUrl: "./form-field.component.html",
    styleUrls: ["./form-field.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent implements AfterContentInit, AfterContentChecked {
    /**
     * Form control obtained from the parent reactive form
     */
    @Input() control: AbstractControl;
    /**
     * Text for a Form Field label
     */
    @Input() caption: string;
    /**
     * Text to be passed to a popover for info icon
     */
    @Input() info: string;
    /**
     * Template to use in info's popover
     */
    @Input() infoTemplate: TemplateRef<any>;
    /**
     * Text for a Form Field hint
     */
    @Input() hint: string;
    /**
     * Template for a Form Field hint
     */
    @Input() hintTemplate: TemplateRef<unknown>;
    /**
     * Value for width css property for the form field
     */
    @Input() customBoxWidth: string;
    /**
     * Ability to hide optional text (optional) near label if needed
     * @type {boolean}
     */
    @Input() showOptionalText = true;

    @ContentChildren(ValidationMessageComponent) validationMessages: QueryList<ValidationMessageComponent>;

    @ContentChild(forwardRef(() => NuiFormFieldControl)) nuiFormControl: NuiFormFieldControl;

    public controlIsOptional: boolean = false;

    ngAfterContentChecked() {
        this.controlIsOptional = this.showOptionalText && !this.hasRequiredField(this.control);
    }

    public ngAfterContentInit() {
        if (this.control) {
            merge(this.control.valueChanges, this.control.statusChanges, extractTouchedChanges(this.control))
                .subscribe(
                    () => {
                        this.validationMessages.forEach(message => {
                            if (_isNull(this.control.errors)) {
                                message.show = false;
                            } else {
                                message.show = !!this.control.errors[message.for];
                            }
                        });

                        if (this.nuiFormControl) {
                            this.nuiFormControl.isInErrorState = this.control.invalid;
                        }
                    }
                );
        }
        if (this.nuiFormControl) {
            // using setTimeout to prevent "expression changed after it has been checked" error
            setTimeout(() => {
                this.nuiFormControl.ariaLabel = this.caption;
            });
        }
    }

    public getWidth() {
        return this.customBoxWidth || "100%";
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
            _forOwn((abstractControl as FormGroup)["controls"], (control: AbstractControl) => {
                if (control && this.hasRequiredField(control)) {
                    return true;
                }
            });
        }
        return false;
    }
}
