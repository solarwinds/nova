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

import { Overlay, OverlayModule } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    flushMicrotasks,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import _noop from "lodash/noop";
import { Subject } from "rxjs";

import { PopoverModalComponent } from "./popover-modal.component";
import { PopoverComponent } from "./popover.component";
import { PositionService } from "../../services/position.service";
import { UtilService } from "../../services/util.service";
import { NuiOverlayModule } from "../overlay/overlay.module";

@Component({
    template: `
        <div (click)="handleRowClick()" (keydown)="handleRowKeydown()">
            <nui-popover
                id="test-popover"
                [trigger]="trigger"
                [delay]="delay"
                [modal]="modal"
                [preventClosing]="preventClosing"
                [openPopover]="openPopover"
                tabindex="0"
                [template]="popoverTemplate"
                (shown)="handleShowPopover()"
                (hidden)="handleHidePopover()">
                Trigger
            </nui-popover>
        </div>
        <button id="outside-popover" type="button">Outside</button>
        <ng-template #popoverTemplate>
            <button id="popover-content-button" type="button">
                Popover content
            </button>
            <span id="popover-content-text">Popover text</span>
        </ng-template>
    `,
    standalone: false,
})
class PopoverComponentTestingComponent {
    public trigger = "click mouseenter focus openPopoverSubject";
    public delay = 0;
    public modal = false;
    public preventClosing = false;
    public openPopover = new Subject<void>();
    public rowClickCount = 0;
    public rowKeydownCount = 0;

    public handleShowPopover() {
        _noop();
    }

    public handleHidePopover() {
        _noop();
    }

    public handleRowClick() {
        this.rowClickCount++;
    }

    public handleRowKeydown() {
        this.rowKeydownCount++;
    }
}

@Component({
    template: "Nested popup",
})
class NestedOverlayTestingComponent {}

