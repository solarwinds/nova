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

import { CdkStep, CdkStepper } from "@angular/cdk/stepper";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, NgForm } from "@angular/forms";

import { WizardStepHeaderComponent } from "../wizard-step-header/wizard-step-header.component";
import { WizardDirective } from "../wizard.directive";
import { WizardStepV2Component } from "./wizard-step.component";

describe("components >", () => {
    describe("WizardStepComponent", () => {
        let component: WizardStepV2Component;
        let fixture: ComponentFixture<WizardStepV2Component>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    WizardStepHeaderComponent,
                    WizardStepV2Component,
                    WizardDirective,
                ],
                providers: [
                    { provide: CdkStep, useExisting: WizardStepV2Component },
                    { provide: CdkStepper, useValue: {} },
                ],
            });

            fixture = TestBed.createComponent(WizardStepV2Component);
            component = fixture.componentInstance;
        });

        describe("ngOnInit", () => {
            it("should call onControlStatusChanges method", () => {
                const spy = spyOn(component, "onControlStatusChanges" as never);

                component.ngOnInit();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("isErrorState", () => {
            const control = { invalid: false } as FormControl;
            const form = {} as NgForm;

            it("should call _errorStateMatcher 'isErrorState' method", () => {
                const spy = spyOn(
                    component["_errorStateMatcher"],
                    "isErrorState" as never
                );

                component.isErrorState(control, form);
                expect(spy).toHaveBeenCalledWith(
                    control as never,
                    form as never
                );
            });

            it("should return true if control invalid and errorState is true", () => {
                spyOn(
                    component["_errorStateMatcher"],
                    "isErrorState"
                ).and.returnValue(true);

                expect(
                    component.isErrorState(
                        { invalid: true } as FormControl,
                        form
                    )
                ).toBeTrue();
            });

            it("should return false if control valid and errorState is false", () => {
                spyOn(
                    component["_errorStateMatcher"],
                    "isErrorState"
                ).and.returnValue(false);

                expect(component.isErrorState(control, form)).toBeFalse();
            });
        });
    });
});
