import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import _isNil from "lodash/isNil";
import moment from "moment/moment";
import { Moment } from "moment/moment";

/**
 * Class that represents custom Nui validators
 */

/**
 * @ignore
 */
export class NuiValidators {
    /**
     * Validator that returns validation function and checks if value matches integer regex.
     * @param  unsigned
     * @returns
     */
    static integer(unsigned: boolean = false): ValidatorFn {
        const res = (control: AbstractControl): ValidationErrors | null => {
            const integerRegex: RegExp = unsigned ? /^(0|[1-9]\d*)$/ : /^\-?(0|[1-9]\d*)$/;
            const errorObject = {
                value: control.value,
                invalidInteger: "Invalid integer value",
            };
            const valid = integerRegex.test(control.value);
            return valid ? null : errorObject;
        };
        return res;
    }

    /**
     * Validator that returns date validation using Moment.isValid method.
     */
    static dateFormat(value: Moment): ValidationErrors | null {
        return (!_isNil(value) && moment.isMoment(value) && value.isValid())
            ? null
            : { invalidFormat: "The provided format is invalid" };
    }
}