describe("components >", () => {
    describe("popover >", () => {
        let fixture: ComponentFixture<PopoverComponentTestingComponent>;
        let component: PopoverComponentTestingComponent;
        let popoverDebugElement: DebugElement;

        let subject: PopoverComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NoopAnimationsModule,
                    OverlayModule,
                    NuiOverlayModule,
                ],
                declarations: [
                    PopoverComponent,
                    PopoverComponentTestingComponent,
                    PopoverModalComponent,
                ],
                providers: [UtilService, PositionService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(PopoverComponentTestingComponent);
            fixture.autoDetectChanges(true);
            component = fixture.componentInstance;
            popoverDebugElement = fixture.debugElement.query(
                By.directive(PopoverComponent)
            );
            subject = popoverDebugElement.injector.get(
                PopoverComponent
            ) as PopoverComponent;
        });

        describe("showPopover >", () => {
            let resizeObserverSpy: jasmine.Spy;

            beforeEach(() => {
                spyOn(subject.overlayComponent, "show").and.callThrough();
                spyOn(component, "handleShowPopover");
                resizeObserverSpy = spyOn<any>(
                    subject,
                    "initializeResizeObserver"
                );

                subject.showPopover();
            });

            it("should display popover", () => {
                expect(subject.overlayComponent.show).toHaveBeenCalled();
            });

            it("should notify popover is displayed", () => {
                expect(component.handleShowPopover).toHaveBeenCalled();
            });

            it("should init ResizeObserver", () => {
                expect(resizeObserverSpy).toHaveBeenCalled();
            });
        });

        describe("when popover disabled", () => {
            beforeEach(() => {
                spyOn(subject.shown, "emit").and.callThrough();
            });

            it("should not show popover", () => {
                subject.disabled = true;
                subject.showPopover();
                expect(subject.shown.emit).not.toHaveBeenCalled();
            });

            it("should show popover when enabled", () => {
                subject.disabled = false;
                subject.showPopover();
                expect(subject.shown.emit).toHaveBeenCalled();
            });
        });

        describe("actions >", () => {
            beforeEach(() => {
                spyOn(subject, "showPopover").and.callThrough();
                spyOn(subject as any, "hidePopover").and.callThrough();
            });

            describe("Tab navigation >", () => {
                const dispatchTab = (
                    target: HTMLElement,
                    options: KeyboardEventInit = {}
                ): KeyboardEvent => {
                    const event = new KeyboardEvent("keydown", {
                        key: "Tab",
                        code: "Tab",
                        bubbles: true,
                        cancelable: true,
                        ...options,
                    });
                    target.dispatchEvent(event);
                    return event;
                };

                const getPopoverContent = (selector: string) => {
                    const ownerDocument: Document =
                        fixture.nativeElement.ownerDocument;
                    return ownerDocument.querySelector<HTMLElement>(selector);
                };

                const getPopoverContentButton = (): HTMLElement => {
                    const contentButton = getPopoverContent(
                        "#popover-content-button"
                    );
                    if (!(contentButton instanceof HTMLElement)) {
                        throw new Error(
                            "Popover content button was not rendered"
                        );
                    }
                    return contentButton;
                };

                const settleAnimations = () => {
                    fixture.detectChanges();
                    flushMicrotasks();
                    tick(0);
                    fixture.detectChanges();
                };

                it("tabs from the last host stop into interactive portaled content and back", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    const contentButton = getPopoverContentButton();
                    const enterEvent = dispatchTab(host);
                    expect(enterEvent.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(
                        contentButton
                    );

                    const returnEvent = dispatchTab(contentButton, {
                        shiftKey: true,
                    });
                    expect(returnEvent.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(host);

                    contentButton.focus();
                    const exitEvent = dispatchTab(contentButton);
                    expect(exitEvent.defaultPrevented).toBeFalse();
                    expect(host.ownerDocument.activeElement).toBe(host);
                }));

                it("does not forward Tab when a nested content handler consumed it", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();
                    const contentButton = getPopoverContentButton();
                    contentButton.focus();
                    contentButton.addEventListener(
                        "keydown",
                        event => event.preventDefault(),
                        { once: true }
                    );

                    const event = dispatchTab(contentButton);

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(
                        contentButton
                    );
                }));

                it("respects positive tab order and skips disabled or hidden content", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    const contentButton = getPopoverContentButton();
                    contentButton.tabIndex = 2;
                    const earlierButton =
                        host.ownerDocument.createElement("button");
                    earlierButton.type = "button";
                    earlierButton.tabIndex = 1;
                    const disabledButton =
                        host.ownerDocument.createElement("button");
                    disabledButton.type = "button";
                    disabledButton.tabIndex = 0;
                    disabledButton.disabled = true;
                    const hiddenButton =
                        host.ownerDocument.createElement("button");
                    hiddenButton.type = "button";
                    hiddenButton.tabIndex = 0;
                    hiddenButton.hidden = true;
                    contentButton.before(
                        disabledButton,
                        hiddenButton,
                        earlierButton
                    );

                    const event = dispatchTab(host);

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(
                        earlierButton
                    );
                }));

                it("leaves native Tab navigation unchanged when content has no tab stops", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();
                    getPopoverContentButton().remove();

                    const event = dispatchTab(host);

                    expect(event.defaultPrevented).toBeFalse();
                    expect(host.ownerDocument.activeElement).toBe(host);
                }));

                it("forwards only from the last tabbable descendant of the host", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const descendantTrigger =
                        host.ownerDocument.createElement("button");
                    descendantTrigger.type = "button";
                    host.appendChild(descendantTrigger);
                    host.focus();
                    settleAnimations();

                    expect(dispatchTab(host).defaultPrevented).toBeFalse();

                    descendantTrigger.focus();
                    const event = dispatchTab(descendantTrigger);

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(
                        getPopoverContentButton()
                    );
                }));

                it("does not intercept modified Tab events", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    const event = dispatchTab(host, { ctrlKey: true });

                    expect(event.defaultPrevented).toBeFalse();
                    expect(host.ownerDocument.activeElement).toBe(host);
                }));
            });

            describe("Escape dismissal >", () => {
                const dispatchEscape = (
                    target: HTMLElement,
                    options: KeyboardEventInit = {}
                ): KeyboardEvent => {
                    const event = new KeyboardEvent("keydown", {
                        key: "Escape",
                        code: "Escape",
                        bubbles: true,
                        cancelable: true,
                        ...options,
                    });
                    target.dispatchEvent(event);
                    return event;
                };

                const getPopoverContent = (selector: string) => {
                    const ownerDocument: Document =
                        fixture.nativeElement.ownerDocument;
                    return ownerDocument.querySelector<HTMLElement>(selector);
                };

                const getPopoverContentButton = (): HTMLElement => {
                    const contentButton = getPopoverContent(
                        "#popover-content-button"
                    );
                    if (!(contentButton instanceof HTMLElement)) {
                        throw new Error(
                            "Popover content button was not rendered"
                        );
                    }
                    return contentButton;
                };

                const settleAnimations = () => {
                    fixture.detectChanges();
                    flushMicrotasks();
                    tick(0);
                    fixture.detectChanges();
                };

                it("dismisses a focus-only popover on Escape without moving trigger focus or bubbling to the row", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");

                    host.focus();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    const event = dispatchEscape(host);
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(host);
                    expect(component.rowKeydownCount).toBe(0);
                    expect(component.rowClickCount).toBe(0);
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("recognizes Escape by code when key is unavailable", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    const event = dispatchEscape(host, {
                        key: "",
                        code: "Escape",
                    });
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                for (const trigger of ["focus", "mouseenter focus"]) {
                    it(`does not reopen ${trigger} after Escape until focus leaves and re-enters`, fakeAsync(() => {
                        component.trigger = trigger;
                        fixture.detectChanges();
                        const host: HTMLElement =
                            fixture.nativeElement.querySelector(
                                "#test-popover"
                            );
                        const outside: HTMLElement =
                            fixture.nativeElement.querySelector(
                                "#outside-popover"
                            );
                        host.focus();
                        if (trigger.includes("mouseenter")) {
                            host.dispatchEvent(new MouseEvent("mouseenter"));
                        }
                        settleAnimations();

                        dispatchEscape(host, { code: "" });
                        settleAnimations();
                        host.dispatchEvent(
                            new FocusEvent("focusin", { bubbles: true })
                        );
                        tick(500);
                        fixture.detectChanges();
                        expect(
                            getPopoverContent("#popover-content-text")
                        ).toBeNull();
                        expect(host.ownerDocument.activeElement).toBe(host);

                        outside.focus();
                        host.focus();
                        settleAnimations();
                        expect(
                            getPopoverContent("#popover-content-text")
                        ).not.toBeNull();
                    }));
                }

                it("does not consume a second Escape while the popover is closing", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    expect(dispatchEscape(host).defaultPrevented).toBeTrue();
                    expect(dispatchEscape(host).defaultPrevented).toBeFalse();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("lets the topmost subscribed overlay own Escape", fakeAsync(() => {
                    component.trigger = "mouseenter";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    outside.focus();
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    settleAnimations();

                    const nestedOverlay = TestBed.inject(Overlay).create();
                    nestedOverlay.attach(
                        new ComponentPortal(NestedOverlayTestingComponent)
                    );
                    const nestedEscape = jasmine.createSpy("nestedEscape");
                    const subscription = nestedOverlay
                        .keydownEvents()
                        .subscribe(nestedEscape);
                    const event = dispatchEscape(outside);
                    settleAnimations();
                    expect(nestedEscape).toHaveBeenCalledWith(event);
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    subscription.unsubscribe();
                    nestedOverlay.dispose();
                    dispatchEscape(outside);
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("dismisses on Escape even before the first display has settled", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();

                    const event = dispatchEscape(host);
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(host);
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("toggles click popovers without treating the trigger click as an outside click", fakeAsync(() => {
                    component.trigger = "click";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");

                    host.click();
                    settleAnimations();
                    expect(subject["popoverDisplaySubject"].value).toBeTrue();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    host.click();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();

                    host.click();
                    settleAnimations();
                    outside.click();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("allows explicit click and programmatic reopening after Escape", fakeAsync(() => {
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();
                    dispatchEscape(host);
                    settleAnimations();

                    host.click();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                    dispatchEscape(host);
                    settleAnimations();

                    subject.showPopover();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("dismisses a programmatically opened preventClosing popover with Escape", fakeAsync(() => {
                    component.trigger = "openPopoverSubject";
                    component.preventClosing = true;
                    fixture.detectChanges();
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    outside.focus();
                    component.openPopover.next();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    expect(dispatchEscape(outside).defaultPrevented).toBeTrue();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                    expect(outside.ownerDocument.activeElement).toBe(outside);
                }));

                it("dismisses a hover-open popover when keyboard focus is elsewhere", fakeAsync(() => {
                    component.trigger = "mouseenter focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    outside.focus();
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    const event = dispatchEscape(outside);
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(outside.ownerDocument.activeElement).toBe(outside);
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("restores focus to the trigger when Escape is pressed in portaled modal content", fakeAsync(() => {
                    component.trigger = "focus";
                    component.modal = true;
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");

                    host.focus();
                    settleAnimations();
                    const contentButton = getPopoverContentButton();
                    contentButton.focus();

                    const event = dispatchEscape(contentButton);
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(host.ownerDocument.activeElement).toBe(host);
                    expect(
                        getPopoverContent("#popover-content-button")
                    ).toBeNull();
                }));

                it("keeps the popover open when a nested handler already consumed Escape", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    host.addEventListener(
                        "keydown",
                        event => event.preventDefault(),
                        { capture: true, once: true }
                    );
                    const event = dispatchEscape(host);
                    settleAnimations();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("does not consume Escape when closed or modified", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");

                    const closedEvent = dispatchEscape(host);
                    expect(closedEvent.defaultPrevented).toBeFalse();

                    host.focus();
                    settleAnimations();
                    const modifiedEvent = dispatchEscape(host, {
                        shiftKey: true,
                    });
                    settleAnimations();

                    expect(modifiedEvent.defaultPrevented).toBeFalse();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("keeps combined focus and hover triggers open until both leave", fakeAsync(() => {
                    component.trigger = "mouseenter focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    host.focus();
                    settleAnimations();
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    host.dispatchEvent(new MouseEvent("mouseleave"));
                    tick(250);
                    fixture.detectChanges();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    outside.focus();
                    fixture.detectChanges();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();

                    host.dispatchEvent(new MouseEvent("mouseleave"));
                    tick(250);
                    fixture.detectChanges();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("keeps the hover popover open when focus leaves the trigger", fakeAsync(() => {
                    component.trigger = "mouseenter focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    settleAnimations();
                    host.focus();
                    outside.focus();
                    fixture.detectChanges();

                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("keeps the popover open while focus and pointer transfer to portaled content", fakeAsync(() => {
                    component.trigger = "mouseenter focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.focus();
                    settleAnimations();

                    const contentButton = getPopoverContentButton();
                    contentButton.focus();
                    host.dispatchEvent(
                        new MouseEvent("mouseleave", {
                            relatedTarget: contentButton,
                        })
                    );
                    contentButton.dispatchEvent(new MouseEvent("mouseenter"));
                    tick(250);
                    fixture.detectChanges();

                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("reopens after the focus trigger genuinely leaves and re-enters", fakeAsync(() => {
                    component.trigger = "focus";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");

                    host.focus();
                    settleAnimations();
                    dispatchEscape(host);
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();

                    outside.focus();
                    host.focus();
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("does not reopen a dismissed hover session until the pointer leaves and re-enters", fakeAsync(() => {
                    component.trigger = "mouseenter";
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");

                    outside.focus();
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    settleAnimations();
                    dispatchEscape(outside);
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();

                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    fixture.detectChanges();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();

                    host.dispatchEvent(new MouseEvent("mouseleave"));
                    tick(250);
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    settleAnimations();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).not.toBeNull();
                }));

                it("cancels a pending delayed hover open on Escape without hiding an uninitialized popover", fakeAsync(() => {
                    component.trigger = "mouseenter";
                    component.delay = 500;
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    const outside: HTMLElement =
                        fixture.nativeElement.querySelector("#outside-popover");
                    outside.focus();
                    host.dispatchEvent(new MouseEvent("mouseenter"));

                    const event = dispatchEscape(outside);
                    tick(600);
                    fixture.detectChanges();

                    expect(event.defaultPrevented).toBeFalse();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();
                }));

                it("cancels pending hover timers on leave and destruction", fakeAsync(() => {
                    component.trigger = "mouseenter";
                    component.delay = 500;
                    fixture.detectChanges();
                    const host: HTMLElement =
                        fixture.nativeElement.querySelector("#test-popover");
                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    host.dispatchEvent(new MouseEvent("mouseleave"));
                    tick(600);
                    fixture.detectChanges();
                    expect(
                        getPopoverContent("#popover-content-text")
                    ).toBeNull();

                    host.dispatchEvent(new MouseEvent("mouseenter"));
                    subject.showPopover();
                    subject.onMouseLeave();
                    fixture.destroy();
                    tick(600);
                }));
            });

            describe("onClick >", () => {
                beforeEach(() => {
                    subject.onClick(new MouseEvent("click"));
                });

                it("should show popover on click (click is one of its triggers here)", () => {
                    expect(subject.showPopover).toHaveBeenCalled();
                });
            });

            describe("onMouseEnter >", () => {
                beforeEach(() => {
                    subject.onMouseEnter();
                });

                it("should show popover on hover (mouse enter is one of its triggers here)", () => {
                    expect(subject.showPopover).toHaveBeenCalled();
                });
            });

            describe("onMouseEnter with delay >", () => {
                beforeEach(() => {
                    subject.delay = 1000;
                });

                it("should NOT show popover on hover before the delay", fakeAsync(() => {
                    subject.onMouseEnter();
                    tick(subject.delay - 500);

                    expect(subject.showPopover).not.toHaveBeenCalled();
                    flush();
                }));

                it("should NOT show popover on hover before the delay and clear previous interval", fakeAsync(() => {
                    // this 1st call prepares an interval
                    subject.onMouseEnter();

                    // calling 2nd time will clear the previous interval
                    subject.onMouseEnter();
                    tick(subject.delay - 500);
                    expect(subject.showPopover).not.toHaveBeenCalled();
                    flush();
                }));

                it("should show popover on hover after the delay elapsed", fakeAsync(() => {
                    subject.onMouseEnter();
                    tick(subject.delay + 500);
                    expect(subject.showPopover).toHaveBeenCalled();
                    flush();
                }));
            });

            describe("onMouseLeave >", () => {
                beforeEach(() => {
                    subject.onMouseLeave();
                });

                it("should NOT show popover on unhover (mouse leave is NOT a trigger here)", () => {
                    expect(subject.showPopover).not.toHaveBeenCalled();
                });
            });

            describe("onBackdropClick >", () => {
                it("should call popoverHoverSubject.next with backdrop-click param", () => {
                    const eventSubject = (subject["popoverModalEventSubject"] =
                        new Subject());
                    subject.modal = true;
                    spyOn(eventSubject, "next");
                    subject.onBackdropClick();
                    expect(eventSubject.next).toHaveBeenCalledWith(
                        "backdrop-click"
                    );
                });
            });
        });

        describe("popover resize >", () => {
            it("when overlay changes in size and resetSize gets called the height and width of the popover is undefined", () => {
                subject.showPopover();
                subject.overlayComponent.getOverlayRef().updateSize({
                    height: 100,
                    width: 100,
                });
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().height
                ).toEqual(100);
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().width
                ).toEqual(100);
                subject.resetSize();
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().height
                ).toBeUndefined();
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().width
                ).toBeUndefined();
            });
        });

        describe("popover options >", () => {
            it("should set the withGrowAfterOpen to true if the input is true", () => {
                subject.withGrowAfterOpen = true;
                subject.showPopover();
                expect(
                    // @ts-ignore
                    subject.overlayConfig.positionStrategy._growAfterOpen
                ).toBeTrue();
            });
        });
    });
});
