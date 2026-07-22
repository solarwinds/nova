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

import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SwitchComponent } from "./switch.component";

import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

describe("components >", () => {
    describe("switch >", () => {
        let switchFixture: ComponentFixture<SwitchComponent>;
        let nuiSwitch: SwitchComponent;
        let valueChange: Spy;
        let touched: Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [SwitchComponent],
                providers: [ChangeDetectorRef],
            });

            switchFixture = TestBed.createComponent(SwitchComponent);
            nuiSwitch = switchFixture.componentInstance;

            valueChange = createSpy("valueChange");
            nuiSwitch.valueChange.subscribe(valueChange);
            touched = createSpy("touched");
            nuiSwitch.registerOnTouched(touched);
        });

        describe("toggle >", () => {
            it("should toggle", () => {
                nuiSwitch.value = true;

                nuiSwitch.toggle();
                expect(valueChange).toHaveBeenCalledWith(false);
                expect(touched).toHaveBeenCalledTimes(1);

                nuiSwitch.value = false;
                nuiSwitch.toggle();
                expect(valueChange).toHaveBeenCalledWith(true);
                expect(touched).toHaveBeenCalledTimes(2);
            });

            it("should not toggle when inactive", () => {
                nuiSwitch.value = true;
                nuiSwitch.setDisabledState(true);

                nuiSwitch.toggle();
                expect(valueChange).not.toHaveBeenCalled();
                expect(touched).not.toHaveBeenCalled();
            });
        });

        describe("accessibility >", () => {
            it("should set aria-labelledby when ariaLabel is not provided", () => {
                switchFixture.detectChanges();

                const switchBar = switchFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;
                const label = switchFixture.nativeElement.querySelector(
                    ".nui-switch__label"
                ) as HTMLElement;

                expect(switchBar.getAttribute("aria-label")).toBeNull();
                expect(switchBar.getAttribute("aria-labelledby")).toBe(
                    label.getAttribute("id")
                );
                expect(label.getAttribute("id")).toContain("nui-switch-label-");
            });

            it("should set aria-label when ariaLabel is provided", () => {
                nuiSwitch.ariaLabel = "Refresh widget periodically";
                switchFixture.detectChanges();

                const switchBar = switchFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;

                expect(switchBar.getAttribute("aria-label")).toBe(
                    "Refresh widget periodically"
                );
                expect(switchBar.getAttribute("aria-labelledby")).toBeNull();
            });
        });

        describe("keyboard interaction >", () => {
            let switchBar: HTMLElement;

            beforeEach(() => {
                nuiSwitch.value = false;
                switchFixture.detectChanges();
                switchBar = switchFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;
            });

            it("should toggle when Space is pressed (keydown)", () => {
                switchBar.dispatchEvent(
                    new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true })
                );
                expect(valueChange).toHaveBeenCalledWith(true);
            });

            it("should NOT toggle when Enter is pressed", () => {
                switchBar.dispatchEvent(
                    new KeyboardEvent("keydown", { code: "Enter", bubbles: true })
                );
                expect(valueChange).not.toHaveBeenCalled();
            });

            it("should NOT toggle when disabled and Space is pressed", () => {
                nuiSwitch.setDisabledState(true);
                switchBar.dispatchEvent(
                    new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true })
                );
                expect(valueChange).not.toHaveBeenCalled();
            });
        });
    });
});
