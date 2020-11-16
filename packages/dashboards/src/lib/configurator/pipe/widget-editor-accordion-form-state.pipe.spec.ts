import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AccordionState } from "../../types";

import { WidgetEditorAccordionFormStatePipe } from "./widget-editor-accordion-form-state.pipe";

describe("WidgetEditorAccordionFormStatePipe > ", () => {
    let pipe: WidgetEditorAccordionFormStatePipe;
    let form: FormGroup;
    const unsubscribe$ = new Subject();

    beforeEach(() => {
        const formBuilder = new FormBuilder();
        form = formBuilder.group({ testControl: ["", [Validators.maxLength(0)]] });
        pipe = new WidgetEditorAccordionFormStatePipe();
    });

    afterEach(() => {
        unsubscribe$.next();
    });

    afterAll(() => {
        unsubscribe$.complete();
    });

    describe("transform > ", () => {
        it("should trigger the subscription directly after invocation", () => {
            const spy = jasmine.createSpy();
            pipe.transform(form).pipe(takeUntil(unsubscribe$)).subscribe(spy);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(AccordionState.DEFAULT);
        });

        it("should trigger the subscription after a value changes", () => {
            const spy = jasmine.createSpy();
            pipe.transform(form).pipe(takeUntil(unsubscribe$)).subscribe(spy);
            form.setValue({ testControl: "test" });
            expect(spy).toHaveBeenCalledTimes(2);
            const args = spy.calls.allArgs();
            expect(args[0]).toEqual([AccordionState.DEFAULT]);
            expect(args[1]).toEqual([AccordionState.DEFAULT]);
        });

        it("should trigger the subscription with a 'critical' accordion state if the form control is touched and the value is invalid", () => {
            const spy = jasmine.createSpy();
            pipe.transform(form).pipe(takeUntil(unsubscribe$)).subscribe(spy);
            form.get("testControl")?.markAsTouched();
            form.setValue({ testControl: "test" });
            expect(spy).toHaveBeenCalledTimes(2);
            const args = spy.calls.allArgs();
            expect(args[0]).toEqual([AccordionState.DEFAULT]);
            expect(args[1]).toEqual([AccordionState.CRITICAL]);
        });
    });

});
