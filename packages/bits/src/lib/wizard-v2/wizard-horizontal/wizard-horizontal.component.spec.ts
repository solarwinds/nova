import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WizardStepV2Component } from "../wizard-step/wizard-step.component";
import { WizardHorizontalComponent } from "./wizard-horizontal.component";

@Component({
    selector: "nui-test-cmp",
    template: ` <nui-wizard-horizontal>
        <nui-wizard-step-v2 label="step 1"> </nui-wizard-step-v2>

        <nui-wizard-step-v2 label="step 2"> </nui-wizard-step-v2>
    </nui-wizard-horizontal>`,
})
class TestWrapperComponent {}

describe("components >", () => {
    describe("WizardHorizontalComponent", () => {
        let component: WizardHorizontalComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    WizardHorizontalComponent,
                    WizardStepV2Component,
                    TestWrapperComponent,
                ],
                providers: [ChangeDetectorRef],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;

            fixture.detectChanges();
        });

        describe("ngOnInit", () => {
            it("should set linear true", () => {
                component.ngOnInit();
                expect(component["linear"]).toBeTrue();
            });
        });

        describe("ngAfterViewInit", () => {
            it("should cache the steps array", () => {
                expect(component["stepsCachedArray"].length).toBe(2);
            });

            it("should call checkHeadingsView()", () => {
                const spy = spyOn(component, "checkHeadingsView" as never);

                component.ngAfterViewInit();
                expect(spy).toHaveBeenCalled();
            });

            it("should add ResizeObserver subscription", () => {
                const oldObservers = component.selectionChange.observers.length;

                component.ngAfterViewInit();
                expect(
                    component.selectionChange.observers.length
                ).toBeGreaterThan(oldObservers);
            });
        });
    });
});
