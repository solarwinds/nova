import { WizardStepHeaderComponent } from "./wizard-step-header.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IconComponent } from "../../icon/icon.component";

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
    });
});
