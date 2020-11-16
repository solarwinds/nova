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
