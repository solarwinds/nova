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

import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";

import { removeErrors } from "./remove-errors";

describe("removeErrors > ", () => {
    let form: FormGroup;

    beforeEach(() => {
        form = new FormBuilder().group({
            testControl: "",
        });
    });

    it("should remove only the specified error", () => {
        const control: AbstractControl | null = form.get("testControl");

        if (!control) {
            throw new Error("testControl field is not defined");
        }

        control.setErrors({
            error1: true,
            error2: true,
        });
        removeErrors(control, "error1");
        expect(control.errors).toEqual({ error2: true });
    });

    it("should remove all", () => {
        const control: AbstractControl | null = form.get("testControl");

        if (!control) {
            throw new Error("testControl field is not defined");
        }

        control.setErrors({
            error1: true,
            error2: true,
        });
        removeErrors(control, "error1", "error2");
        expect(control.errors).toEqual(null);
    });

    it("should not throw if there are no errors to remove", () => {
        const control = form.get("testControl");
        if (!control) {
            throw new Error("testControl field is not defined");
        }
        expect(() => removeErrors(control, "error1", "error2")).not.toThrow();
    });
});
