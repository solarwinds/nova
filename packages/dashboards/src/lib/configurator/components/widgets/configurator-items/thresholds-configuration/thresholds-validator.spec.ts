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
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";

import { thresholdsValidator } from "./thresholds-validator";

describe("thresholdsValidator > ", () => {
    let form: FormGroup;
    let warningControl: AbstractControl | null;
    let criticalControl: AbstractControl | null;
    let showThresholdsControl: AbstractControl | null;
    let reversedThresholds: AbstractControl | null;

    beforeEach(() => {
        form = new FormBuilder().group({
            criticalThresholdValue: [30, [Validators.required]],
            warningThresholdValue: [20, [Validators.required]],
            showThresholds: [true, [Validators.required]],
            reversedThresholds: [false],
        });

        warningControl = form.get("warningThresholdValue");
        criticalControl = form.get("criticalThresholdValue");
        showThresholdsControl = form.get("showThresholds");
        reversedThresholds = form.get("reversedThresholds");
    });

    it("should not set any errors when the form is valid", () => {
        warningControl?.setValue(20);
        criticalControl?.setValue(30);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual(null);
        expect(criticalControl?.errors).toEqual(null);
    });

    it("should not set any errors when showThresholds is false", () => {
        warningControl?.setValue(40);
        criticalControl?.setValue(30);
        reversedThresholds?.setValue(false);
        showThresholdsControl?.setValue(false);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual(null);
        expect(criticalControl?.errors).toEqual(null);
    });

    it("should set the correct error status for each control when reversedThresholds is false", () => {
        warningControl?.setValue(30);
        criticalControl?.setValue(20);
        reversedThresholds?.setValue(false);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual({ max: true });
        expect(criticalControl?.errors).toEqual({ min: true });
    });

    it("should set the correct error status for each control when reversedThresholds is true", () => {
        warningControl?.setValue(20);
        criticalControl?.setValue(30);
        reversedThresholds?.setValue(true);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual({ min: true });
        expect(criticalControl?.errors).toEqual({ max: true });
    });

    it("should set the correct error status for each control when the values are equal", () => {
        warningControl?.setValue(20);
        criticalControl?.setValue(20);
        reversedThresholds?.setValue(false);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual({ max: true });
        expect(criticalControl?.errors).toEqual({ min: true });

        reversedThresholds?.setValue(true);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual({ min: true });
        expect(criticalControl?.errors).toEqual({ max: true });
    });

    it("should remove errors when they are addressed", () => {
        warningControl?.setValue(30);
        criticalControl?.setValue(20);
        reversedThresholds?.setValue(false);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual({ max: true });
        expect(criticalControl?.errors).toEqual({ min: true });

        warningControl?.setValue(20);
        criticalControl?.setValue(30);

        thresholdsValidator(form);

        expect(warningControl?.errors).toEqual(null);
        expect(criticalControl?.errors).toEqual(null);
    });

    it("should return a form error status if the form is invalid", () => {
        warningControl?.setValue(30);
        criticalControl?.setValue(20);
        reversedThresholds?.setValue(false);

        expect(thresholdsValidator(form)).toEqual({ thresholds: true });

        warningControl?.setValue(20);
        criticalControl?.setValue(30);
        reversedThresholds?.setValue(true);

        expect(thresholdsValidator(form)).toEqual({ thresholds: true });
    });

    it("should return null if the form is valid", () => {
        warningControl?.setValue(20);
        criticalControl?.setValue(30);
        reversedThresholds?.setValue(false);

        expect(thresholdsValidator(form)).toEqual(null);
    });
});
