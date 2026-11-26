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

import { ContentObserver } from "@angular/cdk/observers";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { firstValueFrom } from "rxjs";

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
    it("references matching caption and projected text only once", async () => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, CheckboxFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
        const fixture = TestBed.createComponent(CheckboxFormFieldHostComponent);
        const host = fixture.componentInstance;
        host.caption = "  CHECKBOX \n";
        host.content = "Checkbox ";
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const checkbox = fixture.debugElement.query(
            By.directive(CheckboxComponent)
        ).componentInstance as CheckboxComponent;
        const input = checkbox.inputViewContainer.element
            .nativeElement as HTMLInputElement;
        const caption = fixture.nativeElement.querySelector(
            ".nui-form-field__control-label"
        ) as HTMLLabelElement;
        const contentId = checkbox.contentId;
        const bothIds = `${caption.id} ${contentId}`;
        expect(input.getAttribute("aria-labelledby"))
            .withContext("matching initial caption")
            .toBe(contentId);

        host.caption = "Different caption";
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(input.getAttribute("aria-labelledby"))
            .withContext("different caption")
            .toBe(bothIds);

        host.caption = "\t checkbox ";
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(input.getAttribute("aria-labelledby"))
            .withContext("caption changed to a normalized match")
            .toBe(contentId);

        const emptyContentChange = firstValueFrom(
            TestBed.inject(ContentObserver).observe(
                checkbox.checkboxContent.nativeElement
            )
        );
        host.content = "";
        fixture.detectChanges();
        await emptyContentChange;
        fixture.detectChanges();
        expect(input.getAttribute("aria-labelledby"))
            .withContext("empty projected text")
            .toBe(bothIds);

        const matchingContentChange = firstValueFrom(
            TestBed.inject(ContentObserver).observe(
                checkbox.checkboxContent.nativeElement
            )
        );
        host.content = "  CHECKBOX\n";
        fixture.detectChanges();
        await matchingContentChange;
        fixture.detectChanges();
        expect(input.getAttribute("aria-labelledby"))
            .withContext("projected text changed to a normalized match")
            .toBe(contentId);
    });

    it("observes projected text only while the form field has a caption", fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, CheckboxFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
        const observe = spyOn(
            TestBed.inject(ContentObserver),
            "observe"
        ).and.callThrough();
        const fixture = TestBed.createComponent(CheckboxFormFieldHostComponent);
        fixture.componentInstance.caption = "";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(observe).not.toHaveBeenCalled();

        fixture.componentInstance.caption = "Convert to";
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expect(observe).toHaveBeenCalledTimes(1);
    }));

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
        const label = checkbox.inputViewContainer.element
            .nativeElement as HTMLInputElement;
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
            ".nui-checkbox__input"
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

            it("keeps the public default label without overriding projected names", () => {
                expect(subject.ariaLabel).toBe("Checkbox");
                expect(subject.labelIds).toBe(subject.contentId);
                subject.ariaLabel = "Custom name";
                expect(subject.ariaLabel).toBe("Custom name");
                expect(subject.labelIds).toBeNull();
                subject.ariaLabel = "";
                expect(subject.ariaLabel).toBe("");
                expect(subject.labelIds).toBe(subject.contentId);
                subject.ariaLabel = undefined;
                expect(subject.ariaLabel).toBe("Checkbox");
                expect(subject.labelIds).toBe(subject.contentId);
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
                let label: HTMLInputElement;

                beforeEach(() => {
                    fixture = TestBed.createComponent(CheckboxHostComponent);
                    host = fixture.componentInstance;
                    fixture.detectChanges();
                    checkbox = fixture.debugElement.query(
                        By.directive(CheckboxComponent)
                    ).componentInstance;
                    label = checkbox.inputViewContainer.element.nativeElement;
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
                    expect(label.checked).toBeFalse();
                    label.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                            cancelable: true,
                        })
                    );
                    fixture.detectChanges();
                    expect(label.checked).toBeTrue();

                    host.indeterminate = true;
                    host.required = true;
                    fixture.detectChanges();
                    expect(label.indeterminate).toBeTrue();
                    expect(label.required).toBeTrue();

                    host.disabled = true;
                    fixture.detectChanges();
                    expect(label.disabled).toBeTrue();
                    label.dispatchEvent(
                        new KeyboardEvent("keydown", {
                            code: "Space",
                            bubbles: true,
                        })
                    );
                    fixture.detectChanges();
                    expect(label.indeterminate).toBeTrue();
                });

                it("clears mixed state after a mouse click", () => {
                    host.indeterminate = true;
                    fixture.detectChanges();
                    const input = fixture.debugElement.query(
                        By.css(".nui-checkbox__input")
                    ).nativeElement as HTMLInputElement;
                    input.click();
                    fixture.detectChanges();
                    expect(label.checked).toBeTrue();
                    expect(label.indeterminate).toBeFalse();
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
                    expect(label.checked).toBeTrue();
                    expect(label.indeterminate).toBeFalse();
                });
            });
        });

        describe("description relationships >", () => {
            it("should describe the focusable checkbox input", () => {
                fixture.componentRef.setInput(
                    "ariaDescribedby",
                    "checkbox-instructions checkbox-error"
                );
                fixture.detectChanges();

                expect(checkboxInput.getAttribute("aria-describedby")).toBe(
                    "checkbox-instructions checkbox-error"
                );
                expect(checkboxInput.tabIndex).toBe(0);
                expect(
                    subject.checkboxLabel.nativeElement.hasAttribute("role")
                ).toBeFalse();
                expect(checkboxInput.hasAttribute("aria-checked")).toBeFalse();
                expect(checkboxInput.hasAttribute("id")).toBeFalse();
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
