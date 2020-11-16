import { AbstractControl } from "@angular/forms";

/**
 * Removes the specified errors from a form control
 *
 * @param field
 * @param errorKeys
 */
export function removeErrors(field: AbstractControl, ...errorKeys: string[]) {
    if (!field.errors) {
        return;
    }

    for (const errorKey of errorKeys) {
        if (errorKey && field.errors[errorKey]) {
            delete field.errors[errorKey];
        }
    }

    if (Object.keys(field.errors).length === 0) {
        field.setErrors(null);
    }
}
