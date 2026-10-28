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

import { Component, DebugElement } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { PanelComponent } from "./panel.component";
import { PanelBackgroundColor, PanelModes } from "./public-api";
import { ResizerDirective } from "../../common/directives/resizer/resizer.directive";
import { ButtonComponent } from "../../lib/button/button.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { UtilService } from "../../services/util.service";

const PANE_WIDTH_PERCENTS = "20px";
const PANE_WIDTH = "500px";
const PANE_HEIGHT = "300px";
const LEFT_PANE_CONTENT = "Left Pane Content";
const CENTER_PANE_CONTENT = "Center Pane Content";
const PANE_HEADER = "DEFAULT HEADER";

@Component({
    selector: "nui-test-app",
    template: `
        <nui-panel
            [paneSize]="paneSize"
            [panelMode]="panelMode"
            [isCollapsed]="isCollapsed"
            [orientation]="orientation"
            [heading]="heading"
            [displacePrimaryContent]="displacePrimaryContent"
            [darkBorder]="darkBorder"
            [headerPadding]="headerPadding"
            [panelBackgroundColor]="panelBackgroundColor"
            (collapsed)="onCollapse($event)"
            (hidden)="onHide($event)"
        >
            <div nuiPanelEmbeddedIcon class="nui-panel__header-embedded-icon">
                <nui-icon
                    [icon]="headerIcon"
                    [counter]="headerIconCounter"
                    [iconSize]="'small'"
                >
                </nui-icon>
            </div>
            <div nuiPanelEmbeddedBody class="nui-panel__header-embedded-body">
                Left Pane Content
                <input aria-label="Panel input" />
                <button type="button">Panel action</button>
            </div>
            <div>Center Pane Content</div>
        </nui-panel>
        <button type="button" class="outside-panel">Outside panel</button>
    `,
    standalone: false,
})
class TestAppComponent {
    paneSize = PanelComponent.SIZE_VALUES.width.DEFAULT_VALUE;
    paneCollapsedSize = PanelComponent.SIZE_VALUES.width.COLLAPSED_VALUE;
    panelMode = PanelModes.static;
    isCollapsed: boolean = false;
    headerIcon: string;
    orientation = "left";
    heading: string;
    headerIconCounter: number;
    displacePrimaryContent: boolean;
    darkBorder: boolean;
    headerPadding: boolean;
    panelBackgroundColor: PanelBackgroundColor;

    public onCollapse(event: boolean) {
        return event;
    }

    public onHide(event: boolean) {
        return event;
    }
}

