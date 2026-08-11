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

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NuiTabsModule } from "../tabs.module";

@Component({
    selector: "nui-test-tab-group",
    template: `
        <nui-tab-group>
            <nui-tab heading="First">Content 1</nui-tab>
            <nui-tab heading="Second">Content 2</nui-tab>
            <nui-tab heading="Disabled" [disabled]="true">Content 3</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestTabGroupComponent {}

describe("components >", () => {
    describe("tab-group >", () => {
        let fixture: ComponentFixture<TestTabGroupComponent>;
        let el: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [TestTabGroupComponent],
                imports: [NuiTabsModule],
            });

            fixture = TestBed.createComponent(TestTabGroupComponent);
            fixture.detectChanges();
            el = fixture.nativeElement;
        });

        describe("ARIA attributes >", () => {
            it("should have role=tablist on the tabs container", () => {
                const tablist = el.querySelector(".nui-tabs__container");
                expect(tablist?.getAttribute("role")).toBe("tablist");
            });

            it("should have role=tab on each tab link", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                tabLinks.forEach((link) => {
                    expect(link.getAttribute("role")).toBe("tab");
                });
            });

            it("should set aria-selected=true on the active tab", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[0].getAttribute("aria-selected")).toBe("true");
            });

            it("should set aria-selected=false on inactive tabs", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[1].getAttribute("aria-selected")).toBe("false");
            });

            it("should set aria-disabled on disabled tab", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[2].getAttribute("aria-disabled")).toBe("true");
            });

            it("should not set aria-disabled on enabled tabs", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[0].getAttribute("aria-disabled")).toBeNull();
            });
        });

        describe("tabindex >", () => {
            it("should have tabindex=0 on enabled tab links", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[0].getAttribute("tabindex")).toBe("0");
                expect(tabLinks[1].getAttribute("tabindex")).toBe("0");
            });

            it("should have tabindex=-1 on disabled tab link", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[2].getAttribute("tabindex")).toBe("-1");
            });
        });

        describe("keyboard interaction >", () => {
            it("should select tab on Enter keydown", () => {
                const tabLinks = el.querySelectorAll<HTMLElement>(".tab-link");

                // Second tab is initially inactive
                expect(tabLinks[1].getAttribute("aria-selected")).toBe("false");

                tabLinks[1].dispatchEvent(
                    new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true })
                );
                fixture.detectChanges();

                expect(tabLinks[1].getAttribute("aria-selected")).toBe("true");
                expect(tabLinks[0].getAttribute("aria-selected")).toBe("false");
            });

            it("should NOT select disabled tab on Enter keydown", () => {
                const tabLinks = el.querySelectorAll<HTMLElement>(".tab-link");
                const disabledTab = tabLinks[2];

                disabledTab.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true })
                );
                fixture.detectChanges();

                expect(disabledTab.getAttribute("aria-selected")).toBe("false");
                // First tab should still be active
                expect(tabLinks[0].getAttribute("aria-selected")).toBe("true");
            });
        });
    });
});
