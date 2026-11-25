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
import {
    ChangeDetectionStrategy,
    Component,
    NO_ERRORS_SCHEMA,
    ViewChild,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { TextboxComponent } from "./textbox.component";
import {
    NuiFormFieldModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
} from "../../nui-api";
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
                        [id]="controlId"
                        [ariaDescribedby]="description"
                        [ariaLabel]="ariaLabel"></nui-textbox>
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
    public ariaLabel = "Dashboard name";
    public hint: string;
    public description: string;
    public controlId: string;
    public showTextbox = true;

    public form = this.fb.group({
        input: this.fb.control(""),
    });

    constructor(private fb: FormBuilder) {}
}

@Component({
    template: `
        <nui-form-field [caption]="caption" [hint]="hint">
            <nui-textbox type="password"></nui-textbox>
        </nui-form-field>
        <nui-form-field caption="Count">
            <nui-textbox-number [ariaLabel]="numberLabel"></nui-textbox-number>
        </nui-form-field>
        <button data-test="update" (click)="caption = 'Secret'; hint = 'Updated hint'">
            Update
        </button>
        <button data-test="clear" (click)="caption = ''">Clear caption</button>
        <button data-test="number-name" (click)="numberLabel = 'Count of retries'">Set numeric name</button>
        <button data-test="clear-number-name" (click)="numberLabel = ''">Clear numeric name</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class OnPushTextboxFormComponent {
    public caption = "Password";
    public hint = "Use a password";
    public numberLabel: string;
}

@Component({
    template: `
        <div [formGroup]="form">
            @if (showPasswords) {
                <nui-form-field caption="Password / Key" [control]="form.controls.authentication">
                    <nui-textbox
                        type="password"
                        formControlName="authentication"
                        ariaDescribedby="authentication-description"></nui-textbox>
                    <span id="authentication-description">Authentication guidance</span>
                </nui-form-field>
                <nui-form-field caption="Password / Key" [control]="form.controls.privacy">
                    <nui-textbox
                        type="password"
                        formControlName="privacy"
                        ariaDescribedby="privacy-description"></nui-textbox>
                    <span id="privacy-description">Privacy guidance</span>
                </nui-form-field>
            }
        </div>
        <button data-test="show" (click)="showPasswords = true">Show</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class OnPushPasswordFieldsComponent {
    public showPasswords = false;
    public form = this.fb.group({
        authentication: this.fb.control(""),
        privacy: this.fb.control({ value: "", disabled: true }),
    });

    constructor(private fb: FormBuilder) {}
}

async function waitForFieldUpdate<T>(
    fixture: ComponentFixture<T>
): Promise<void> {
    await fixture.whenStable();
    await new Promise<void>(resolve => setTimeout(resolve));
    await fixture.whenStable();
}

describe("form fields in an OnPush host", () => {
    it("associates both conditionally rendered password captions with their own inputs", async () => {
        TestBed.configureTestingModule({
            declarations: [OnPushPasswordFieldsComponent],
            imports: [
                CommonModule,
                ReactiveFormsModule,
                NuiFormFieldModule,
                NuiTextboxModule,
            ],
        });
        const fixture = TestBed.createComponent(OnPushPasswordFieldsComponent);
        fixture.autoDetectChanges();
        await waitForFieldUpdate(fixture);
        const host: HTMLElement = fixture.nativeElement;
        host.querySelector<HTMLButtonElement>("[data-test=show]")?.click();
        await waitForFieldUpdate(fixture);

        const fields = host.querySelectorAll("nui-form-field");
        expect(fields.length).toBe(2);
        const ids = Array.from(fields, (field, index) => {
            const label = field.querySelector<HTMLLabelElement>(
                ".nui-form-field__control-label"
            );
            const input = field.querySelector<HTMLInputElement>("input");
            expect(input).not.toBeNull();
            expect(label?.control).toBe(input);
            expect(input?.id).toBeTruthy();
            expect(input?.getAttribute("aria-label")).toBe("Password / Key");
            expect(input?.getAttribute("aria-describedby")).toBe(
                index === 0
                    ? "authentication-description"
                    : "privacy-description"
            );
            expect(input?.disabled).toBe(index === 1);
            return input?.id;
        });
        expect(ids[0]).not.toBe(ids[1]);
    });

    it("renders the deferred label, name, and description for each control", async () => {
        TestBed.configureTestingModule({
            declarations: [OnPushTextboxFormComponent],
            imports: [NuiFormFieldModule, NuiTextboxModule],
        });
        const fixture = TestBed.createComponent(OnPushTextboxFormComponent);
        fixture.autoDetectChanges();
        await waitForFieldUpdate(fixture);

        const host: HTMLElement = fixture.nativeElement;
        const fields = host.querySelectorAll("nui-form-field");
        const passwordInput = fields[0].querySelector("input");
        const passwordLabel = fields[0].querySelector("label");
        const help = fields[0].querySelector<HTMLElement>(
            ".nui-form-field__help"
        );
        const numberInput = fields[1].querySelector("input");
        const numberLabel = fields[1].querySelector("label");

        expect(passwordInput?.getAttribute("aria-label")).toBe("Password");
        expect(passwordLabel?.control).toBe(passwordInput);
        expect(passwordInput?.getAttribute("aria-describedby")).toBe(help?.id);
        expect(numberInput?.getAttribute("aria-label")).toBe("Count");
        expect(numberLabel?.control).toBe(numberInput);
        expect(numberInput?.hasAttribute("aria-describedby")).toBeFalse();
    });

    it("updates and clears the caption and hint under an OnPush host", async () => {
        TestBed.configureTestingModule({
            declarations: [OnPushTextboxFormComponent],
            imports: [NuiFormFieldModule, NuiTextboxModule],
        });
        const fixture = TestBed.createComponent(OnPushTextboxFormComponent);
        fixture.autoDetectChanges();
        await waitForFieldUpdate(fixture);

        const host: HTMLElement = fixture.nativeElement;
        const input = host.querySelector<HTMLInputElement>("nui-textbox input");
        host.querySelector<HTMLButtonElement>("[data-test=update]")?.click();
        await waitForFieldUpdate(fixture);

        expect(input?.getAttribute("aria-label")).toBe("Secret");
        expect(
            host.querySelector("nui-form-field label")?.textContent?.trim()
        ).toBe("Secret");
        expect(
            host.querySelector<HTMLLabelElement>("nui-form-field label")
                ?.control
        ).toBe(input);
        expect(
            host.querySelector(".nui-form-field__help")?.textContent
        ).toContain("Updated hint");
        expect(input?.getAttribute("aria-describedby")).toBe(
            host.querySelector<HTMLElement>(".nui-form-field__help")?.id
        );

        host.querySelector<HTMLButtonElement>("[data-test=clear]")?.click();
        await waitForFieldUpdate(fixture);

        expect(input?.getAttribute("aria-label")).toBe("Textbox input");
        expect(
            host.querySelector("nui-form-field")?.querySelector("label")
        ).toBeNull();
    });

    it("uses a changing explicit numeric name and falls back to the caption", async () => {
        TestBed.configureTestingModule({
            declarations: [OnPushTextboxFormComponent],
            imports: [NuiFormFieldModule, NuiTextboxModule],
        });
        const fixture = TestBed.createComponent(OnPushTextboxFormComponent);
        fixture.autoDetectChanges();
        await waitForFieldUpdate(fixture);
        const input = fixture.nativeElement.querySelector(
            "nui-textbox-number input"
        ) as HTMLInputElement;

        fixture.nativeElement.querySelector("[data-test=number-name]").click();
        await waitForFieldUpdate(fixture);
        expect(input.getAttribute("aria-label")).toBe("Count of retries");

        fixture.nativeElement
            .querySelector("[data-test=clear-number-name]")
            .click();
        await waitForFieldUpdate(fixture);
        expect(input.getAttribute("aria-label")).toBe("Count");
    });
});

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

            it("uses the caption when no explicit textbox name is provided", fakeAsync(() => {
                testComponent.caption = "Dashboard title";
                testComponent.ariaLabel = "";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                const label = fixture.nativeElement.querySelector("label");

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard title"
                );
                expect(label.textContent.trim()).toBe("Dashboard title");
                expect(label.htmlFor).toBe(textbox.id);
            }));

            it("renders deferred field names and descriptions without a manual detection pass", async () => {
                testComponent.caption = "Dashboard title";
                testComponent.ariaLabel = "";
                testComponent.hint = "Choose a recognizable title";
                fixture.autoDetectChanges();
                await new Promise<void>(resolve => setTimeout(resolve));
                await waitForFieldUpdate(fixture);

                const textbox = testComponent.input.textboxInput.nativeElement;
                const help = fixture.nativeElement.querySelector(
                    ".nui-form-field__help"
                );
                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard title"
                );
                expect(textbox.getAttribute("aria-describedby")).toBe(help.id);

                testComponent.caption = "Dashboard display name";
                testComponent.hint = "";
                fixture.changeDetectorRef.markForCheck();
                await waitForFieldUpdate(fixture);
                await new Promise<void>(resolve => setTimeout(resolve));
                await waitForFieldUpdate(fixture);

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard display name"
                );
                expect(textbox.hasAttribute("aria-describedby")).toBe(false);
            });

            it("preserves explicit names across caption changes and uses the caption when cleared", fakeAsync(() => {
                testComponent.caption = "Dashboard title";
                testComponent.ariaLabel = "Dashboard title for reporting";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard title for reporting"
                );

                testComponent.ariaLabel =
                    "Dashboard display name for reporting";
                testComponent.caption = "Dashboard display name";
                renderFormField();

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard display name for reporting"
                );
                expect(
                    fixture.nativeElement
                        .querySelector("label")
                        .textContent.trim()
                ).toBe("Dashboard display name");

                testComponent.ariaLabel = "";
                renderFormField();

                expect(textbox.getAttribute("aria-label")).toBe(
                    "Dashboard display name"
                );

                testComponent.caption = "";
                testComponent.ariaLabel = "Dashboard name";
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

            it("merges changing caller descriptions and preserves a changed control id", fakeAsync(() => {
                testComponent.description = "first-description";
                testComponent.hint = "Field help";
                renderFormField();

                const textbox = testComponent.input.textboxInput.nativeElement;
                const help = fixture.nativeElement.querySelector(
                    ".nui-form-field__help"
                );
                expect(textbox.getAttribute("aria-describedby")).toBe(
                    `first-description ${help.id}`
                );

                testComponent.description = "second-description";
                testComponent.controlId = "consumer-control-id";
                testComponent.caption = "Dashboard";
                renderFormField();
                expect(textbox.getAttribute("aria-describedby")).toBe(
                    `second-description ${help.id}`
                );
                expect(textbox.id).toBe("consumer-control-id");
                expect(
                    fixture.nativeElement.querySelector("label").control
                ).toBe(textbox);

                testComponent.description = "";
                renderFormField();
                expect(textbox.getAttribute("aria-describedby")).toBe(help.id);

                testComponent.hint = "";
                renderFormField();
                expect(textbox.hasAttribute("aria-describedby")).toBeFalse();
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
                testComponent.ariaLabel = "";
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
