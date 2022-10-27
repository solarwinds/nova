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

import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

/**
 * Checks whether given form has a field that should be visually marked as invalid.
 * Form is not in an error state if it's untouched even if it's invalid at that moment,
 * a user must first interact with the form before it can be considered as invalid.
 * 'invalid' form property should not be used for the purpose of this function,
 * it can be affected by its children form statuses, which can be considered as valid (untouched).
 *
 * @param parent
 */
export function hasControlInErrorState(parent: AbstractControl): boolean {
    // FormGroup/FormArray/FormControl is not in an error state if it's either valid or untouched
    if (parent.valid || parent.untouched) {
        return false;
    }

    // FormGroup is considred valid if every child form is either valid or untouched
    if (parent instanceof FormGroup) {
        for (const key of Object.keys(parent.controls)) {
            const control = parent.controls[key];

            if (hasControlInErrorState(control)) {
                return true;
            }
        }
    }

    // FormArray is considred valid if every child form is either valid or untouched
    if (parent instanceof FormArray) {
        for (let i = 0; i < parent.length; i++) {
            const control = parent.at(i);

            if (hasControlInErrorState(control)) {
                return true;
            }
        }
    }

    // Errors property contains only errors related to the currecnt form and it's not affected by any child forms
    return (parent.touched || parent.dirty) && !!parent.errors;
}
