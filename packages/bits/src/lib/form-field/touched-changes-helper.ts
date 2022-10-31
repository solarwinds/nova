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
import { Observable, Subject } from "rxjs";

/**
 * Extract arguments of function
 */
export type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

/**
 * Creates an object like O. Optionally provide minimum set of properties P which the objects must share to conform
 */
type ObjectLike<O extends object, P extends keyof O = keyof O> = Pick<O, P>;

/*
 * Extract a touched changed observable from an abstract control
 * @param control AbstractControl like object with markAsTouched method
 */
export const extractTouchedChanges = (
    control: ObjectLike<AbstractControl, "markAsTouched" | "markAsUntouched">
): Observable<boolean> => {
    const prevMarkAsTouched = control.markAsTouched;
    const prevMarkAsUntouched = control.markAsUntouched;

    const touchedChanges$ = new Subject<boolean>();

    function nextMarkAsTouched(
        ...args: ArgumentsType<AbstractControl["markAsTouched"]>
    ) {
        touchedChanges$.next(true);
        prevMarkAsTouched.bind(control)(...args);
    }

    function nextMarkAsUntouched(
        ...args: ArgumentsType<AbstractControl["markAsUntouched"]>
    ) {
        touchedChanges$.next(false);
        prevMarkAsUntouched.bind(control)(...args);
    }

    control.markAsTouched = nextMarkAsTouched;
    control.markAsUntouched = nextMarkAsUntouched;

    return touchedChanges$;
};
