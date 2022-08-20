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
) {
    const origFunc = formControl.markAsTouched;
    formControl.markAsTouched = () => {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        origFunc.apply(formControl, arguments);

        callback();
    };
}
