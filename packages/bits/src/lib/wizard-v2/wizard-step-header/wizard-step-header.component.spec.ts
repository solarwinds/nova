import { WizardStepHeaderComponent } from "./wizard-step-header.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IconComponent } from "../../icon/icon.component";
import { WizardStepLabelDirective } from "../wizard-step-label.directive";
import { TemplateRef } from "@angular/core";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";
import { STEP_STATE } from "@angular/cdk/stepper";

const fakeStep = {} as WizardStepV2Component;

describe("components >",() => {
    describe("WizardStepHeader", () => {
        let component: WizardStepHeaderComponent;
        let fixture: ComponentFixture<WizardStepHeaderComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    WizardStepHeaderComponent,
                    IconComponent,
                ],
            });

            fixture = TestBed.createComponent(WizardStepHeaderComponent);
            component = fixture.componentInstance;
            component.step = fakeStep;
        });

        describe("ngAfterViewInit", () => {
            it("should call _focusMonitor 'monitor' method", () => {
                const spy = spyOn(component["_focusMonitor"], "monitor");

                component.ngAfterViewInit();
                expect(spy).toHaveBeenCalledWith(component["_elementRef"], true);
            });
        });

        describe("ngOnDestroy", () => {
            it("should call _focusMonitor 'stopMonitoring' method", () => {
                const spy = spyOn(component["_focusMonitor"], "stopMonitoring");

                component.ngOnDestroy();
                expect(spy).toHaveBeenCalledWith(component["_elementRef"]);
            });
        });

        describe("focus", () => {
            it("should call _focusMonitor 'focusVia' method", () => {
                const spy = spyOn(component["_focusMonitor"], "focusVia");

                component.focus();
                expect(spy).toHaveBeenCalledWith(component["_elementRef"], "program");
            });
        });

        describe("ngOnChanges", () => {
            const config: any = {
                stepStateConfig: {
                    currentValue: {},
                },
            };

            it("should call updateStepStateConfig method", () => {
                const spy = spyOn(component, "updateStepStateConfig" as never);

                component.ngOnChanges(config);
                expect(spy).toHaveBeenCalledWith(config.stepStateConfig.currentValue as never);
            });

            it("should call createStepStateConfigMap method", () => {
                const spy = spyOn(component, "createStepStateConfigMap" as never);

                component.ngOnChanges(config);
                expect(spy).toHaveBeenCalled();
            });

            it("should update stepState", () => {
                const mockStep = { hasError: true } as WizardStepV2Component;

                component.selected = true;
                component.step = mockStep;
                component.ngOnChanges(config);

                expect(component.stepState).toEqual(STEP_STATE.ERROR);
            });
        });

        describe("stringLabel", () => {
            it("should return string if label is string", () => {
                const label = "label";

                component.label = label;
                expect(component.stringLabel).toEqual(label);
            });

            it("should return null if user pass template as input for label", () => {
                const label = new WizardStepLabelDirective({} as TemplateRef<any>);

                component.label = label;
                expect(component.stringLabel).toEqual(null);
            });
        });

        describe("templateLabel", () => {
            afterEach(() => {
                component.label = "";
            });

            it("should return null if label is string", () => {
                const label = "label";

                component.label = label;
                expect(component.templateLabel).toEqual(null);
            });

            it("should return wizardDirective if user pass template as input for label", () => {
                const label = new WizardStepLabelDirective({} as TemplateRef<any>);

                component.label = label;
                expect(component.templateLabel).toEqual(label);
            });
        });

        describe("getStepState", () => {
            it("should return error state if step invalid", () => {
                const stepMock: WizardStepV2Component = { hasError: true } as WizardStepV2Component;

                component.selected = true;
                const state = component["getStepState"](stepMock);

                expect(state).toEqual(STEP_STATE.ERROR);
            });

            it("should return edit state for current no completed step", () => {
                const stepMock: WizardStepV2Component = {} as WizardStepV2Component;

                component.selected = true;
                const state = component["getStepState"](stepMock);

                expect(state).toEqual(STEP_STATE.EDIT);
            });

            it("should return complete state for completed step", () => {
                const stepMock: WizardStepV2Component = { completed: true } as WizardStepV2Component;

                const state = component["getStepState"](stepMock);

                expect(state).toEqual(STEP_STATE.DONE);
            });

            it("should return number state", () => {
                const stepMock: WizardStepV2Component = {} as WizardStepV2Component;

                const state = component["getStepState"](stepMock);

                expect(state).toEqual(STEP_STATE.NUMBER);
            });
        });
    });
});
