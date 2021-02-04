import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NuiFormFieldModule } from "../../nui-api";
import { SpinnerComponent } from "../spinner/spinner.component";

import { TextboxComponent } from "./textbox.component";

@Component({
    selector: "textbox-form-component",
    template: `
        <div [formGroup]="form">
            <nui-form-field [control]="form.controls['input']">
                <nui-textbox formControlName="input"></nui-textbox>
            </nui-form-field>
        </div>
    `,
})
class TextboxFormComponent {

    @ViewChild(TextboxComponent) input: TextboxComponent;

    public form = this.fb.group({
        input: this.fb.control(""),
    });

    constructor(private fb: FormBuilder) {
    }
}

describe("components >", () => {
    describe("textbox >", () => {

        let fixture: ComponentFixture<TextboxComponent>;
        let formFixture: ComponentFixture<TextboxFormComponent>;
        let testComponent: TextboxComponent;
        let testFormComponent: TextboxFormComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    NuiFormFieldModule,
                ],
                declarations: [
                    TextboxComponent,
                    TextboxFormComponent,
                    SpinnerComponent,
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxComponent);
            testComponent = fixture.componentInstance;

            formFixture = TestBed.createComponent(TextboxFormComponent);
            testFormComponent = formFixture.componentInstance;

            fixture.detectChanges();
            formFixture.detectChanges();
        });

        describe("general > ", () => {
            it("should set focus on textbox programmatically", () => {
                expect(testComponent.textboxInput.nativeElement).not.toBe(document.activeElement);

                testComponent.focus();
                expect(testComponent.textboxInput.nativeElement).toBe(document.activeElement);
            });

            it("shouldn't emit valueChanges on blur", () => {
                const callback = () => {};
                const spy = jasmine.createSpy("valueChangesSpy", callback).and.callThrough();
                const textbox = testFormComponent.input.textboxInput.nativeElement as HTMLInputElement;

                testFormComponent.form.valueChanges.subscribe(spy);

                textbox.dispatchEvent(new Event("focus"));
                textbox.dispatchEvent(new Event("blur"));

                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
