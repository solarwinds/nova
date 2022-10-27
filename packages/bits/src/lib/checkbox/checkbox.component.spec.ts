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
