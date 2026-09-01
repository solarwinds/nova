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

import { ChangeDetectorRef, Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SwitchComponent } from "./switch.component";

import createSpy = jasmine.createSpy;
import Spy = jasmine.Spy;

@Component({
    template: "<nui-switch id=\"public-switch-id\">Refresh widget</nui-switch>",
    standalone: false,
})
class SwitchHostComponent {}

describe("components >", () => {
    describe("switch >", () => {
        let switchFixture: ComponentFixture<SwitchComponent>;
        let nuiSwitch: SwitchComponent;
        let valueChange: Spy;
        let touched: Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [SwitchComponent, SwitchHostComponent],
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
            it("should set aria-labelledby when a projected label is provided", () => {
                const hostFixture =
                    TestBed.createComponent(SwitchHostComponent);
                hostFixture.detectChanges();

                const switchBar = hostFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;
                const label = hostFixture.nativeElement.querySelector(
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

            it("should keep the public id on the host element only", () => {
                const hostFixture =
                    TestBed.createComponent(SwitchHostComponent);
                hostFixture.detectChanges();

                const host = hostFixture.nativeElement.querySelector(
                    "nui-switch"
                ) as HTMLElement;
                const switchBar = hostFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;

                expect(host.id).toBe("public-switch-id");
                expect(switchBar.id).toBe("");
                expect(
                    hostFixture.nativeElement.querySelectorAll(
                        "#public-switch-id"
                    ).length
                ).toBe(1);
            });

            it("should use a fallback name without projected content", () => {
                switchFixture.detectChanges();

                const switchBar = switchFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;

                expect(switchBar.getAttribute("aria-label")).toBe("Switch");
                expect(switchBar.getAttribute("aria-labelledby")).toBeNull();
            });

            it("should toggle with Enter and Space", () => {
                switchFixture.detectChanges();
                const switchBar = switchFixture.nativeElement.querySelector(
                    ".nui-switch__bar"
                ) as HTMLElement;

                switchBar.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        bubbles: true,
                    })
                );
                expect(nuiSwitch.value).toBeTrue();

                switchBar.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: " ",
                        bubbles: true,
                    })
                );
                expect(nuiSwitch.value).toBeFalse();
            });
        });
    });
});
