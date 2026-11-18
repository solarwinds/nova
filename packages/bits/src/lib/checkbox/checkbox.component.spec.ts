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
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const host = fixture.componentInstance;
        const checkbox = fixture.debugElement.query(
            By.directive(CheckboxComponent)
        ).componentInstance as CheckboxComponent;
        const label = checkbox.checkboxLabel.nativeElement as HTMLElement;
        const caption = fixture.nativeElement.querySelector(
            ".nui-form-field__control-label"
        ) as HTMLLabelElement;
        expect(label.getAttribute("aria-labelledby")).toBe(
            `${caption.id} ${checkbox.contentId}`
        );

        host.caption = "";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(label.getAttribute("aria-labelledby")).toBe(checkbox.contentId);

        host.caption = "Convert to";
        host.label = "Custom name";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(label.getAttribute("aria-label")).toBe("Custom name");
        expect(label.hasAttribute("aria-labelledby")).toBeFalse();

        host.label = undefined;
        fixture.detectChanges();
        expect(label.getAttribute("aria-labelledby")).toBe(
            `${caption.id} ${checkbox.contentId}`
        );

        host.labelledby = "explicit-label";
        fixture.detectChanges();
        expect(label.getAttribute("aria-labelledby")).toBe("explicit-label");
    }));

    it("preserves a caller description when the field hint is removed", fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, CheckboxFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
        const fixture = TestBed.createComponent(CheckboxFormFieldHostComponent);
        fixture.componentInstance.hint = "Choose a timezone";
        fixture.componentInstance.description = "external-description";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const label = fixture.nativeElement.querySelector(
            ".nui-checkbox__label"
        ) as HTMLElement;
        const help = fixture.nativeElement.querySelector(
            ".nui-form-field__help"
        ) as HTMLElement;
        expect(label.getAttribute("aria-describedby")).toBe(
            `external-description ${help.id}`
        );

        fixture.componentInstance.hint = "";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(label.getAttribute("aria-describedby")).toBe(
            "external-description"
        );
    }));
});

describe("components >", () => {
    describe("checkbox >", () => {
        let fixture: ComponentFixture<CheckboxComponent>;
        let subject: CheckboxComponent;
        let checkboxInput: HTMLElement;

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
                let label: HTMLElement;

                beforeEach(() => {
                    fixture = TestBed.createComponent(CheckboxHostComponent);
                    host = fixture.componentInstance;
                    fixture.detectChanges();
                    checkbox = fixture.debugElement.query(
                        By.directive(CheckboxComponent)
                    ).componentInstance;
                    label = checkbox.checkboxLabel.nativeElement;
                });

                it("uses projected text unless an explicit label or labelledby is supplied", () => {
                    const content = checkbox.checkboxContent
                        .nativeElement as HTMLElement;
                    expect(label.getAttribute("aria-labelledby")).toBe(
                        content.id
                    );
                    expect(content.textContent?.trim()).toBe("Visible label");
                    expect(label.getAttribute("aria-label")).toBe("Checkbox");
                    expect(label.getAttribute("aria-describedby")).toBe(
                        checkbox.hintId
                    );
                    checkbox.ariaDescribedby = "external-description";
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-describedby")).toBe(
                        `external-description ${checkbox.hintId}`
                    );

                    host.content = "Updated label";
                    fixture.detectChanges();
                    expect(content.textContent?.trim()).toBe("Updated label");

                    host.label = "Explicit label";
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-label")).toBe(
                        "Explicit label"
                    );
                    expect(label.hasAttribute("aria-labelledby")).toBeFalse();

                    host.labelledby = "external-label";
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-labelledby")).toBe(
                        "external-label"
                    );
                });

                it("exposes the focused checkbox state and keyboard changes", () => {
                    expect(label.getAttribute("role")).toBe("checkbox");
                    expect(label.getAttribute("aria-checked")).toBe("false");
                    label.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-checked")).toBe("true");

                    host.indeterminate = true;
                    host.required = true;
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-checked")).toBe("mixed");
                    expect(label.getAttribute("aria-required")).toBe("true");

                    host.disabled = true;
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-disabled")).toBe("true");
                    expect(label.getAttribute("tabindex")).toBe("-1");
                    label.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-checked")).toBe("mixed");
                });

                it("clears mixed state after a mouse click", () => {
                    host.indeterminate = true;
                    fixture.detectChanges();
                    const input = fixture.debugElement.query(
                        By.css(".nui-checkbox__input")
                    ).nativeElement as HTMLInputElement;
                    input.click();
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-checked")).toBe("true");
                });

                it("clears mixed state on space when already checked", () => {
                    host.checked = true;
                    host.indeterminate = true;
                    fixture.detectChanges();
                    label.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    fixture.detectChanges();
                    expect(label.getAttribute("aria-checked")).toBe("true");
                });
            });
        });

        describe("description relationships >", () => {
            it("should describe the focusable checkbox label", () => {
                fixture.componentRef.setInput(
                    "ariaDescribedby",
                    "checkbox-instructions checkbox-error"
                );
                fixture.detectChanges();

                expect(
                    subject.checkboxLabel.nativeElement.getAttribute(
                        "aria-describedby"
                    )
                ).toBe("checkbox-instructions checkbox-error");
                expect(
                    subject.checkboxLabel.nativeElement.getAttribute("tabindex")
                ).toBe("0");
            });

            it("should update and remove focusable label description references", () => {
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

                expect(
                    subject.checkboxLabel.nativeElement.getAttribute(
                        "aria-describedby"
                    )
                ).toBe("updated-instructions");

                fixture.componentRef.setInput("ariaDescribedby", null);
                fixture.detectChanges();
                expect(
                    subject.checkboxLabel.nativeElement.hasAttribute(
                        "aria-describedby"
                    )
                ).toBeFalse();
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
