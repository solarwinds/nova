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

import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { combineLatest, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { hasControlInErrorState } from "../functions/has-control-in-error-state";

@Pipe({
    name: "nuiFormHeaderIconPipe",
    pure: false,
})
export class FormHeaderIconPipePipe implements PipeTransform {
    public static readonly ERROR_ICON_DEFAULT = "status_critical";

    transform(
        form: FormGroup | AbstractControl | null,
        defaultIcon: string,
        errorIcon: string = FormHeaderIconPipePipe.ERROR_ICON_DEFAULT
    ): Observable<string | null> {
        if (!form) {
            throw new Error("Provided form is undefined");
        }
        return combineLatest([form.statusChanges, form.valueChanges]).pipe(
            startWith(null),
            map(() => (hasControlInErrorState(form) ? errorIcon : defaultIcon))
        );
    }
}
