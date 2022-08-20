/** Provider that defines how form controls behave with regards to displaying error messages. */
import { Injectable } from "@angular/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";

@Injectable({ providedIn: "root" })
export class ErrorStateMatcher {
    isErrorState(
        control?: FormControl,
        form?: FormGroupDirective | NgForm
    ): boolean {
        return !!(
            control &&
            control.invalid &&
            (control.touched || (form && form.submitted))
        );
    }
}
