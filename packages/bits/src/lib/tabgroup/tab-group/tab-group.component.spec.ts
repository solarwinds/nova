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
        <nui-tab-group>
            <nui-tab tabId="overview" heading="Overview">Overview</nui-tab>
            <nui-tab heading="Details">Details</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestTabGroupComponent {
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

    it("should connect every tab to its panel", () => {
        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");
        const panels =
            componentFixture.nativeElement.querySelectorAll(
                "[role='tabpanel']"
            );

        expect(tabs.length).toBe(2);
        expect(panels.length).toBe(2);

        tabs.forEach((tab: HTMLElement, index: number) => {
            const tabComponent = subject.tabs.toArray()[index];
            const panel = panels[index] as HTMLElement;

            expect(tab.id).toBe(`tab-${tabComponent.tabId}`);
            expect(tab.getAttribute("aria-controls")).toBe(panel.id);
            expect(panel.id).toBe(`panel-${tabComponent.tabId}`);
            expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
        });
    });
});
