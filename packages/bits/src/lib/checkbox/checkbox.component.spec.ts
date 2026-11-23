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

import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CheckboxComponent } from "./checkbox.component";
import { NuiFormFieldModule } from "../form-field/form-field.module";

@Component({
    template: `
        <span id="external-label">External label</span>
        <nui-checkbox
            [ariaLabel]="label"
            [ariaLabelledby]="labelledby"
            [checked]="checked"
            [indeterminate]="indeterminate"
            [disabled]="disabled"
            [required]="required"
            [hint]="hint"
            (valueChange)="checked = $event.target.checked">
            {{ content }}
        </nui-checkbox>
    `,
    standalone: false,
})
class CheckboxHostComponent {
    public label: string | undefined;
    public labelledby: string | null = null;
    public content = "Visible label";
    public hint = "Helpful hint";
    public checked = false;
    public indeterminate = false;
    public disabled = false;
    public required = false;
}

@Component({
    template: `
        <span id="explicit-label">Explicit label</span>
        <nui-form-field [caption]="caption" [hint]="hint">
            <nui-checkbox
                [ariaLabel]="label"
                [ariaLabelledby]="labelledby"
                [ariaDescribedby]="description">
                {{ content }}
            </nui-checkbox>
        </nui-form-field>
    `,
    standalone: false,
})
class CheckboxFormFieldHostComponent {
    public caption = "Convert to";
    public content = "UTC";
    public label: string | undefined;
    public labelledby: string | null = null;
    public hint = "";
    public description = "";
}

describe("checkbox in a form field", () => {
    it("associates the caption and projected text while preserving explicit names", fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, CheckboxFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
        const fixture = TestBed.createComponent(CheckboxFormFieldHostComponent);
        const detect = () => {
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
        };
        detect();
        tick();
        detect();

        const host = fixture.componentInstance;
        const checkbox = fixture.debugElement.query(
            By.directive(CheckboxComponent)
        ).componentInstance as CheckboxComponent;
        const input = checkbox.inputViewContainer.element
            .nativeElement as HTMLInputElement;
        const caption = fixture.nativeElement.querySelector(
            ".nui-form-field__control-label"
        ) as HTMLLabelElement;
        expect(input.getAttribute("aria-labelledby")).toBe(
            `${caption.id} ${checkbox.contentId}`
        );

        host.caption = "";
        detect();
        tick();
        detect();
        expect(input.getAttribute("aria-labelledby")).toBe(checkbox.contentId);

        host.caption = "Convert to";
        host.label = "Custom name";
        detect();
        tick();
        detect();
        expect(input.getAttribute("aria-label")).toBe("Custom name");
        expect(input.hasAttribute("aria-labelledby")).toBeFalse();

        host.label = undefined;
        detect();
        expect(input.getAttribute("aria-labelledby")).toBe(
            `${caption.id} ${checkbox.contentId}`
        );

        host.labelledby = "explicit-label";
        detect();
        expect(input.getAttribute("aria-labelledby")).toBe("explicit-label");
    }));

    it("preserves a caller description when the field hint is removed", fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, CheckboxFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
        const fixture = TestBed.createComponent(CheckboxFormFieldHostComponent);
        const detect = () => {
            fixture.changeDetectorRef.markForCheck();
            fixture.detectChanges();
        };
        fixture.componentInstance.hint = "Choose a timezone";
        fixture.componentInstance.description = "external-description";
        detect();
        tick();
        detect();

        const input = fixture.nativeElement.querySelector(
            ".nui-checkbox__input"
        ) as HTMLInputElement;
        const help = fixture.nativeElement.querySelector(
            ".nui-form-field__help"
        ) as HTMLElement;
        expect(input.getAttribute("aria-describedby")).toBe(
            `external-description ${help.id}`
        );

        fixture.componentInstance.hint = "";
        detect();
        tick();
        detect();
        expect(input.getAttribute("aria-describedby")).toBe(
            "external-description"
        );
    }));
});

