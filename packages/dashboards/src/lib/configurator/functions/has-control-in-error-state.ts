import { AbstractControl, FormArray, FormGroup } from "@angular/forms";

/**
 * Checks whether given form has a field that should be visually marked as invalid
 * Considers a FormGroup/FormArray subform tree without an error if all child forms are either valid or untouched
 *
 * @param parent
 */
export function hasControlInErrorState(parent: AbstractControl): boolean {
    // FormGroup/FormArray/FormControl is not in an error state if it's either valid or untouched
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
        // Any error hasn't been found in FormGroup subtree, the whole FormGroup is considered without an error
        return false;
    }

    if (parent instanceof FormArray) {
        for (let i = 0; i < parent.length; i++) {
            const control = parent.at(i);

            if (hasControlInErrorState(control)) {
                return true;
            }
        }
        // Any error hasn't been found in FormArray subtree, the whole FormArray is considered without an error
        return false;
    }

    // FormControl is in an error state if it's touched/dirty and invalid
    return ((parent.touched || parent.dirty) && parent.invalid);
}
