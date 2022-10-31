// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
        form = formBuilder.group({
            testControl: ["", [Validators.maxLength(0)]],
        });
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

        // TODO: add back in after NUI-5893
        xit("should trigger the subscription after a value changes", () => {
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
