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

import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WizardHorizontalComponent } from "./wizard-horizontal.component";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";

@Component({
    selector: "nui-test-cmp",
    template: ` <nui-wizard-horizontal>
        <nui-wizard-step-v2 label="step 1">
            <input aria-label="First step value" />
        </nui-wizard-step-v2>

        <nui-wizard-step-v2 label="step 2">
            <input aria-label="Second step value" />
        </nui-wizard-step-v2>
    </nui-wizard-horizontal>`,
    standalone: false,
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

        it("hides inactive panels without destroying their content", () => {
            const tablist: HTMLElement =
                fixture.nativeElement.querySelector("[role=tablist]");
            expect(
                tablist.querySelector("nui-wizard-step-header")
            ).not.toBeNull();
            expect(tablist.querySelector("[role=tabpanel]")).toBeNull();
            const panels: NodeListOf<HTMLElement> =
                fixture.nativeElement.querySelectorAll("[role=tabpanel]");
            const firstInput = panels[0].querySelector("input")!;
            firstInput.value = "Retained value";
            expect(panels[0].hidden).toBeFalse();
            expect(panels[1].hidden).toBeTrue();
            expect(getComputedStyle(panels[1]).display).toBe("none");

            component.selectedIndex = 1;
            fixture.detectChanges();
            expect(panels[0].hidden).toBeTrue();
            expect(panels[1].hidden).toBeFalse();

            component.selectedIndex = 0;
            fixture.detectChanges();
            expect(panels[0].hidden).toBeFalse();
            expect(panels[0].querySelector("input")).toBe(firstInput);
            expect(firstInput.value).toBe("Retained value");
        });

        it("does not expose panels whose responsive headers are in closed overflow", () => {
            component.isInResponsiveMode = true;
            component.hasOverflow = true;
            component.visibleSteps = [component.stepsArray[0]];
            component.overflownStepsEnd = [component.stepsArray[1]];
            component["cdRef"].markForCheck();
            fixture.detectChanges();

            const panels: NodeListOf<HTMLElement> =
                fixture.nativeElement.querySelectorAll("[role=tabpanel]");
            expect(panels[0].hidden).toBeFalse();
            expect(
                fixture.nativeElement.querySelectorAll(
                    `[id="${panels[0].getAttribute("aria-labelledby")}"]`
                ).length
            ).toBe(1);
            expect(panels[1].hidden).toBeTrue();
            expect(getComputedStyle(panels[1]).display).toBe("none");
            expect(
                fixture.nativeElement.querySelectorAll(
                    `[id="${panels[1].getAttribute("aria-labelledby")}"]`
                ).length
            ).toBe(0);
        });

        it("retains the selected panel label when navigating into and back from overflow", () => {
            component.isInResponsiveMode = true;
            component.hasOverflow = true;
            component.visibleSteps = [component.stepsArray[0]];
            component.overflownStepsEnd = [component.stepsArray[1]];
            component["cdRef"].markForCheck();
            fixture.detectChanges();

            for (const index of [1, 0]) {
                component.selectedIndex = index;
                fixture.detectChanges();
                const panel: HTMLElement = fixture.nativeElement.querySelector(
                    `[id="${component.stepContentIds[index]}"]`
                );
                expect(panel.hidden).toBeFalse();
                expect(
                    fixture.nativeElement.querySelectorAll(
                        `[id="${panel.getAttribute("aria-labelledby")}"]`
                    ).length
                ).toBe(1);
                expect(
                    fixture.nativeElement.querySelectorAll(
                        "[role=tabpanel]:not([hidden])"
                    ).length
                ).toBe(1);
            }
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
