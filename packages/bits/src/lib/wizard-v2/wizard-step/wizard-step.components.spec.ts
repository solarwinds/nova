import { WizardStepV2Component } from "./wizard-step.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardStepHeaderComponent } from "../wizard-step-header/wizard-step-header.component";
import { CdkStep, CdkStepper } from "@angular/cdk/stepper";
import { WizardDirective } from "../wizard.directive";

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
    });
});
