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

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { CheckboxComponent } from "./checkbox.component";

describe("components >", () => {
    describe("checkbox >", () => {
        let fixture: ComponentFixture<CheckboxComponent>;
        let subject: CheckboxComponent;
        let checkboxInput: HTMLInputElement;

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
