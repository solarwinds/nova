import { CommonModule } from "@angular/common";
import { Component, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NuiFormFieldModule } from "../../nui-api";
import { SpinnerComponent } from "../spinner/spinner.component";

import { TextboxComponent } from "./textbox.component";

@Component({
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
        let testComponent: TextboxComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TextboxComponent,
                    SpinnerComponent,
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxComponent);
            testComponent = fixture.componentInstance;

            fixture.detectChanges();
        });

        describe("general > ", () => {
            it("should set focus on textbox programmatically", () => {
                expect(testComponent.textboxInput.nativeElement).not.toBe(document.activeElement);

                testComponent.focus();
                expect(testComponent.textboxInput.nativeElement).toBe(document.activeElement);
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
                ],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxFormComponent);
            testComponent = fixture.componentInstance;
            fixture.detectChanges();
        });

        describe("reactive form > ", () => {
            it("shouldn't emit valueChanges on blur", () => {
                const callback = () => {};
                const spy = jasmine.createSpy("valueChangesSpy", callback).and.callThrough();
                const textbox = testComponent.input.textboxInput.nativeElement as HTMLInputElement;

                testComponent.form.valueChanges.subscribe(spy);

                textbox.dispatchEvent(new Event("focus"));
                textbox.dispatchEvent(new Event("blur"));

                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
});
