import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { WizardHorizontalComponent } from "./wizard-horizontal.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";

@Component({
    selector: "nui-test-cmp",
    template: `
        <nui-wizard-horizontal>
            <nui-wizard-step-v2 label="step 1">
            </nui-wizard-step-v2>

            <nui-wizard-step-v2 label="step 2">
            </nui-wizard-step-v2>
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
                providers: [
                    ChangeDetectorRef,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;
        });

        describe("ngOnInit", () => {
            it("should set linear true", () => {
                component.ngOnInit();
                expect(component["linear"]).toBeTrue();
            });
        });
    });
});