describe("components >", () => {
    let fixture: ComponentFixture<TestAppComponent>;
    let testComponent: TestAppComponent;

    describe("panel >", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NoopAnimationsModule, IconComponent],
                declarations: [
                    ButtonComponent,
                    PanelComponent,
                    TestAppComponent,
                    ResizerDirective,
                ],
                providers: [IconService, UtilService],
            });

            fixture = TestBed.createComponent(TestAppComponent);
            testComponent = fixture.componentInstance;
            testComponent.heading = PANE_HEADER;
            testComponent.headerIconCounter = 5;
            testComponent.headerIcon = "filter";
        });

        it("should have content in left pane and center pane", () => {
            fixture.detectChanges();
            const leftPaneBody = fixture.debugElement.query(
                By.css(".nui-panel__side-pane-body")
            ).nativeElement;
            expect(leftPaneBody.textContent).toContain(LEFT_PANE_CONTENT);

            const centerPaneBody = fixture.debugElement.query(
                By.css(".nui-panel__center-pane .nui-panel__body")
            ).nativeElement;
            expect(centerPaneBody.textContent).toContain(CENTER_PANE_CONTENT);
        });

        it("should have set width in left pane container and side pane body if not collapsible", () => {
            fixture.detectChanges();

            const leftPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(leftPaneContainer.style.width).toBe(
                `${PanelComponent.SIZE_VALUES.width.DEFAULT_VALUE}`
            );

            testComponent.paneSize = PANE_WIDTH;
            fixture.detectChanges();

            expect(leftPaneContainer.style.width).toBe(`${PANE_WIDTH}`);
        });

        it("should change width to min value if isCollapsible and collapsed", fakeAsync(() => {
            fixture.detectChanges();
            testComponent.panelMode = PanelModes.collapsible;
            testComponent.isCollapsed = true;
            fixture.detectChanges();
            tick();
            const leftPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(leftPaneContainer.style.width).toBe(
                `${PanelComponent.SIZE_VALUES.width.COLLAPSED_VALUE}`
            );
        }));

        it("should set width in percents when allowPercentageSize is true and is not collapsed", () => {
            fixture.detectChanges();
            testComponent.panelMode = PanelModes.collapsible;
            testComponent.isCollapsed = false;
            testComponent.paneSize = PANE_WIDTH_PERCENTS;
            fixture.detectChanges();

            const leftPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(leftPaneContainer.style.width).toBe(
                `${PANE_WIDTH_PERCENTS}`
            );
        });

        it("should change height in top pane container if collapsible and not collapsed", () => {
            testComponent.orientation = "top";
            fixture.detectChanges();
            testComponent.panelMode = PanelModes.collapsible;
            testComponent.isCollapsed = false;
            testComponent.paneSize = PANE_HEIGHT;
            fixture.detectChanges();

            const topPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(topPaneContainer.style.height).toBe(`${PANE_HEIGHT}`);
        });

        it("should have set height in top pane container", () => {
            testComponent.orientation = "top";
            fixture.detectChanges();
            testComponent.paneSize = PANE_HEIGHT;
            fixture.detectChanges();

            const topPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(topPaneContainer.style.height).toBe(`${PANE_HEIGHT}`);
        });

        it("should have default min height when panel is collapsed", fakeAsync(() => {
            fixture.detectChanges();
            testComponent.orientation = "top";
            testComponent.panelMode = PanelModes.collapsible;
            testComponent.isCollapsed = true;
            fixture.detectChanges();
            tick();
            const topPaneContainer = fixture.debugElement.query(
                By.css(".nui-panel__side-pane")
            ).nativeElement;
            expect(topPaneContainer.style.height).toBe(
                `${PanelComponent.SIZE_VALUES.height.COLLAPSED_VALUE}`
            );
        }));

        for (const initiallyCollapsed of [true, false]) {
            it(`should keep the toggle focused while ${
                initiallyCollapsed ? "expanding" : "collapsing"
            } and ignore repeated activation`, fakeAsync(() => {
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.isCollapsed = initiallyCollapsed;
                fixture.detectChanges();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();

                const toggle: HTMLButtonElement =
                    fixture.nativeElement.querySelector(
                        ".nui-panel__header-btn"
                    );
                toggle.focus();
                expect(document.activeElement).toBe(toggle);

                toggle.click();
                fixture.detectChanges();
                expect(toggle.disabled).toBeFalse();
                expect(toggle.getAttribute("aria-disabled")).toBe("true");
                expect(toggle.classList.contains("disabled")).toBeTrue();
                expect(document.activeElement).toBe(toggle);

                toggle.click();
                fixture.detectChanges();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();

                expect(
                    fixture.nativeElement
                        .querySelector(".nui-panel.media")
                        .classList.contains("nui-panel--is-collapsed")
                ).toBe(!initiallyCollapsed);
                expect(toggle.getAttribute("aria-disabled")).toBe("false");
                expect(toggle.classList.contains("disabled")).toBeFalse();
                expect(document.activeElement).toBe(toggle);
            }));
        }

        it("should have collapse button when collapsible", () => {
            fixture.detectChanges();
            let collapseButtonDebugElement = fixture.debugElement.query(
                By.css(".nui-panel__header-btn")
            );
            expect(collapseButtonDebugElement).toBeNull();

            testComponent.panelMode = PanelModes.collapsible;
            fixture.detectChanges();
            collapseButtonDebugElement = fixture.debugElement.query(
                By.css(".nui-panel__header-btn")
            );
            expect(collapseButtonDebugElement).not.toBeNull();
        });

        describe("should be expanded >", () => {
            let panelContainer: any;
            let collapseIconDebugElement: DebugElement;

            it("when not collapsible and not collapsed", () => {
                fixture.detectChanges();
                panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                ).nativeElement;
                collapseIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn")
                );

                expect(panelContainer.classList).not.toContain(
                    "nui-panel--is-collapsed"
                );
                expect(panelContainer.getAttribute("aria-expanded")).toBe(
                    "true"
                );
                expect(panelContainer.getAttribute("aria-hidden")).toBeNull();
                expect(collapseIconDebugElement).toBeNull();
            });

            it("when not collapsible and collapsed", fakeAsync(() => {
                fixture.detectChanges();
                testComponent.isCollapsed = true;
                tick();
                fixture.detectChanges();
                panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                ).nativeElement;
                collapseIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn")
                );

                expect(panelContainer.classList).not.toContain(
                    "nui-panel--is-collapsed"
                );
                expect(panelContainer.getAttribute("aria-expanded")).toBe(
                    "true"
                );
                expect(panelContainer.getAttribute("aria-hidden")).toBeNull();
                expect(collapseIconDebugElement).toBeNull();
            }));

            it("when collapsible and not collapsed", () => {
                testComponent.isCollapsed = false;
                testComponent.panelMode = PanelModes.collapsible;
                fixture.detectChanges();

                panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                ).nativeElement;
                collapseIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn")
                );

                expect(panelContainer.classList).not.toContain(
                    "nui-panel--is-collapsed"
                );
                expect(panelContainer.getAttribute("aria-expanded")).toBe(
                    "true"
                );
                expect(panelContainer.getAttribute("aria-hidden")).toBeNull();
                expect(collapseIconDebugElement).not.toBeNull();
                expect(collapseIconDebugElement.context.icon).toBe(
                    "double-caret-left"
                );
            });
        });

        describe("should be collapsed >", () => {
            let panelContainer: any;
            let collapseIconDebugElement: DebugElement;

            it("when collapsible and collapsed", fakeAsync(() => {
                fixture.detectChanges();
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.isCollapsed = true;
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                ).nativeElement;
                collapseIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn")
                );

                expect(panelContainer.classList).toContain(
                    "nui-panel--is-collapsed"
                );
                expect(panelContainer.getAttribute("aria-expanded")).toBe(
                    "false"
                );
                expect(panelContainer.getAttribute("aria-hidden")).toBeNull();
                expect(collapseIconDebugElement).not.toBeNull();
                expect(collapseIconDebugElement.context.icon).toBe(
                    "double-caret-right"
                );
            }));
        });

        [PanelModes.collapsible, PanelModes.hoverable].forEach(panelMode => {
            it(`should preserve primary content when ${panelMode} collapses and re-expands`, fakeAsync(() => {
                testComponent.panelMode = panelMode;
                testComponent.isCollapsed = true;
                fixture.detectChanges();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();

                const panel = fixture.debugElement.query(
                    By.directive(PanelComponent)
                ).componentInstance as PanelComponent;
                const centerPane = fixture.nativeElement.querySelector(
                    ".nui-panel__center-pane"
                );
                const toggle = fixture.nativeElement.querySelector(
                    ".nui-panel__header-btn"
                );
                expect(centerPane.textContent).toContain(CENTER_PANE_CONTENT);
                expect(centerPane.closest("[aria-hidden=true]")).toBeNull();
                if (panelMode === PanelModes.collapsible) {
                    expect(toggle.closest("[aria-hidden=true]")).toBeNull();
                    expect(toggle.getAttribute("aria-label")).toBe(
                        "Expand panel"
                    );
                }
                expect(
                    fixture.nativeElement.querySelector(
                        ".nui-panel__side-pane-body"
                    )
                ).toBeNull();

                if (panelMode === PanelModes.hoverable) {
                    panel.toggleEnter();
                } else {
                    toggle.click();
                }
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();

                expect(panel.isCollapsed).toBeFalse();
                expect(centerPane.closest("[aria-hidden=true]")).toBeNull();
                if (panelMode === PanelModes.collapsible) {
                    expect(toggle.getAttribute("aria-label")).toBe(
                        "Collapse panel"
                    );
                }
                expect(
                    fixture.nativeElement.querySelector(
                        ".nui-panel__side-pane-body"
                    ).textContent
                ).toContain(LEFT_PANE_CONTENT);

                if (panelMode === PanelModes.hoverable) {
                    panel.toggleLeave();
                } else {
                    toggle.click();
                }
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();

                expect(panel.isCollapsed).toBeTrue();
                expect(centerPane.closest("[aria-hidden=true]")).toBeNull();
                expect(
                    fixture.nativeElement.querySelector(
                        ".nui-panel__side-pane-body"
                    )
                ).toBeNull();
            }));
        });

        describe("hoverable keyboard access", () => {
            let panel: PanelComponent;
            let pane: HTMLElement;

            beforeEach(fakeAsync(() => {
                testComponent.panelMode = PanelModes.hoverable;
                testComponent.isCollapsed = true;
                fixture.detectChanges();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                panel = fixture.debugElement.query(
                    By.directive(PanelComponent)
                ).componentInstance;
                pane = fixture.nativeElement.querySelector(
                    ".nui-panel__side-pane"
                );
            }));

            it("should expose a named entry point and open when focused", fakeAsync(() => {
                expect(pane.tabIndex).toBe(0);
                expect(pane.getAttribute("role")).toBe("group");
                expect(pane.getAttribute("aria-label")).toBe(PANE_HEADER);
                expect(pane.getAttribute("aria-expanded")).toBe("false");
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                expect(pane.getAttribute("aria-expanded")).toBe("true");
                expect(pane.querySelector("input")).not.toBeNull();
            }));

            it("should retain content when the pointer leaves a keyboard-focused pane", fakeAsync(() => {
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                const input = pane.querySelector("input")!;
                input.focus();
                panel.toggleEnter();
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                expect(document.activeElement).toBe(input);
            }));

            it("should cancel a queued mouse close when keyboard focus enters", fakeAsync(() => {
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME / 2);
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
            }));

            it("should close on Escape and retain focus without reopening", fakeAsync(() => {
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                const input = pane.querySelector("input")!;
                input.focus();
                const escape = new KeyboardEvent("keydown", {
                    key: "Escape",
                    bubbles: true,
                    cancelable: true,
                });
                input.dispatchEvent(escape);
                tick(PanelComponent.ANIMATION_TIME * 3);
                fixture.detectChanges();
                expect(escape.defaultPrevented).toBeTrue();
                expect(panel.isCollapsed).toBeTrue();
                expect(document.activeElement).toBe(pane);
                expect(pane.querySelector("input")).toBeNull();

                const outside: HTMLButtonElement =
                    fixture.nativeElement.querySelector(".outside-panel");
                outside.focus();
                tick(PanelComponent.ANIMATION_TIME);
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
            }));

            it("should not consume Escape already handled by a child", fakeAsync(() => {
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                const input = pane.querySelector("input")!;
                const escape = new KeyboardEvent("keydown", {
                    key: "Escape",
                    bubbles: true,
                    cancelable: true,
                });
                escape.preventDefault();
                input.dispatchEvent(escape);
                tick(PanelComponent.ANIMATION_TIME);
                expect(panel.isCollapsed).toBeFalse();
            }));

            it("should close after focus leaves when the pointer is outside", fakeAsync(() => {
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                const outside: HTMLButtonElement =
                    fixture.nativeElement.querySelector(".outside-panel");
                outside.focus();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
                expect(document.activeElement).toBe(outside);
            }));

            it("should remain open after focus leaves while the pointer is inside", fakeAsync(() => {
                pane.focus();
                tick(PanelComponent.ANIMATION_TIME);
                fixture.detectChanges();
                panel.toggleEnter();
                const outside: HTMLButtonElement =
                    fixture.nativeElement.querySelector(".outside-panel");
                outside.focus();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
            }));

            it("should preserve mouse-only open and close behavior", fakeAsync(() => {
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
            }));

            it("should preserve externally requested collapsed state after hover ends", fakeAsync(() => {
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
                panel.isCollapsed = true;
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
            }));

            it("should honor the latest pointer state during rapid hover changes", fakeAsync(() => {
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME / 2);
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();

                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME / 2);
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME * 2);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeFalse();
            }));

            it("should finish closing when the pointer leaves during expansion", fakeAsync(() => {
                panel.toggleEnter();
                tick(PanelComponent.ANIMATION_TIME);
                panel.toggleLeave();
                tick(PanelComponent.ANIMATION_TIME * 3);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
            }));

            it("should honor Escape during the opening animation", fakeAsync(() => {
                pane.focus();
                pane.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Escape",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                tick(PanelComponent.ANIMATION_TIME * 3);
                fixture.detectChanges();
                expect(panel.isCollapsed).toBeTrue();
                expect(document.activeElement).toBe(pane);
            }));
        });

        it("should not add a focus entry point or handle Escape in other panel modes", fakeAsync(() => {
            testComponent.panelMode = PanelModes.collapsible;
            fixture.detectChanges();
            tick(PanelComponent.ANIMATION_TIME);
            fixture.detectChanges();
            const pane: HTMLElement = fixture.nativeElement.querySelector(
                ".nui-panel__side-pane"
            );
            const panel = fixture.debugElement.query(
                By.directive(PanelComponent)
            ).componentInstance as PanelComponent;
            const collapsedBefore = panel.isCollapsed;
            expect(pane.hasAttribute("tabindex")).toBeFalse();
            expect(pane.hasAttribute("role")).toBeFalse();
            const escape = new KeyboardEvent("keydown", {
                key: "Escape",
                bubbles: true,
                cancelable: true,
            });
            pane.dispatchEvent(escape);
            tick(PanelComponent.ANIMATION_TIME);
            expect(escape.defaultPrevented).toBeFalse();
            expect(panel.isCollapsed).toBe(collapsedBefore);
        }));

        it("should have header", () => {
            fixture.detectChanges();
            const headerDebugElement = fixture.debugElement.query(
                By.css(".nui-panel__header-content-default")
            );
            expect(headerDebugElement).toBeTruthy();
            expect(headerDebugElement.nativeElement.innerText.trim()).toEqual(
                PANE_HEADER
            );
        });
        it("should have embedded header icon", () => {
            testComponent.headerIcon = "filter";
            fixture.detectChanges();
            const embeddedHeaderIconDebugElement = fixture.debugElement.query(
                By.css(".nui-panel__header-embedded-icon")
            );
            expect(embeddedHeaderIconDebugElement).not.toBeNull();
            const embeddedIconDebugElement = fixture.debugElement.query(
                By.css(".nui-panel__header-embedded-icon nui-icon")
            );
            expect(embeddedIconDebugElement).not.toBeNull();
            expect(embeddedIconDebugElement.context.icon()).toBe("filter");
        });
        describe("position >", () => {
            it("should have correct classes when position is right", () => {
                testComponent.orientation = "right";
                fixture.detectChanges();

                const leftPaneBody = fixture.debugElement.query(
                    By.css(".nui-panel--left .nui-panel__side-pane-body")
                );
                expect(leftPaneBody).toBeNull();
                const rightPaneBody = fixture.debugElement.query(
                    By.css(".nui-panel--right .nui-panel__side-pane-body")
                );
                expect(rightPaneBody).not.toBeNull();
            });
            it("should have correct margin when position is right and displacePrimaryContent is true", () => {
                testComponent.orientation = "right";
                fixture.detectChanges();
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.displacePrimaryContent = true;
                fixture.detectChanges();

                const panelBodyDebugElement = fixture.debugElement.query(
                    By.css(".media-body.nui-panel__center-pane")
                );
                expect(
                    panelBodyDebugElement.nativeElement.style.marginRight
                ).toBe(`${PanelComponent.SIZE_VALUES.width.COLLAPSED_VALUE}`);
            });
            it("should have correct classes and margin when position is top and displacePrimaryContent is true", () => {
                testComponent.orientation = "top";
                fixture.detectChanges();
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.isCollapsed = false;
                testComponent.displacePrimaryContent = true;
                fixture.detectChanges();

                const panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                );
                expect(panelContainer.nativeElement.classList).toContain(
                    "nui-panel--top"
                );
                const topPaneDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel--top .nui-panel__side-pane-body")
                );
                expect(topPaneDebugElement).not.toBeNull();
                const panelBodyDebugElement = fixture.debugElement.query(
                    By.css(".media-body.nui-panel__center-pane")
                );
                expect(
                    panelBodyDebugElement.nativeElement.style.marginTop
                ).toBe(`${PanelComponent.SIZE_VALUES.height.COLLAPSED_VALUE}`);
            });
            it("should have correct classes and margin when position is bottom and displacePrimaryContent is true", () => {
                testComponent.orientation = "bottom";
                fixture.detectChanges();
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.isCollapsed = false;
                testComponent.displacePrimaryContent = true;
                fixture.detectChanges();

                const panelContainer = fixture.debugElement.query(
                    By.css(".nui-panel.media")
                );
                expect(panelContainer.nativeElement.classList).toContain(
                    "nui-panel--bottom"
                );
                const topPaneDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel--bottom .nui-panel__side-pane-body")
                );
                expect(topPaneDebugElement).not.toBeNull();
                const panelBodyDebugElement = fixture.debugElement.query(
                    By.css(".media-body.nui-panel__center-pane")
                );
                expect(
                    panelBodyDebugElement.nativeElement.style.marginBottom
                ).toBe(`${PanelComponent.SIZE_VALUES.height.COLLAPSED_VALUE}`);
            });
            it("should display correct button icons when collapse is toggled", fakeAsync(() => {
                fixture.detectChanges();
                testComponent.orientation = "top";
                testComponent.panelMode = PanelModes.collapsible;
                testComponent.isCollapsed = true;
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                const collapsibleIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn")
                );
                expect(collapsibleIconDebugElement.context.icon).toBe(
                    "double-caret-down"
                );

                testComponent.isCollapsed = false;
                fixture.detectChanges();
                tick();
                fixture.detectChanges();
                expect(collapsibleIconDebugElement.context.icon).toBe(
                    "double-caret-up"
                );
            }));
            it("should display correct button icon when closable", () => {
                testComponent.orientation = "left";
                testComponent.panelMode = PanelModes.closable;
                fixture.detectChanges();

                const closableIconDebugElement = fixture.debugElement.query(
                    By.css(".nui-panel__header-btn--close")
                );
                expect(closableIconDebugElement).not.toBeNull();
                expect(closableIconDebugElement.context.icon).toBe("close");
            });
        });
        describe("should have correct style classes", () => {
            it("should have correct class when darkBorder input set to true", () => {
                testComponent.darkBorder = true;
                fixture.detectChanges();
                const paneContainer = fixture.debugElement.query(
                    By.css(".nui-panel__side-pane")
                ).nativeElement;
                expect(paneContainer.classList).toContain(
                    "nui-panel-pane--border-dark"
                );
            });
            it("should have correct class when headerPadding input set to false", () => {
                testComponent.headerPadding = false;
                fixture.detectChanges();
                const paneHeader = fixture.debugElement.query(
                    By.css(".nui-panel__header")
                ).nativeElement;
                expect(paneHeader.classList).toContain(
                    "nui-panel__header--no-padding"
                );
            });
            it("should have correct class when panelBackgroundColor input set to colorBgSecondary", () => {
                testComponent.panelBackgroundColor =
                    PanelBackgroundColor.colorBgSecondary;
                fixture.detectChanges();
                const paneContainer = fixture.debugElement.query(
                    By.css(".nui-panel__side-pane")
                ).nativeElement;
                expect(paneContainer.classList).toContain("color-bg-secondary");
            });
        });
        it("should emit 'collapsed' event when collapsible panel is expanded/collapsed", fakeAsync(() => {
            const spy = spyOn(testComponent, "onCollapse");
            testComponent.panelMode = PanelModes.collapsible;
            fixture.detectChanges();
            const toggleButton = fixture.debugElement.query(
                By.css(".nui-panel__header-btn")
            ).nativeElement;
            toggleButton.click();
            tick();
            expect(spy).toHaveBeenCalledWith(true);

            fixture.whenStable().then(() => {
                expect(testComponent.onCollapse).toHaveBeenCalled();
            });
        }));
        it("should emit 'hidden' event when closable panel is shown/hidden", () => {
            const spy = spyOn(testComponent, "onHide");
            testComponent.panelMode = PanelModes.closable;
            fixture.detectChanges();
            const closeButton = fixture.debugElement.query(
                By.css(".nui-panel__header-btn--close")
            ).nativeElement;
            closeButton.click();
            expect(spy).toHaveBeenCalledWith(true);
        });
    });
});
