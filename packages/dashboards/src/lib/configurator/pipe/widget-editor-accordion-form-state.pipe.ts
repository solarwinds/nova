import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { combineLatest, Observable } from "rxjs";
import { distinct, map, startWith } from "rxjs/operators";

import { AccordionState } from "../../types";
import { hasControlInErrorState } from "../functions/has-control-in-error-state";

@Pipe({
    name: "nuiWidgetEditorAccordionFormState",
    pure: false,
})
export class WidgetEditorAccordionFormStatePipe implements PipeTransform {
    public transform(
        form: FormGroup | AbstractControl | null
    ): Observable<AccordionState> {
        if (!form) {
            throw new Error("Provided form is undefined");
        }

        return combineLatest([form.statusChanges, form.valueChanges]).pipe(
            startWith(null),
            map(() =>
                hasControlInErrorState(form)
                    ? AccordionState.CRITICAL
                    : AccordionState.DEFAULT
            ),
            distinct()
        );
    }
}
