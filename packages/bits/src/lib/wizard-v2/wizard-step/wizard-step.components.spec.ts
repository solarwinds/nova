import { WizardStepV2Component } from "./wizard-step.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardStepHeaderComponent } from "../wizard-step-header/wizard-step-header.component";
import { CdkStep, CdkStepper } from "@angular/cdk/stepper";
import { WizardDirective } from "../wizard.directive";
import { FormControl, NgForm } from "@angular/forms";

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

        describe("isErrorSep", () => {
            const control = { invalid: false } as FormControl;
            const form = {} as NgForm;

            it("should call _errorStateMatcher 'isErrorState' method", () => {
                const spy = spyOn(component["_errorStateMatcher"], "isErrorState" as never);

                component.isErrorState(control, form);
                expect(spy).toHaveBeenCalledWith(control as never, form as never);
            });

            it("should return true if control invalid and errorState is true", () => {
                spyOn(component["_errorStateMatcher"], "isErrorState").and.returnValue(true);

                expect(component.isErrorState({ invalid: true } as FormControl, form)).toBeTrue();
            });

            it("should return false if control valid and errorState is false", () => {
                spyOn(component["_errorStateMatcher"], "isErrorState").and.returnValue(false);

                expect(component.isErrorState(control, form)).toBeFalse();
            });
        });
    });
});
