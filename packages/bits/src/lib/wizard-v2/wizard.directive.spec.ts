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

import { CdkStepper } from "@angular/cdk/stepper";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
    WizardStepperNextDirective,
    WizardStepperPreviousDirective,
} from "./wizard-button/wizard-button";
import { WizardFooterComponent } from "./wizard-footer/wizard-footer.component";
import { WizardStepV2Component } from "./wizard-step/wizard-step.component";
import { WizardStepFooterDirective } from "./wizard-step-footer.directive";
import { WizardStepHeaderComponent } from "./wizard-step-header/wizard-step-header.component";
import { WizardStepLabelDirective } from "./wizard-step-label.directive";
import { WizardDirective } from "./wizard.directive";

@Component({
    selector: "nui-test-cmp",
    template: ` <div>
        <nui-wizard-step-v2 label="step1"></nui-wizard-step-v2>
        <nui-wizard-step-v2 label="step2"></nui-wizard-step-v2>
        <nui-wizard-step-v2 label="step3"></nui-wizard-step-v2>
    </div>`,
    standalone: false,
})
class TestWrapperComponent extends WizardDirective {}

describe("directives >", () => {
    describe("WizardDirective", () => {
        let component: TestWrapperComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    WizardStepHeaderComponent,
                    WizardFooterComponent,
                    WizardStepV2Component,
                    WizardDirective,
                    WizardStepLabelDirective,
                    WizardStepFooterDirective,
                    WizardStepperNextDirective,
                    WizardStepperPreviousDirective,
                    TestWrapperComponent,
                ],
                providers: [CdkStepper],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        describe("ngAfterViewInit", () => {
            it("should call restore if state finished", () => {
                const spy = spyOn(component, "restore" as never);

                component.state = { finished: true };
                component.ngAfterViewInit();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe("ngOnChanges", () => {
            it("should set state", () => {
                const changes = {
                    state: {
                        currentValue: { finished: false },
                    },
                };

                component.ngOnChanges(changes as any);
                expect(component.state).toEqual(changes.state.currentValue);
            });
        });
    });
});
