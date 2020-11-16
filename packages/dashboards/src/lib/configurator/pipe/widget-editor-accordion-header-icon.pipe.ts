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

    transform(form: FormGroup | AbstractControl | null, defaultIcon: string,
              errorIcon: string = FormHeaderIconPipePipe.ERROR_ICON_DEFAULT): Observable<string | null> {
        if (!form) {
            throw new Error("Provided form is undefined");
        }
        return combineLatest([form.statusChanges, form.valueChanges])
            .pipe(
                startWith(null),
                map(() => hasControlInErrorState(form) ? errorIcon : defaultIcon)
            );
    }
}
