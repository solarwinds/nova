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

import {
    ChangeDetectorRef,
    Component,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TabHeadingGroupComponent } from "./tab-heading-group.component";
import { IconComponent } from "../../icon/icon.component";
import { TabHeadingComponent } from "../tab-heading/tab-heading.component";

/**
 * @ignore
 */
@Component({
    selector: "nui-test-tab-heading-group-cmp",
    template: ` <nui-tab-heading-group
            [vertical]="isVertical"
            (selected)="updateContent($event)"
        >
            <nui-tab-heading
                *ngFor="let tab of tabsetContent"
                [tabId]="tab.id"
                [disabled]="tab.disabled"
                [ariaControls]="'panel-' + tab.id"
                [active]="currentTabId === tab.id"
            >
                <div class="d-flex align-content-center">
                    <div class="d-inline-flex align-items-center">
                        <span [title]="tab.title">{{ tab.title }}</span>
                    </div>
                </div>
            </nui-tab-heading>
        </nui-tab-heading-group>
        <div
            *ngFor="let tab of tabsetContent"
            role="tabpanel"
            tabindex="0"
            [id]="'panel-' + tab.id"
            [attr.aria-labelledby]="'tab-' + tab.id"
        ></div>`,
    standalone: false,
})
class TestTabHeadingComponent {
    public isVertical = false;
    public currentTabId: string;
    public tabsetContent: any[] = [];

    @ViewChild(TabHeadingGroupComponent, { static: true })
    tabHeadingGroup: TabHeadingGroupComponent;
    @ViewChildren(TabHeadingComponent)
    tabHeadings: QueryList<TabHeadingComponent>;

    constructor(private changeDetector: ChangeDetectorRef) {
        this.addTab();
        this.addTab();
    }

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }
    public addTab(disabled = false) {
        const nextIndex = this.tabsetContent.length + 1;
        this.tabsetContent.push({
            id: `${nextIndex}`,
            title: "Tab " + nextIndex,
            content: "Lorem ipsum #" + nextIndex,
            disabled,
        });
    }
    public popTab() {
        this.tabsetContent.pop();
    }
}

@Component({
    template: `
        <nui-tab-heading-group>
            <nui-tab-heading #firstTab [ariaControls]="firstTab.panelId"
                >Overview</nui-tab-heading
            >
            <nui-tab-heading #secondTab [ariaControls]="secondTab.panelId"
                >Details</nui-tab-heading
            >
        </nui-tab-heading-group>
        <div
            role="tabpanel"
            tabindex="0"
            [id]="firstTab.panelId"
            [attr.aria-labelledby]="firstTab.tabControlId"
        ></div>
        <div
            role="tabpanel"
            tabindex="-1"
            [id]="secondTab.panelId"
            [attr.aria-labelledby]="secondTab.tabControlId"
        ></div>
    `,
    standalone: false,
})
class TestGeneratedTabHeadingComponent {
    @ViewChildren(TabHeadingComponent)
    public tabHeadings: QueryList<TabHeadingComponent>;
}

@Component({
    template: `
        <nui-tab-heading-group>
            <nui-tab-heading [disabled]="true">Disabled</nui-tab-heading>
            <nui-tab-heading>Enabled</nui-tab-heading>
        </nui-tab-heading-group>
    `,
    standalone: false,
})
class TestFirstDisabledTabHeadingComponent {}

@Component({
    template: `
        <nui-tab-heading-group>
            <nui-tab-heading [disabled]="true">First</nui-tab-heading>
            <nui-tab-heading [disabled]="true">Second</nui-tab-heading>
        </nui-tab-heading-group>
    `,
    standalone: false,
})
class TestAllDisabledTabHeadingComponent {}

