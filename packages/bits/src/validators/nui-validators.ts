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
            const integerRegex: RegExp = unsigned
                ? /^(0|[1-9]\d*)$/
                : /^\-?(0|[1-9]\d*)$/;
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
        return !_isNil(value) && moment.isMoment(value) && value.isValid()
            ? null
            : { invalidFormat: "The provided format is invalid" };
    }
}
