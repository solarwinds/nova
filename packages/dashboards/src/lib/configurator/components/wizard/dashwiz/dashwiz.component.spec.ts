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

import { PortalModule } from "@angular/cdk/portal";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

import {
    ButtonComponent,
    IconComponent,
    IconService,
    LoggerService,
} from "@nova-ui/bits";

import { TemplateLoadErrorComponent } from "../../../../components/template-load-error/template-load-error.component";
import { mockLoggerService } from "../../../../mocks";
import { ComponentPortalDirective } from "../../../../pizzagna/directives/component-portal/component-portal.directive";
import { ProviderRegistryService } from "../../../../services/provider-registry.service";
import { DashwizStepComponent } from "../dashwiz-step/dashwiz-step.component";
import { IDashwizStepNavigatedEvent } from "../types";
import { DashwizButtonsComponent } from "./dashwiz-buttons.component";
import { DashwizComponent } from "./dashwiz.component";

@Component({
    selector: "nui-test-cmp",
    template: ` <nui-dashwiz finishText="Finish">
        <nui-dashwiz-step></nui-dashwiz-step>
        <nui-dashwiz-step></nui-dashwiz-step>
        <nui-dashwiz-step></nui-dashwiz-step>
    </nui-dashwiz>`,
})
class TestWrapperComponent {}

describe("components >", () => {
    describe("wizard >", () => {
        let component: DashwizComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PortalModule],
                declarations: [
                    TestWrapperComponent,
                    ButtonComponent,
                    DashwizComponent,
                    DashwizButtonsComponent,
                    DashwizStepComponent,
                    IconComponent,
                    ComponentPortalDirective,
                    TemplateLoadErrorComponent,
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    IconService,
                    ProviderRegistryService,
                    {
                        provide: LoggerService,
                        useValue: mockLoggerService,
                    },
                ],
            });
            TestBed.overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [
                        DashwizButtonsComponent,
                        DashwizStepComponent,
                        TemplateLoadErrorComponent,
                    ],
                },
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;
            fixture.detectChanges();
        });

        describe("stepNavigated >", () => {
            it("should notify with updated IWizardSelectionEvent", () => {
                spyOn(component.stepNavigated, "emit");
                const stepNavigatedEventMock: IDashwizStepNavigatedEvent = {
                    currentStepIndex: 0,
                    currentStep: component.steps.toArray()[0],
                    previousStep: component.steps.toArray()[0],
                    previousStepIndex: 0,
                };

                component.selectStep(component.steps.toArray()[0]);
                expect(component.stepNavigated.emit).toHaveBeenCalledWith(
                    stepNavigatedEventMock
                );
            });
        });

        describe("selectStep >", () => {
            it("should select wizard step", () => {
                component.onNext();
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

                component.onNext();
                expect(component.next.emit).toHaveBeenCalled();
            });

            it("should move to next wizard step", () => {
                component.onNext();
                expect(component.currentStep).toBe(
                    component.steps.toArray()[1]
                );
            });

            it("should move to next step only after delay (simulating long action on exit step)", () => {
                component.navigationControl.next({
                    busyState: { busy: false },
                    allowStepChange: false,
                });
                component.onNext();
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

                component.onCancel();
                expect(component.cancel.emit).toHaveBeenCalled();
            });
        });

        describe("finish >", () => {
            it("should notify on Finish button click", () => {
                spyOn(component.finish, "emit");

                component.onFinish();
                expect(component.finish.emit).toHaveBeenCalled();
            });
        });

        describe("back >", () => {
            it("should move to previous wizard step", () => {
                component.onNext();

                component.onBack();
                expect(component.currentStep).toBe(
                    component.steps.toArray()[0]
                );
            });

            it("should notify on Back button click", () => {
                spyOn(component.back, "emit");

                component.onNext();
                component.onBack();
                expect(component.back.emit).toHaveBeenCalled();
            });
        });
    });
});