describe("components >", () => {
    describe("tab heading group >", () => {
        let componentFixture: ComponentFixture<TestTabHeadingComponent>;
        let subject: TestTabHeadingComponent;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [IconComponent],
                declarations: [
                    TabHeadingGroupComponent,
                    TabHeadingComponent,
                    TestTabHeadingComponent,
                    TestGeneratedTabHeadingComponent,
                    TestFirstDisabledTabHeadingComponent,
                    TestAllDisabledTabHeadingComponent,
                ],
            })
                .compileComponents()
                .then(() => {
                    componentFixture = TestBed.createComponent(
                        TestTabHeadingComponent
                    );
                    subject = componentFixture.componentInstance;
                });
        }));

        it("should safely clean up before view initialization", () => {
            expect(() => subject.tabHeadingGroup.ngOnDestroy()).not.toThrow();
        });

        it("should add tabs initially", () => {
            componentFixture.detectChanges();
            expect(subject.tabHeadings.toArray().length).toEqual(2);
        });

        it("should subscribe and unsubscribe from child tabs", () => {
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(2);
            subject.addTab();
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(3);
            subject.popTab();
            subject.popTab();
            componentFixture.detectChanges();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions
                    .length
            ).toEqual(1);
            spyOn(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions[0],
                "unsubscribe"
            );
            subject.tabHeadingGroup.ngOnDestroy();
            expect(
                (subject.tabHeadingGroup as any)._tabSelectedSubscriptions[0]
                    .unsubscribe
            ).toHaveBeenCalled();
        });

        it("should publish tabId of new tab", () => {
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("1");
            subject.tabHeadings.toArray()[1].selectTab();
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("2");
            subject.addTab();
            componentFixture.detectChanges();
            subject.tabHeadings.toArray()[2].selectTab();
            componentFixture.detectChanges();
            expect(subject.currentTabId).toBe("3");
        });

        it("should relate headings to consumer-owned panels", () => {
            componentFixture.detectChanges();

            const tab =
                componentFixture.nativeElement.querySelector("[role='tab']");
            const panel =
                componentFixture.nativeElement.querySelector(
                    "[role='tabpanel']"
                );

            expect(tab.id).toBe("tab-1");
            expect(tab.getAttribute("aria-controls")).toBe(panel.id);
            expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
        });

        it("should keep only the active tab in the tab sequence", () => {
            componentFixture.detectChanges();

            const tabs =
                componentFixture.nativeElement.querySelectorAll("[role='tab']");

            expect(tabs[0].tabIndex).toBe(0);
            expect(tabs[1].tabIndex).toBe(-1);
        });

        it("should move focus with arrows, Home, and End including wrap-around", () => {
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
            expect(document.activeElement).toBe(tabs[1]);
            expect(tabs[0].tabIndex).toBe(0);
            expect(tabs[1].tabIndex).toBe(-1);
            expect(tabs[0].getAttribute("aria-selected")).toBe("true");
            expect(tabs[1].getAttribute("aria-selected")).toBe("false");

            // Wrap around from last to first
            tabs[1].dispatchEvent(
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
            expect(document.activeElement).toBe(tabs[1]);

            tabs[1].dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "Home",
                    bubbles: true,
                })
            );
            expect(document.activeElement).toBe(tabs[0]);

            tabs[0].dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "End",
                    bubbles: true,
                })
            );
            expect(document.activeElement).toBe(tabs[1]);
        });

        it("should skip disabled tabs during arrow navigation", () => {
            subject.addTab(true); // Tab 3 (disabled)
            subject.addTab(false); // Tab 4 (enabled)
            componentFixture.detectChanges();

            const tabs =
                componentFixture.nativeElement.querySelectorAll("[role='tab']");

            tabs[1].focus();
            tabs[1].dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowRight",
                    bubbles: true,
                })
            );
            // Should skip Tab 3 (disabled) and focus Tab 4
            expect(document.activeElement).toBe(tabs[3]);

            tabs[3].dispatchEvent(
                new KeyboardEvent("keydown", {
                    code: "ArrowLeft",
                    bubbles: true,
                })
            );
            // Should skip Tab 3 (disabled) and focus Tab 2
            expect(document.activeElement).toBe(tabs[1]);
        });

        it("should navigate vertically with ArrowDown and ArrowUp", () => {
            subject.isVertical = true;
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

            // Wrap around vertically
            tabs[1].dispatchEvent(
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
            expect(document.activeElement).toBe(tabs[1]);
        });

        it("should generate an id for a heading without one", () => {
            const generatedFixture = TestBed.createComponent(
                TestGeneratedTabHeadingComponent
            );
            generatedFixture.detectChanges();

            const tabs =
                generatedFixture.nativeElement.querySelectorAll("[role='tab']");
            const panels =
                generatedFixture.nativeElement.querySelectorAll(
                    "[role='tabpanel']"
                );
            const tabIds = Array.from(tabs as NodeListOf<HTMLElement>).map(
                (tab) => tab.id
            );
            const panelIds = Array.from(panels as NodeListOf<HTMLElement>).map(
                (panel) => panel.id
            );

            expect(tabs.length).toBe(2);
            expect(panels.length).toBe(2);
            expect(tabIds[0]).toMatch(/^tab-nui-tab-heading-/);
            expect(new Set(tabIds).size).toBe(2);
            expect(new Set(panelIds).size).toBe(2);
            tabs.forEach((tab: HTMLElement) => {
                const panel = generatedFixture.nativeElement.querySelector(
                    `#${tab.getAttribute("aria-controls")}`
                );
                expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
            });
        });

        it("should select the first enabled heading when the first heading is disabled", () => {
            const disabledFixture = TestBed.createComponent(
                TestFirstDisabledTabHeadingComponent
            );
            disabledFixture.detectChanges();

            const tabs =
                disabledFixture.nativeElement.querySelectorAll("[role='tab']");

            expect(tabs[0].getAttribute("aria-disabled")).toBe("true");
            expect(tabs[0].getAttribute("aria-selected")).toBe("false");
            expect(tabs[0].tabIndex).toBe(-1);
            expect(tabs[1].getAttribute("aria-selected")).toBe("true");
            expect(tabs[1].tabIndex).toBe(0);
        });

        it("should leave all headings inactive when every heading is disabled", () => {
            const disabledFixture = TestBed.createComponent(
                TestAllDisabledTabHeadingComponent
            );
            disabledFixture.detectChanges();

            const tabs =
                disabledFixture.nativeElement.querySelectorAll("[role='tab']");

            tabs.forEach((tab: HTMLElement) => {
                expect(tab.getAttribute("aria-selected")).toBe("false");
                expect(tab.tabIndex).toBe(-1);
            });
        });
    });
});
