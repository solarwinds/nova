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

import { AbstractControl } from "@angular/forms";

/**
 * This is the only way to be notified of the parent form control being "touched"
 * We replace the parent formControl method with our own implementation that also calls the original function
 * @param formControl
 * @param callback Run this callback when the `formControl.markAsTouched` is run
 */
export function onMarkAsTouched(
    formControl: AbstractControl,
    callback: Function
): void {
    const origFunc = formControl.markAsTouched;
    formControl.markAsTouched = () => {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        origFunc.apply(formControl, arguments);

        callback();
    };
}
