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
import { NuiWizardV2Module } from "../wizard.module";

@Component({
    selector: "nui-test-cmp",
    template: ` <nui-wizard-horizontal>
        <nui-wizard-step-v2 label="step 1" [completed]="true">
            <ng-template nuiWizardStepFooter>
                <button type="button" nuiWizardNext>Next</button>
            </ng-template>
        </nui-wizard-step-v2>
        <nui-wizard-step-v2 label="step 2" [completed]="true">
            <ng-template nuiWizardStepFooter>
                <button type="button" nuiWizardPrevious>Back</button>
                <button type="button" nuiWizardNext>Next</button>
            </ng-template>
        </nui-wizard-step-v2>
        <nui-wizard-step-v2 label="step 3" [completed]="true">
            <ng-template nuiWizardStepFooter>
                <button type="button" nuiWizardPrevious>Back</button>
            </ng-template>
        </nui-wizard-step-v2>
    </nui-wizard-horizontal>`,
    standalone: false,
})
class TestWrapperComponent {}

describe("components >", () => {
    describe("WizardHorizontalComponent", () => {
        let component: WizardHorizontalComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;
        let resizeObserver: jasmine.SpyObj<ResizeObserver>;

        beforeEach(() => {
            resizeObserver = jasmine.createSpyObj<ResizeObserver>(
                "ResizeObserver",
                ["observe", "unobserve", "disconnect"]
            );
            spyOn(window, "ResizeObserver").and.returnValue(resizeObserver);
            TestBed.configureTestingModule({
                imports: [NuiWizardV2Module],
                declarations: [TestWrapperComponent],
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
                expect(component.linear).toBeTrue();
            });
        });

        describe("ngAfterViewInit", () => {
            it("should render the step headers", () => {
                expect(component.stepHeaders.length).toBe(3);
            });

            it("should observe the header container and disconnect on destroy", () => {
                expect(resizeObserver.observe).toHaveBeenCalledWith(
                    component.headerContainer.nativeElement
                );
                fixture.destroy();
                expect(resizeObserver.disconnect).toHaveBeenCalled();
            });
        });

        describe("responsive focus order", () => {
            const selectedPanel = (): HTMLElement =>
                fixture.nativeElement.querySelector(
                    "[role='tabpanel'][aria-expanded='true']"
                );

            function navigate(direction: "Next" | "Back"): void {
                const buttons = Array.from<HTMLButtonElement>(
                    fixture.nativeElement.querySelectorAll(
                        "wizard-footer button"
                    )
                );
                const button = buttons.find(
                    candidate => candidate.textContent?.trim() === direction
                )!;
                button.focus();
                button.click();
                fixture.detectChanges();
                TestBed.tick();
            }

            beforeEach(() => {
                component.hasOverflow = true;
                component.isInResponsiveMode = true;
                component.visibleSteps = component.stepsArray.slice(0, 2);
                component.overflownStepsStart = [];
                component.overflownStepsEnd = component.stepsArray.slice(2);
                fixture.detectChanges();
            });

            it("should focus the selected content panel after Next and Back cross the overflow boundary", () => {
                navigate("Next");
                navigate("Next");

                expect(component.selectedIndex).toBe(2);
                expect(component.overflownStepsStart.length).toBe(1);
                expect(document.activeElement).toBe(selectedPanel());

                navigate("Back");

                expect(component.selectedIndex).toBe(1);
                expect(document.activeElement).toBe(selectedPanel());
            });

            for (const activation of [
                { key: "Enter", code: "Enter", keyCode: 13 },
                { key: " ", code: "Space", keyCode: 32 },
            ]) {
                it(`should activate the focused step with ${activation.code} after overflow shifts the headers`, () => {
                    navigate("Next");
                    navigate("Next");
                    expect(component.overflownStepsStart.length).toBe(1);
                    fixture.nativeElement
                        .querySelector(
                            "nui-wizard-step-header[aria-selected='true']"
                        )
                        .focus();

                    document.activeElement!.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            key: "ArrowLeft",
                            code: "ArrowLeft",
                            keyCode: 37,
                            bubbles: true,
                        })
                    );
                    const focusedHeader = document.activeElement!;
                    expect(focusedHeader.getAttribute("aria-posinset")).toBe(
                        "2"
                    );
                    expect(component.selectedIndex).toBe(2);
                    const event = new KeyboardEvent("keydown", {
                        ...activation,
                        bubbles: true,
                        cancelable: true,
                    });

                    focusedHeader.dispatchEvent(event);
                    fixture.detectChanges();
                    TestBed.tick();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(component.selectedIndex).toBe(1);
                    expect(component.selected).toBe(component.stepsArray[1]);
                    expect(document.activeElement).toBe(selectedPanel());
                });
            }

            it("should block header activation until the previous step completes", () => {
                component.isInResponsiveMode = false;
                component.hasOverflow = false;
                fixture.detectChanges();
                const firstHeader: HTMLElement =
                    fixture.nativeElement.querySelector(
                        "nui-wizard-step-header"
                    );
                firstHeader.focus();
                firstHeader.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "ArrowRight",
                        keyCode: 39,
                        bubbles: true,
                    })
                );
                const secondHeader = document.activeElement!;
                expect(secondHeader.getAttribute("aria-posinset")).toBe("2");

                for (const completed of [false, true]) {
                    component.steps.first.completed = completed;
                    const event = new KeyboardEvent("keydown", {
                        key: "Enter",
                        keyCode: 13,
                        bubbles: true,
                        cancelable: true,
                    });

                    secondHeader.dispatchEvent(event);
                    fixture.detectChanges();
                    TestBed.tick();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(component.selectedIndex).toBe(completed ? 1 : 0);
                    expect(document.activeElement).toBe(
                        completed ? selectedPanel() : secondHeader
                    );
                }
            });

            it("should preserve external focus during initialization and programmatic navigation", () => {
                const outside = document.createElement("button");
                document.body.appendChild(outside);
                outside.focus();
                const initialFixture =
                    TestBed.createComponent(TestWrapperComponent);

                try {
                    initialFixture.detectChanges();
                    TestBed.tick();
                    expect(document.activeElement).toBe(outside);

                    component.selectedIndex = 1;
                    fixture.detectChanges();
                    TestBed.tick();
                    expect(document.activeElement).toBe(outside);
                } finally {
                    initialFixture.destroy();
                    outside.remove();
                }
            });
        });
    });
});
