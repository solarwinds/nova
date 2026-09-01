// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Component, QueryList, ViewChildren } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabComponent } from "../tab/tab.component";
import { NuiTabsModule } from "../tabs.module";

@Component({
    template: `
        <nui-tab-group [vertical]="vertical">
            <nui-tab tabId="first" heading="First">First content</nui-tab>
            <nui-tab tabId="second" heading="Second" [disabled]="secondDisabled">Second content</nui-tab>
            <nui-tab tabId="third" heading="Third">Third content</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestTabGroupComponent {
    public vertical = false;
    public secondDisabled = false;
    @ViewChildren(TabComponent) public tabs: QueryList<TabComponent>;
}

describe("components > tab group", () => {
    let componentFixture: ComponentFixture<TestTabGroupComponent>;
    let subject: TestTabGroupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NuiTabsModule],
            declarations: [TestTabGroupComponent],
        });
        componentFixture = TestBed.createComponent(TestTabGroupComponent);
        subject = componentFixture.componentInstance;
        componentFixture.detectChanges();
    });

    it("should connect every tab to its panel and set panel tabindex", () => {
        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");
        const panels =
            componentFixture.nativeElement.querySelectorAll(
                "[role='tabpanel']"
            );

        expect(tabs.length).toBe(3);
        expect(panels.length).toBe(3);

        tabs.forEach((tab: HTMLElement, index: number) => {
            const tabComponent = subject.tabs.toArray()[index];
            const panel = panels[index] as HTMLElement;

            expect(tab.id).toBe(`tab-${tabComponent.tabId}`);
            expect(tab.getAttribute("aria-controls")).toBe(panel.id);
            expect(panel.id).toBe(`panel-${tabComponent.tabId}`);
            expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
        });

        expect(panels[0].getAttribute("tabindex")).toBe("0");
        expect(panels[1].getAttribute("tabindex")).toBe("-1");
        expect(panels[2].getAttribute("tabindex")).toBe("-1");
    });

    it("should move focus with arrows, Home, and End including wrap-around", () => {
        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");

        tabs[0].focus();
        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowRight",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[1]);

        tabs[1].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowRight",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[2]);

        // Wrap around from last to first
        tabs[2].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowRight",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[0]);

        // Wrap around from first to last with ArrowLeft
        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowLeft",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[2]);

        tabs[2].dispatchEvent(
            new KeyboardEvent("keydown", { code: "Home", bubbles: true })
        );
        expect(document.activeElement).toBe(tabs[0]);

        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", { code: "End", bubbles: true })
        );
        expect(document.activeElement).toBe(tabs[2]);
    });

    it("should skip disabled tabs during arrow navigation", () => {
        subject.secondDisabled = true;
        componentFixture.detectChanges();

        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");

        tabs[0].focus();
        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowRight",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[2]);

        tabs[2].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowLeft",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[0]);
    });

    it("should navigate vertically with ArrowDown and ArrowUp", () => {
        subject.vertical = true;
        componentFixture.detectChanges();

        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");

        tabs[0].focus();
        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowDown",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[1]);

        tabs[1].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowDown",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[2]);

        // Wrap around vertically
        tabs[2].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowDown",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[0]);

        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                code: "ArrowUp",
                bubbles: true,
            })
        );
        expect(document.activeElement).toBe(tabs[2]);
    });
});
