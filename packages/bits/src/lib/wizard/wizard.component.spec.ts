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

import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { IWizardSelectionEvent } from "./public-api";
import { WizardStepComponent } from "./wizard-step.component";
import { WizardComponent } from "./wizard.component";
import { ButtonComponent } from "../../lib/button/button.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { LoggerService } from "../../services/log-service";

@Component({
    selector: "nui-test-cmp",
    template: ` <nui-wizard finishText="Finish">
        <nui-wizard-step [title]="'step1'"></nui-wizard-step>
        <nui-wizard-step [title]="'step2'"></nui-wizard-step>
        <nui-wizard-step [title]="'step3'"></nui-wizard-step>
    </nui-wizard>`,
    standalone: false,
})
class TestWrapperComponent {}

describe("components >", () => {
    describe("wizard >", () => {
        let component: WizardComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IconComponent],
                declarations: [
                    TestWrapperComponent,
                    ButtonComponent,
                    WizardComponent,
                    WizardStepComponent,
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [IconService, LoggerService],
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;
            fixture.detectChanges();
        });

        describe("selectionChange >", () => {
            it("should notify with updated IWizardSelectionEvent", () => {
                spyOn(component.selectionChange, "emit");
                const selectEventMock = {
                    selectedIndex: 0,
                    selectedStep: component.steps.toArray()[0],
                    previouslySelectedStep: component.steps.toArray()[0],
                    previouslySelectedIndex: 0,
                } as IWizardSelectionEvent;

                component.selectStep(component.steps.toArray()[0]);
                expect(component.selectionChange.emit).toHaveBeenCalledWith(
                    selectEventMock
                );
            });
        });

        describe("selectStep >", () => {
            it("should select wizard step", () => {
                component.onNextClick();
                component.selectStep(component.steps.toArray()[0]);
                expect(component.steps.toArray()[0].active).toBeTruthy();
            });
        });

        describe("addStepDynamic >", () => {
            it("should add wizard step to wizard", () => {
                component.addStepDynamic(component.steps.toArray()[0], 1);
                expect(component.steps.toArray().length).toBe(4);
            });
        });

        describe("disableStep >", () => {
            it("should disable wizard step", () => {
                component.disableStep(component.steps.toArray()[0]);
                expect(component.steps.toArray()[0].disabled).toBeTruthy();
            });
        });

        describe("enableStep >", () => {
            it("should enable wizard step", () => {
                component.hideStep(component.steps.toArray()[0]);
                expect(component.steps.toArray()[0].disabled).toBeFalsy();
            });
        });

        describe("hideStep >", () => {
            it("should hide wizard step", () => {
                component.hideStep(component.steps.toArray()[0]);
                expect(component.steps.toArray()[0].hidden).toBeTruthy();
            });
        });

        describe("showStep >", () => {
            it("should make wizard step is visible", () => {
                component.showStep(component.steps.toArray()[0]);
                expect(component.steps.toArray()[0].hidden).toBeFalsy();
            });
        });

        describe("goToStep >", () => {
            it("should go to wizard step which pass as parameter", () => {
                component.goToStep(1);
                expect(component.steps.toArray()[1].active).toBeTruthy();
            });
        });

        describe("next >", () => {
            it("should notify on Next button click", () => {
                spyOn(component.next, "emit");

                component.onNextClick();
                expect(component.next.emit).toHaveBeenCalled();
            });

            it("should move to next wizard step", () => {
                component.onNextClick();
                expect(component.currentStep).toBe(
                    component.steps.toArray()[1]
                );
            });

            it("should move to next step only after delay (simulating long action on exit step)", () => {
                component.navigationControl.next({
                    busyState: { busy: false },
                    allowStepChange: false,
                });
                component.onNextClick();
                expect(component.currentStep).toBe(
                    component.steps.toArray()[0]
                );
                component.navigationControl.next({
                    busyState: { busy: false },
                    allowStepChange: true,
                });
                expect(component.currentStep).toBe(
                    component.steps.toArray()[1]
                );
            });
        });

        describe("cancel >", () => {
            it("should notify on Cancel button click", () => {
                spyOn(component.cancel, "emit");

                component.onCancelClick();
                expect(component.cancel.emit).toHaveBeenCalled();
            });
        });

        describe("finish >", () => {
            it("should notify on Finish button click", () => {
                spyOn(component.finish, "emit");

                component.onFinishClick();
                expect(component.finish.emit).toHaveBeenCalled();
            });
        });

        describe("onBackClick >", () => {
            it("should move to previous wizard step", () => {
                component.onNextClick();

                component.onBackClick();
                expect(component.currentStep).toBe(
                    component.steps.toArray()[0]
                );
            });

            it("should notify on Back button click", () => {
                spyOn(component.back, "emit");

                component.onNextClick();
                component.onBackClick();
                expect(component.back.emit).toHaveBeenCalled();
            });
        });

        describe("constant height >", () => {
            it("should set height of wizard body container to 200px", () => {
                component.bodyContainerHeight = "200px";
                fixture.detectChanges();
                const wizardBodyContainer = fixture.debugElement.query(
                    By.css(".nui-wizard__container")
                ).nativeElement;
                expect(wizardBodyContainer.style.height).toEqual("200px");
            });

            it("should apply show-scroll class", () => {
                component.enableScroll = true;
                fixture.detectChanges();
                const wizardBodyContainer = fixture.debugElement.query(
                    By.css(".nui-wizard__container")
                ).nativeElement;
                expect(wizardBodyContainer.classList).toContain("show-scroll");
            });

            it("should dynamically change height when input changes", () => {
                component.bodyContainerHeight = "200px";
                fixture.detectChanges();
                const wizardBodyContainer = fixture.debugElement.query(
                    By.css(".nui-wizard__container")
                ).nativeElement;
                expect(wizardBodyContainer.style.height).toEqual("200px");
                component.bodyContainerHeight = "300px";
                fixture.detectChanges();
                expect(wizardBodyContainer.style.height).toEqual("300px");
            });

            it("should accept different CSS units", () => {
                component.bodyContainerHeight = "5vh";
                fixture.detectChanges();
                const wizardBodyContainer = fixture.debugElement.query(
                    By.css(".nui-wizard__container")
                ).nativeElement;
                expect(wizardBodyContainer.style.height).toEqual("5vh");
                component.bodyContainerHeight = "10%";
                fixture.detectChanges();
                expect(wizardBodyContainer.style.height).toEqual("10%");
            });
        });

        describe("remove step >", () => {
            it("should not remove step if index less 1", () => {
                const length = component.steps.toArray().length;

                component.removeStep(0);
                expect(component.steps.toArray().length).toEqual(length);
            });

            it("should remove step by index", () => {
                const length = component.steps.toArray().length;

                component.removeStep(2);
                expect(component.steps.toArray().length).toEqual(length - 1);
            });

            it("should call steps reset method", () => {
                const spy = spyOn(component.steps, "reset");

                component.removeStep(2);
                expect(spy).toHaveBeenCalled();
            });

            it("should call onBackClick method when remove selected", () => {
                const index = 1;
                const spy = spyOn(component, "onBackClick");
                const toSelectStep = component.steps.toArray()[index];

                component.selectStep(toSelectStep);
                component.removeStep(index);
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("reset resetStep >", () => {
            it("should reset step statuses", () => {
                const firstStep = component.steps.get(0) as WizardStepComponent;
                const stepToReset = component.steps.get(
                    1
                ) as WizardStepComponent;

                component.selectStep(stepToReset);
                component.selectStep(firstStep);
                component.resetStep(stepToReset);

                expect(stepToReset.visited).toBeFalse();
                expect(stepToReset.complete).toBeFalse();
                expect(stepToReset.icon).toEqual("step");
            });

            it("should reset 'complete' status for previous step", () => {
                const firstStep = component.steps.get(0) as WizardStepComponent;
                const stepToReset = component.steps.get(
                    1
                ) as WizardStepComponent;

                component.selectStep(stepToReset);
                component.selectStep(firstStep);
                component.resetStep(stepToReset);

                expect(firstStep.complete).toBeFalse();
            });

            it("should reset step statuses for next step", () => {
                const firstStep = component.steps.get(0) as WizardStepComponent;
                const stepToReset = component.steps.get(
                    1
                ) as WizardStepComponent;
                const nextStep = component.steps.get(2) as WizardStepComponent;

                component.selectStep(stepToReset);
                component.selectStep(firstStep);
                component.selectStep(nextStep);
                component.resetStep(stepToReset);

                expect(nextStep.visited).toBeFalse();
                expect(nextStep.complete).toBeFalse();
                expect(nextStep.icon).toEqual("step");
            });
        });
    });
});
