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

import { AbstractControl, ValidatorFn } from "@angular/forms";
import _isNil from "lodash/isNil";

import { removeErrors } from "@nova-ui/bits";

export const thresholdsValidator: ValidatorFn = (form: AbstractControl) => {
    const critical = form.get("criticalThresholdValue");
    const warning = form.get("warningThresholdValue");
    const reverse = form.get("reversedThresholds");
    const show = form.get("showThresholds");

    if (!critical) {
        throw new Error("criticalThresholdValue formControl is not defined");
    }
    removeErrors(critical, "min", "max");

    if (!warning) {
        throw new Error("warningThresholdValue formControl is not defined");
    }
    removeErrors(warning, "min", "max");

    if (show?.value) {
        if (_isNil(warning.value)) {
            return null;
        }
        if (reverse?.value) {
            if (critical.value >= warning.value) {
                warning.setErrors({ min: true });
                critical.setErrors({ max: true });
                return { thresholds: true };
            }
        } else {
            if (critical.value <= warning.value) {
                warning.setErrors({ max: true });
                critical.setErrors({ min: true });
                return { thresholds: true };
            }
        }
    }

    return null;
};
