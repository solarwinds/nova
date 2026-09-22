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
            <nui-tab tabId="second" heading="Second" [disabled]="secondDisabled"
                >Second content</nui-tab
            >
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

@Component({
    template: `
        <nui-tab-group>
            <nui-tab heading="Disabled" [disabled]="true"
                >Disabled content</nui-tab
            >
            <nui-tab heading="Enabled">Enabled content</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestFirstDisabledTabGroupComponent {}

@Component({
    template: `
        <nui-tab-group>
            <nui-tab heading="First" [disabled]="true">First content</nui-tab>
            <nui-tab heading="Second" [disabled]="true">Second content</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestAllDisabledTabGroupComponent {}

@Component({
    template: `
        <nui-tab-group>
            <nui-tab heading="First">First content</nui-tab>
            <nui-tab heading="Second">Second content</nui-tab>
        </nui-tab-group>
    `,
    standalone: false,
})
class TestGeneratedTabGroupComponent {}

describe("components > tab group", () => {
    let componentFixture: ComponentFixture<TestTabGroupComponent>;
    let subject: TestTabGroupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NuiTabsModule],
            declarations: [
                TestTabGroupComponent,
                TestFirstDisabledTabGroupComponent,
                TestAllDisabledTabGroupComponent,
                TestGeneratedTabGroupComponent,
            ],
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

    it("should expose semantic state and activate a tab with Enter and Space", () => {
        subject.secondDisabled = true;
        componentFixture.detectChanges();

        const tablist =
            componentFixture.nativeElement.querySelector("[role='tablist']");
        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");
        const panels =
            componentFixture.nativeElement.querySelectorAll(
                "[role='tabpanel']"
            );

        expect(tablist.getAttribute("aria-orientation")).toBeNull();
        expect(tabs[1].getAttribute("aria-disabled")).toBe("true");
        expect(tabs[0].getAttribute("aria-selected")).toBe("true");

        tabs[2].dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                bubbles: true,
                cancelable: true,
            })
        );
        componentFixture.detectChanges();

        expect(tabs[2].getAttribute("aria-selected")).toBe("true");
        expect(tabs[0].getAttribute("aria-selected")).toBe("false");
        expect(panels[2].getAttribute("tabindex")).toBe("0");

        tabs[0].dispatchEvent(
            new KeyboardEvent("keydown", {
                key: " ",
                code: "Space",
                bubbles: true,
                cancelable: true,
            })
        );
        componentFixture.detectChanges();

        expect(tabs[0].getAttribute("aria-selected")).toBe("true");
        expect(panels[0].getAttribute("tabindex")).toBe("0");

        subject.vertical = true;
        componentFixture.detectChanges();
        expect(tablist.getAttribute("aria-orientation")).toBe("vertical");
    });

    it("should select the first enabled tab when the first tab is disabled", () => {
        const disabledFixture = TestBed.createComponent(
            TestFirstDisabledTabGroupComponent
        );
        disabledFixture.detectChanges();

        const tabs =
            disabledFixture.nativeElement.querySelectorAll("[role='tab']");

        expect(tabs[0].getAttribute("aria-disabled")).toBe("true");
        expect(tabs[0].getAttribute("aria-selected")).toBe("false");
        expect(tabs[0].getAttribute("tabindex")).toBe("-1");
        expect(tabs[1].getAttribute("aria-selected")).toBe("true");
        expect(tabs[1].getAttribute("tabindex")).toBe("0");
    });

    it("should not activate a disabled tab with keyboard input", () => {
        subject.secondDisabled = true;
        componentFixture.detectChanges();

        const tabs =
            componentFixture.nativeElement.querySelectorAll("[role='tab']");
        tabs[1].dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "Enter",
                code: "Enter",
                bubbles: true,
            })
        );
        tabs[1].dispatchEvent(
            new KeyboardEvent("keydown", {
                key: " ",
                code: "Space",
                bubbles: true,
            })
        );
        componentFixture.detectChanges();

        expect(tabs[0].getAttribute("aria-selected")).toBe("true");
        expect(tabs[1].getAttribute("aria-selected")).not.toBe("true");
        expect(tabs[1].getAttribute("aria-disabled")).toBe("true");
        expect(tabs[1].getAttribute("tabindex")).toBe("-1");
    });

    it("should leave all tabs inactive when every tab is disabled", () => {
        const disabledFixture = TestBed.createComponent(
            TestAllDisabledTabGroupComponent
        );
        disabledFixture.detectChanges();

        const tabs =
            disabledFixture.nativeElement.querySelectorAll("[role='tab']");

        tabs.forEach((tab: HTMLElement) => {
            expect(tab.getAttribute("aria-selected")).not.toBe("true");
            expect(tab.getAttribute("aria-disabled")).toBe("true");
            expect(tab.getAttribute("tabindex")).toBe("-1");
        });
    });

    it("should keep generated tab and panel ids unique", () => {
        const generatedFixture = TestBed.createComponent(
            TestGeneratedTabGroupComponent
        );
        generatedFixture.detectChanges();

        const tabs =
            generatedFixture.nativeElement.querySelectorAll("[role='tab']");
        const panels =
            generatedFixture.nativeElement.querySelectorAll(
                "[role='tabpanel']"
            );
        const tabIds = Array.from(tabs as NodeListOf<HTMLElement>).map(
            tab => tab.id
        );
        const panelIds = Array.from(panels as NodeListOf<HTMLElement>).map(
            panel => panel.id
        );

        expect(new Set(tabIds).size).toBe(2);
        expect(new Set(panelIds).size).toBe(2);
        tabs.forEach((tab: HTMLElement) => {
            const panel = generatedFixture.nativeElement.querySelector(
                `#${tab.getAttribute("aria-controls")}`
            );
            expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
        });
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

@Component({
    selector: "nui-test-tab-group-aria",
    template: `
        <nui-tab-group>
            <nui-tab heading="First">Content 1</nui-tab>
            <nui-tab heading="Second">Content 2</nui-tab>
            <nui-tab heading="Disabled" [disabled]="true">Content 3</nui-tab>
        </nui-tab-group>
    `,
    imports: [NuiTabsModule],
})
class TestTabGroupAriaComponent {}

describe("components >", () => {
    describe("tab-group >", () => {
        let fixture: ComponentFixture<TestTabGroupAriaComponent>;
        let el: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestTabGroupAriaComponent],
            });

            fixture = TestBed.createComponent(TestTabGroupAriaComponent);
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
                tabLinks.forEach(link => {
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
            it("should have tabindex=0 only on the active enabled tab link", () => {
                const tabLinks = el.querySelectorAll(".tab-link");
                expect(tabLinks[0].getAttribute("tabindex")).toBe("0");
                expect(tabLinks[1].getAttribute("tabindex")).toBe("-1");
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
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        bubbles: true,
                    })
                );
                fixture.detectChanges();

                expect(tabLinks[1].getAttribute("aria-selected")).toBe("true");
                expect(tabLinks[0].getAttribute("aria-selected")).toBe("false");
            });

            it("should NOT select disabled tab on Enter keydown", () => {
                const tabLinks = el.querySelectorAll<HTMLElement>(".tab-link");
                const disabledTab = tabLinks[2];

                disabledTab.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        bubbles: true,
                    })
                );
                fixture.detectChanges();

                expect(disabledTab.getAttribute("aria-selected")).toBe("false");
                // First tab should still be active
                expect(tabLinks[0].getAttribute("aria-selected")).toBe("true");
            });
        });
    });
});