describe("components >", () => {
    describe("checkbox >", () => {
        let fixture: ComponentFixture<CheckboxComponent>;
        let subject: CheckboxComponent;
        let checkboxInput: HTMLInputElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [CheckboxComponent, CheckboxHostComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(CheckboxComponent);
            subject = fixture.componentInstance;
            checkboxInput = fixture.debugElement.query(
                By.css(".nui-checkbox__input")
            ).nativeElement;
        });

        describe("default >", () => {
            it("should be created", () => {
                expect(subject).toBeTruthy();
            });

            it("should be unchecked by default", () => {
                expect(subject.checked).toBeFalsy();
            });

            it("should input change on click", () => {
                checkboxInput.click();
                expect(subject.checked).toBeTruthy();
            });

            it("should help hint be displayed", () => {
                subject.hint = "Some Useful Help Hint";
                fixture.detectChanges();
                expect(fixture.nativeElement.textContent).toContain(
                    subject.hint
                );
            });

            describe("checkbox accessibility >", () => {
                let fixture: ComponentFixture<CheckboxHostComponent>;
                let host: CheckboxHostComponent;
                let checkbox: CheckboxComponent;
                let input: HTMLInputElement;

                function detect(): void {
                    fixture.changeDetectorRef.markForCheck();
                    fixture.detectChanges();
                }

                beforeEach(() => {
                    fixture = TestBed.createComponent(CheckboxHostComponent);
                    host = fixture.componentInstance;
                    detect();
                    checkbox = fixture.debugElement.query(
                        By.directive(CheckboxComponent)
                    ).componentInstance;
                    input = checkbox.inputViewContainer.element.nativeElement;
                });

                it("uses projected text unless an explicit label or labelledby is supplied", () => {
                    const content = checkbox.checkboxContent
                        .nativeElement as HTMLElement;
                    expect(input.getAttribute("aria-labelledby")).toBe(
                        content.id
                    );
                    expect(content.textContent?.trim()).toBe("Visible label");
                    expect(input.getAttribute("aria-label")).toBe("Checkbox");
                    expect(input.getAttribute("aria-describedby")).toBe(
                        checkbox.hintId
                    );
                    checkbox.ariaDescribedby = "external-description";
                    detect();
                    expect(input.getAttribute("aria-describedby")).toBe(
                        `external-description ${checkbox.hintId}`
                    );

                    host.content = "Updated label";
                    detect();
                    expect(content.textContent?.trim()).toBe("Updated label");

                    host.label = "Explicit label";
                    detect();
                    expect(input.getAttribute("aria-label")).toBe(
                        "Explicit label"
                    );
                    expect(input.hasAttribute("aria-labelledby")).toBeFalse();

                    host.labelledby = "external-label";
                    detect();
                    expect(input.getAttribute("aria-labelledby")).toBe(
                        "external-label"
                    );
                });

                it("exposes the focused checkbox state and keyboard changes", () => {
                    expect(input.type).toBe("checkbox");
                    expect(input.getAttribute("aria-checked")).toBe("false");
                    input.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    detect();
                    expect(input.getAttribute("aria-checked")).toBe("true");

                    host.indeterminate = true;
                    host.required = true;
                    detect();
                    expect(input.getAttribute("aria-checked")).toBe("mixed");
                    expect(input.required).toBeTrue();

                    host.disabled = true;
                    detect();
                    expect(input.disabled).toBeTrue();
                    input.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    detect();
                    expect(input.getAttribute("aria-checked")).toBe("mixed");
                });

                it("clears mixed state after a mouse click", () => {
                    host.indeterminate = true;
                    detect();
                    input.click();
                    detect();
                    expect(input.getAttribute("aria-checked")).toBe("true");
                });

                it("clears mixed state on space when already checked", () => {
                    host.checked = true;
                    host.indeterminate = true;
                    detect();
                    input.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    detect();
                    expect(input.getAttribute("aria-checked")).toBe("true");
                });
            });
        });

        describe("description relationships >", () => {
            it("should name and describe the focusable checkbox input", () => {
                fixture.componentRef.setInput(
                    "ariaLabel",
                    "Send email notifications"
                );
                fixture.componentRef.setInput(
                    "ariaLabelledby",
                    "checkbox-caption"
                );
                fixture.componentRef.setInput(
                    "ariaDescribedby",
                    "checkbox-instructions checkbox-error"
                );
                fixture.detectChanges();

                expect(checkboxInput.getAttribute("aria-describedby")).toBe(
                    "checkbox-instructions checkbox-error"
                );
                expect(checkboxInput.getAttribute("aria-label")).toBe(
                    "Send email notifications"
                );
                expect(checkboxInput.getAttribute("aria-labelledby")).toBe(
                    "checkbox-caption"
                );
                expect(checkboxInput.tabIndex).toBe(0);
                for (const attribute of [
                    "aria-label",
                    "aria-labelledby",
                    "aria-describedby",
                    "tabindex",
                ]) {
                    expect(
                        subject.checkboxLabel.nativeElement.hasAttribute(
                            attribute
                        )
                    ).toBeFalse();
                }
            });

            it("should update and remove focusable input description references", () => {
                fixture.componentRef.setInput(
                    "ariaDescribedby",
                    "original-instructions"
                );
                fixture.detectChanges();
                fixture.componentRef.setInput(
                    "ariaDescribedby",
                    "updated-instructions"
                );
                fixture.detectChanges();

                expect(checkboxInput.getAttribute("aria-describedby")).toBe(
                    "updated-instructions"
                );

                fixture.componentRef.setInput("ariaDescribedby", null);
                fixture.detectChanges();
                expect(
                    checkboxInput.hasAttribute("aria-describedby")
                ).toBeFalse();
            });
        });

        describe("keyboard handling >", () => {
            for (const code of ["Space", "Enter"]) {
                it(`should toggle the input once with ${code}`, () => {
                    fixture.detectChanges();
                    spyOn(subject.valueChange, "emit").and.callThrough();
                    const event = new KeyboardEvent("keydown", {
                        code,
                        bubbles: true,
                        cancelable: true,
                    });

                    checkboxInput.dispatchEvent(event);
                    fixture.detectChanges();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(checkboxInput.checked).toBeTrue();
                    expect(subject.checked).toBeTrue();
                    expect(subject.valueChange.emit).toHaveBeenCalledTimes(1);
                });
            }

            it("should select an indeterminate input with Space", () => {
                fixture.componentRef.setInput("indeterminate", true);
                fixture.detectChanges();

                checkboxInput.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "Space",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                fixture.detectChanges();

                expect(checkboxInput.checked).toBeTrue();
                expect(checkboxInput.indeterminate).toBeFalse();
                expect(subject.indeterminate).toBeFalse();
            });
        });

        describe("output handling logic >", () => {
            it("should output emit event if clicked", () => {
                spyOn(subject.valueChange, "emit").and.callThrough();
                checkboxInput.click();
                expect(subject.valueChange.emit).toHaveBeenCalled();
            });

            it("should not change value or emit when disabled and clicked", () => {
                spyOn(subject.valueChange, "emit").and.callThrough();
                subject.disabled = true;
                fixture.detectChanges();

                checkboxInput.click();

                expect(subject.checked).toBeFalsy();
                expect(subject.valueChange.emit).not.toHaveBeenCalled();
            });

            it("should output not emit events if focused, or hovered", () => {
                spyOn(subject.valueChange, "emit").and.callThrough();

                checkboxInput.focus();
                expect(subject.valueChange.emit).not.toHaveBeenCalled();
                checkboxInput.dispatchEvent(new MouseEvent("mouseenter"));
                expect(subject.valueChange.emit).not.toHaveBeenCalled();
            });
        });
    });
});
