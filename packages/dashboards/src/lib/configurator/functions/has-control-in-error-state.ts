import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

/**
 * Checks whether given form has a field that should be visually marked as invalid
 *
 * @param parent
 */
export function hasControlInErrorState(parent: AbstractControl): boolean {
    if (parent.valid || parent.untouched) {
        return false;
    }

    if (parent instanceof FormGroup) {
        for (const key of Object.keys(parent.controls)) {
            const control = parent.controls[key];

            if (hasControlInErrorState(control)) {
                return true;
            }
        }

        return false;
    }

    if (parent instanceof FormArray) {
        for (let i = 0; i < parent.length; i++) {
            const control = parent.at(i);

            if (hasControlInErrorState(control)) {
                return true;
            }
        }

        return false;
    }

    return ((parent.touched || parent.dirty) && parent.invalid);
}
