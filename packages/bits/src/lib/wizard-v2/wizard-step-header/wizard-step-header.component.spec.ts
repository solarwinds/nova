import { WizardStepHeaderComponent } from "./wizard-step-header.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IconComponent } from "../../icon/icon.component";
import { WizardStepLabelDirective } from "../wizard-step-label.directive";
import { TemplateRef } from "@angular/core";

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
        });

        describe("stringLabel", () => {
            afterEach(() => {
                component.label = "";
            });

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
    });
});
