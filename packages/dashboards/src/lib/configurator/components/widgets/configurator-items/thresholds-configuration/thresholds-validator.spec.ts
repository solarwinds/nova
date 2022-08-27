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
