import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CheckboxComponent } from "./checkbox.component";

describe("components >", () => {
    describe("checkbox >", () => {
        let fixture: ComponentFixture<CheckboxComponent>;
        let subject: CheckboxComponent;
        let checkboxInput: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [CheckboxComponent],
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
        });

        describe("output handling logic >", () => {
            it("should output emit event if clicked", () => {
                spyOn(subject.valueChange, "emit").and.callThrough();
                checkboxInput.click();
                expect(subject.valueChange.emit).toHaveBeenCalled();
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
