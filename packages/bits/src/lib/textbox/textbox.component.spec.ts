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

import { CommonModule } from "@angular/common";
import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TextboxComponent } from "./textbox.component";
import { NuiFormFieldModule, NuiValidationMessageModule } from "../../nui-api";
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
    template: `
        <div [formGroup]="form">
            <span id="dashboard-guidance">Keep the name recognizable</span>
            <nui-form-field
                [control]="form.controls['input']"
                [caption]="caption"
                [hint]="hint">
                @if (showTextbox) {
                    <nui-textbox
                        formControlName="input"
                        [ariaDescribedby]="description"
                        ariaLabel="Dashboard name"></nui-textbox>
                }
                <nui-validation-message for="required" [show]="false">
                    This is required
                </nui-validation-message>
            </nui-form-field>
        </div>
    `,
    standalone: false,
})
class TextboxFormComponent {
    @ViewChild(TextboxComponent) input: TextboxComponent;

    public caption: string;
    public hint: string;
    public description: string;
    public showTextbox = true;

    public form = this.fb.group({
        input: this.fb.control(""),
    });

    constructor(private fb: FormBuilder) {}
}

describe("components >", () => {
    describe("textbox >", () => {
        let fixture: ComponentFixture<TextboxComponent>;
        let testComponent: TextboxComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TextboxComponent, SpinnerComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxComponent);
            testComponent = fixture.componentInstance;

            fixture.detectChanges();
        });

        describe("general > ", () => {
            it("should set focus on textbox programmatically", () => {
                expect(testComponent.textboxInput.nativeElement).not.toBe(
                    document.activeElement
                );

                testComponent.focus();
                expect(testComponent.textboxInput.nativeElement).toBe(
                    document.activeElement
                );
            });

            it("should update the native input value when writeValue is called", () => {
                testComponent.writeValue("formatted value");

                expect(testComponent.textboxInput.nativeElement.value).toBe(
                    "formatted value"
                );
            });
        });
    });
});

describe("components >", () => {
    describe("textbox >", () => {
        let fixture: ComponentFixture<TextboxFormComponent>;
        let testComponent: TextboxFormComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TextboxComponent,
                    TextboxFormComponent,
                    SpinnerComponent,
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NuiFormFieldModule,
                    NuiValidationMessageModule,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxFormComponent);
            testComponent = fixture.componentInstance;
        });

        describe("reactive form > ", () => {
            function renderFormField(): void {
                fixture.changeDetectorRef.markForCheck();
                fixture.detectChanges();
                tick();
                fixture.changeDetectorRef.markForCheck();
                fixture.detectChanges();
            }

            it("preserves an explicit textbox name inside a captionless form field", fakeAsync(() => {
                renderFormField();

                expect(testComponent.input.ariaLabel).toBe("Dashboard name");
                expect(
                    testComponent.input.textboxInput.nativeElement.getAttribute(
                        "aria-label"
                    )
                ).toBe("Dashboard name");
            }));

            it("preserves an explicit textbox name when the form field caption is empty", fakeAsync(() => {
                testComponent.caption = "";
                renderFormField();

                expect(
                    testComponent.input.textboxInput.nativeElement.getAttribute(
                        "aria-label"
                    )
                ).toBe("Dashboard name");
            }));

            it("continues to name the textbox from a supplied form field caption", fakeAsync(() => {
                testComponent.caption = "Dashboard title";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                const label = fixture.nativeElement.querySelector("label");

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard title"
                );
                expect(label.textContent.trim()).toBe("Dashboard title");
                expect(label.htmlFor).toBe(textbox.id);
            }));

            it("updates the textbox name with its caption and restores the explicit name when cleared", fakeAsync(() => {
                testComponent.caption = "Dashboard title";
                renderFormField();

                testComponent.caption = "Dashboard display name";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard display name"
                );
                expect(
                    fixture.nativeElement
                        .querySelector("label")
                        .textContent.trim()
                ).toBe("Dashboard display name");

                testComponent.caption = "";
                renderFormField();

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard name"
                );
                expect(fixture.nativeElement.querySelector("label")).toBeNull();
            }));

            it("associates the visible form field hint with the native textbox", fakeAsync(() => {
                testComponent.hint = "Use a name that describes this dashboard";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                const help = fixture.nativeElement.querySelector(
                    ".nui-form-field__help"
                );

                expect(help.id).not.toBe("");
                expect(textbox.getAttribute("aria-describedby")).toBe(help.id);
                expect(help.textContent.trim()).toBe(testComponent.hint);
            }));

            it("preserves caller description references when field help changes", fakeAsync(() => {
                testComponent.description = "dashboard-guidance";
                testComponent.hint = "Use a descriptive name";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                const help = fixture.nativeElement.querySelector(
                    ".nui-form-field__help"
                );
                expect(textbox.getAttribute("aria-describedby")).toBe(
                    `dashboard-guidance ${help.id}`
                );

                testComponent.hint = "";
                renderFormField();

                expect(textbox.getAttribute("aria-describedby")).toBe(
                    "dashboard-guidance"
                );
                expect(help.textContent.trim()).toBe("");
            }));

            it("associates validation only while a message is shown", fakeAsync(() => {
                renderFormField();
                const textbox = testComponent.input.textboxInput.nativeElement;
                const help = fixture.nativeElement.querySelector(
                    ".nui-form-field__help"
                );
                expect(textbox.hasAttribute("aria-describedby")).toBeFalse();

                testComponent.form.controls.input.setErrors({ required: true });
                renderFormField();
                expect(textbox.getAttribute("aria-describedby")).toBe(help.id);
                expect(help.textContent.trim()).toBe("This is required");

                testComponent.form.controls.input.setErrors(null);
                renderFormField();
                expect(textbox.hasAttribute("aria-describedby")).toBeFalse();
                expect(help.textContent.trim()).toBe("");
            }));

            it("names and describes a control created after the form field and its replacement", fakeAsync(() => {
                testComponent.showTextbox = false;
                testComponent.caption = "Initial caption";
                testComponent.hint = "Use a descriptive name";
                renderFormField();

                testComponent.caption = "Current caption";
                testComponent.showTextbox = true;
                renderFormField();
                const originalTextbox = testComponent.input;
                expect(originalTextbox.ariaLabel).toBe("Current caption");
                expect(
                    originalTextbox.textboxInput.nativeElement.getAttribute(
                        "aria-describedby"
                    )
                ).toBe(
                    fixture.nativeElement.querySelector(".nui-form-field__help")
                        .id
                );

                testComponent.showTextbox = false;
                renderFormField();
                testComponent.caption = "Replacement caption";
                testComponent.showTextbox = true;
                renderFormField();
                expect(testComponent.input).not.toBe(originalTextbox);
                expect(testComponent.input.ariaLabel).toBe(
                    "Replacement caption"
                );
                expect(testComponent.input.textboxInput.nativeElement.id).toBe(
                    fixture.nativeElement.querySelector("label").htmlFor
                );
            }));

            it("shouldn't emit valueChanges on blur", () => {
                fixture.detectChanges();
                const callback = () => {};
                const spy = jasmine
                    .createSpy("valueChangesSpy", callback)
                    .and.callThrough();
                const textbox = testComponent.input.textboxInput
                    .nativeElement as HTMLInputElement;

                testComponent.form.valueChanges.subscribe(spy);

                textbox.dispatchEvent(new Event("focus"));
                textbox.dispatchEvent(new Event("blur"));

                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
