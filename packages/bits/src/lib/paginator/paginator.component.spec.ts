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

import { OverlayModule } from "@angular/cdk/overlay";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, SimpleChange, SimpleChanges } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
    waitForAsync,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import noop from "lodash/noop";

import { PaginatorPopupKeyboardController } from "./paginator-popup-keyboard.controller";
import { PaginatorComponent } from "./paginator.component";
import { NuiPaginatorModule } from "./paginator.module";
import { LoggerService } from "../../services/log-service";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";

describe("components >", () => {
    describe("paginator popup keyboard controller >", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiPaginatorModule],
            });
        });

        it("should provide an isolated controller for each paginator", () => {
            const firstFixture = TestBed.createComponent(PaginatorComponent);
            const secondFixture = TestBed.createComponent(PaginatorComponent);

            const firstController = firstFixture.debugElement.injector.get(
                PaginatorPopupKeyboardController
            );
            const secondController = secondFixture.debugElement.injector.get(
                PaginatorPopupKeyboardController
            );

            expect(firstController).not.toBe(secondController);

            firstFixture.destroy();
            secondFixture.destroy();
        });

        it("should use a replaceable component provider", () => {
            const replacement =
                jasmine.createSpyObj<PaginatorPopupKeyboardController>(
                    "popupKeyboardController",
                    ["setPopupContext", "onPopupOpened", "destroy"]
                );
            TestBed.overrideComponent(PaginatorComponent, {
                add: {
                    providers: [
                        {
                            provide: PaginatorPopupKeyboardController,
                            useValue: replacement,
                        },
                    ],
                },
            });

            const fixture = TestBed.createComponent(PaginatorComponent);
            const injectedController = fixture.debugElement.injector.get(
                PaginatorPopupKeyboardController
            );
            const popup = jasmine.createSpyObj<PopupComponent>("popup", [
                "closePopup",
            ]);
            fixture.componentInstance.onPopupOpened(false, popup);

            expect(injectedController).toBe(replacement);
            expect(replacement.setPopupContext).toHaveBeenCalledWith(
                jasmine.any(Function),
                jasmine.any(Function)
            );
            expect(replacement.onPopupOpened).toHaveBeenCalledWith(
                false,
                popup
            );

            fixture.destroy();
            expect(replacement.destroy).toHaveBeenCalledTimes(1);
        });
    });

    describe("paginator >", () => {
        let subject: PaginatorComponent;
        let fixture: ComponentFixture<PaginatorComponent>;
        const total = 1000;
        const pageSize = 25;
        const page = 3;
        const pageSizeSet = [5, 15, 25, 50, 170];
        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [OverlayModule],
                providers: [ChangeDetectorRef],
            });

            const logger = TestBed.inject(LoggerService);
            spyOnProperty(logger, "warn").and.returnValue(noop);

            fixture = TestBed.createComponent(PaginatorComponent);
            subject = fixture.componentInstance;
            subject.total = total;
            subject.pageSize = pageSize;
            subject.page = page;
            subject.ngOnInit();
        }));

        it("should select page number " + page, () => {
            subject.goToPage(3);
            expect(subject.page).toEqual(3);
        });

        it("should have pageSize equal to " + pageSize, () => {
            subject.setItemsPerPage({
                newValue: pageSize,
                oldValue: pageSize - 1,
            });
            expect(subject.pageSize).toEqual(pageSize);
        });

        it("should have first item on the page equal to 51", () => {
            expect(subject.getFirstItemOnPage()).toEqual(51);
        });

        it("should have last item on the page equal to 75", () => {
            expect(subject.getLastItemOnPage()).toEqual(75);
        });

        it("should have page count equal to 40", () => {
            expect(subject.getPageCount()).toEqual(40);
        });

        it("should have items count in paginator equal to 7", () => {
            expect(subject.adjacent).toEqual(1);
            const changes: SimpleChanges = {
                page: new SimpleChange(3, 1, true),
            };
            subject.ngOnChanges(changes);
            // "< 1 2 3 4 5 ... 40 >" - including arrows -> 9
            expect(subject.itemsList.length).toEqual(9);
        });

        it("should not override custom pageSizeSet", () => {
            subject.pageSizeSet = pageSizeSet;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);
        });

        it("should not add custom page size to default pageSizeSet", () => {
            expect(subject.pageSizeSet).toEqual([10, 25, 50, 100]);
            subject.pageSize = 35;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([10, 25, 50, 100]);
        });

        it("should not add custom page size to custom pageSizeSet", () => {
            subject.pageSizeSet = pageSizeSet;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);

            subject.pageSize = 35;
            subject.ngOnInit();
            expect(subject.pageSizeSet).toEqual([5, 15, 25, 50, 170]);
        });
    });

    describe("paginator focus >", () => {
        let subject: PaginatorComponent;
        let fixture: ComponentFixture<PaginatorComponent>;
        let host: HTMLElement;

        const render = (pageCount: number, page: number): void => {
            subject.pageSize = 10;
            subject.total = pageCount * 10;
            subject.page = page;
            subject.ngOnChanges({ page: new SimpleChange(1, page, true) });
        };
        const button = (
            selector: string,
            root: HTMLElement = host
        ): HTMLButtonElement =>
            root.querySelector<HTMLButtonElement>(
                selector
            ) as HTMLButtonElement;
        const byLabel = (label: string): HTMLButtonElement =>
            button(`button[aria-label="${label}"]`);
        const activeElement = (): Element | null => document.activeElement;
        const popupComponent = (): PopupComponent =>
            fixture.debugElement.query(By.directive(PopupComponent))
                .componentInstance;
        const openPopup = (): HTMLElement => {
            button(".nui-paginator__dots").click();
            TestBed.tick();
            return popupComponent().popup.getOverlayRef().overlayElement;
        };
        const keydown = (target: HTMLElement, init: KeyboardEventInit) => {
            const event = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                ...init,
            });
            target.dispatchEvent(event);
            return event;
        };
        const simulateVirtualPageSlice = (
            root: HTMLElement,
            firstPage: number
        ): void => {
            // The test fixture has no scroll layout, so represent a later slice.
            root.querySelectorAll<HTMLButtonElement>(
                "button[data-nui-paginator-page]"
            ).forEach((pageButton, index) => {
                pageButton.dataset.nuiPaginatorPage = String(firstPage + index);
            });
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiPaginatorModule],
            });
            fixture = TestBed.createComponent(PaginatorComponent);
            subject = fixture.componentInstance;
            host = fixture.nativeElement;
        });

        it("should keep focus on the activated page and Next buttons while they stay enabled", () => {
            render(5, 1);
            byLabel("Page 3").focus();

            byLabel("Page 3").click();

            expect(subject.page).toBe(3);
            expect(activeElement()).toBe(byLabel("Page 3"));

            byLabel("Next Page").focus();
            byLabel("Next Page").click();

            expect(subject.page).toBe(4);
            expect(activeElement()).toBe(byLabel("Next Page"));
        });

        it("should move focus to the current page when Next becomes disabled", () => {
            render(5, 4);
            byLabel("Next Page").focus();

            byLabel("Next Page").click();
            TestBed.tick();

            expect(subject.page).toBe(5);
            expect(byLabel("Next Page").disabled).toBeTrue();
            expect(activeElement()).toBe(button("button[aria-current=page]"));
        });

        it("should restore focus after Next becomes disabled inside a shadow root", fakeAsync(() => {
            render(5, 4);
            const shadowHost = document.createElement("div");
            document.body.appendChild(shadowHost);
            const shadowRoot = shadowHost.attachShadow({ mode: "open" });
            shadowRoot.appendChild(host);

            try {
                const nextPage = byLabel("Next Page");
                nextPage.focus();
                expect(shadowRoot.activeElement).toBe(nextPage);

                nextPage.click();
                TestBed.tick();

                expect(nextPage.disabled).toBeTrue();
                expect(shadowRoot.activeElement).toBe(
                    button("button[aria-current=page]")
                );
            } finally {
                fixture.destroy();
                shadowHost.remove();
            }
        }));

        it("should restore focus after a parent update inside a shadow root", fakeAsync(() => {
            render(5, 4);
            const shadowHost = document.createElement("div");
            document.body.appendChild(shadowHost);
            const shadowRoot = shadowHost.attachShadow({ mode: "open" });
            shadowRoot.appendChild(host);

            try {
                const nextPage = byLabel("Next Page");
                nextPage.focus();

                subject.page = 5;
                subject.ngOnChanges({
                    page: new SimpleChange(4, 5, false),
                });
                TestBed.tick();

                expect(nextPage.disabled).toBeTrue();
                expect(shadowRoot.activeElement).toBe(
                    button("button[aria-current=page]")
                );
            } finally {
                fixture.destroy();
                shadowHost.remove();
            }
        }));

        it("should move focus to the current page when Previous becomes disabled", () => {
            render(5, 2);
            byLabel("Previous Page").focus();

            byLabel("Previous Page").click();
            TestBed.tick();

            expect(subject.page).toBe(1);
            expect(byLabel("Previous Page").disabled).toBeTrue();
            expect(activeElement()).toBe(button("button[aria-current=page]"));
        });

        it("should not take focus when it was outside the paginator", () => {
            render(5, 1);
            const outside = document.createElement("button");
            document.body.appendChild(outside);
            outside.focus();

            subject.goToPage(3);
            TestBed.tick();

            expect(activeElement()).toBe(outside);
            outside.remove();
        });

        it("should not take focus from an external control in the same shadow root", () => {
            render(5, 1);
            const shadowHost = document.createElement("div");
            document.body.appendChild(shadowHost);
            const shadowRoot = shadowHost.attachShadow({ mode: "open" });
            shadowRoot.appendChild(host);
            const outside = document.createElement("button");
            shadowRoot.appendChild(outside);

            try {
                outside.focus();
                subject.goToPage(3);
                TestBed.tick();

                expect(shadowRoot.activeElement).toBe(outside);
            } finally {
                fixture.destroy();
                shadowHost.remove();
            }
        });

        it("should restore focus after popup selection inside a shadow root", fakeAsync(() => {
            subject.appendToBody = false;
            render(40, 1);
            const shadowHost = document.createElement("div");
            document.body.appendChild(shadowHost);
            const shadowRoot = shadowHost.attachShadow({ mode: "open" });
            shadowRoot.appendChild(host);

            try {
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const popupButton = button(
                    `button[aria-label="Go to page 20"]`,
                    popupRoot
                );
                popupButton.focus();
                expect(shadowRoot.activeElement).toBe(popupButton);

                popupButton.click();
                TestBed.tick();
                tick();

                expect(subject.page).toBe(20);
                expect(shadowRoot.activeElement).toBe(
                    button("button[aria-current=page]")
                );
            } finally {
                fixture.destroy();
                shadowHost.remove();
            }
        }));

        it("should move focus to the current page when the parent changes the page and Next becomes disabled", () => {
            render(5, 4);
            byLabel("Next Page").focus();

            render(5, 5);
            TestBed.tick();

            expect(byLabel("Next Page").disabled).toBeTrue();
            expect(activeElement()).toBe(button("button[aria-current=page]"));
        });

        [false, true].forEach(appendToBody => {
            [40, 1100].forEach(pageCount => {
                it(`should restore focus after popup selection with appendToBody=${appendToBody} and ${pageCount} pages`, fakeAsync(() => {
                    subject.appendToBody = appendToBody;
                    render(pageCount, 1);
                    const popupRoot = openPopup();
                    // Allow the virtual viewport's animation-frame render to finish.
                    tick(20);
                    fixture.detectChanges();
                    const popupButton = button(
                        `button[aria-label="Go to page 20"]`,
                        popupRoot
                    );
                    popupButton.focus();
                    expect(activeElement()).toBe(popupButton);
                    expect(host.contains(popupButton)).toBe(!appendToBody);

                    popupButton.click();
                    TestBed.tick();

                    expect(subject.page).toBe(20);
                    expect(popupButton.isConnected).toBeFalse();
                    expect(activeElement()).toBe(
                        button("button[aria-current=page]")
                    );
                }));
            });
        });

        [false, true].forEach(appendToBody => {
            it(`should queue Tab navigation beyond the rendered virtual pages with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                const viewportElement = viewport.elementRef.nativeElement;
                const pages = popupRoot.querySelectorAll<HTMLButtonElement>(
                    "button[data-nui-paginator-page]"
                );
                const lastRendered = pages[pages.length - 1];
                const lastPage = Number(
                    lastRendered.getAttribute("data-nui-paginator-page")
                );
                expect(lastPage).toBeLessThan(1999);
                const scrollToIndex = spyOn(
                    viewport,
                    "scrollToIndex"
                ).and.stub();
                lastRendered.focus({ preventScroll: true });

                const firstTab = keydown(lastRendered, {
                    key: "Tab",
                    code: "Tab",
                });
                expect(firstTab.defaultPrevented).toBeTrue();
                expect(activeElement()).toBe(viewportElement);
                expect(popupComponent().isOpen).toBeTrue();
                expect(scrollToIndex).toHaveBeenCalledWith(
                    Math.floor((lastPage + 1 - 6) / 5)
                );

                const secondTab = keydown(viewportElement, {
                    key: "Tab",
                    code: "Tab",
                });
                expect(secondTab.defaultPrevented).toBeTrue();
                expect(scrollToIndex).toHaveBeenCalledWith(
                    Math.floor((lastPage + 2 - 6) / 5)
                );

                const reverseTab = keydown(viewportElement, {
                    key: "Tab",
                    code: "Tab",
                    shiftKey: true,
                });
                expect(reverseTab.defaultPrevented).toBeTrue();
                expect(scrollToIndex).toHaveBeenCalledWith(
                    Math.floor((lastPage + 1 - 6) / 5)
                );

                keydown(viewportElement, { key: "Escape", code: "Escape" });
                tick();
                expect(popupComponent().isOpen).toBeFalse();
                expect(activeElement()).toBe(button(".nui-paginator__dots"));
            }));

            it(`should clean up pending virtual navigation when destroyed with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const popup = popupComponent();
                const subscribe = spyOn(
                    popup.opened,
                    "subscribe"
                ).and.callThrough();
                const disconnect = spyOn(
                    MutationObserver.prototype,
                    "disconnect"
                ).and.callThrough();
                const warn = jasmine.createSpy("warn");
                spyOnProperty(
                    TestBed.inject(LoggerService),
                    "warn"
                ).and.returnValue(warn);
                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                spyOn(viewport, "scrollToIndex").and.stub();
                const pages = popupRoot.querySelectorAll<HTMLButtonElement>(
                    "button[data-nui-paginator-page]"
                );
                const lastRendered = pages[pages.length - 1];
                const nextPage =
                    Number(lastRendered.dataset.nuiPaginatorPage) + 1;
                const controller = fixture.debugElement.injector.get(
                    PaginatorPopupKeyboardController
                );
                const destroy = spyOn(controller, "destroy").and.callThrough();

                lastRendered.focus({ preventScroll: true });
                keydown(lastRendered, { key: "Tab", code: "Tab" });

                const closeSubscription =
                    subscribe.calls.mostRecent().returnValue;
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);
                expect(closeSubscription.closed).toBeFalse();

                fixture.destroy();

                expect(destroy).toHaveBeenCalledTimes(1);
                expect(closeSubscription.closed).toBeTrue();
                expect(disconnect).toHaveBeenCalled();
                tick(5000);
                expect(warn).not.toHaveBeenCalledWith(
                    `Timed out focusing virtual paginator page ${nextPage}.`
                );
            }));

            it(`should not restore pending virtual focus after focus leaves with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                spyOn(viewport, "scrollToIndex").and.stub();
                const pages = popupRoot.querySelectorAll<HTMLButtonElement>(
                    "button[data-nui-paginator-page]"
                );
                const lastRendered = pages[pages.length - 1];
                const nextPage =
                    Number(lastRendered.dataset.nuiPaginatorPage) + 1;
                lastRendered.focus({ preventScroll: true });
                keydown(lastRendered, { key: "Tab", code: "Tab" });
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);

                const outside = document.createElement("button");
                document.body.appendChild(outside);
                outside.focus();
                const latePage = document.createElement("button");
                latePage.dataset.nuiPaginatorPage = String(nextPage);
                popupRoot.appendChild(latePage);
                tick(20);

                expect(popupComponent().isOpen).toBeFalse();
                expect(activeElement()).toBe(outside);
                outside.remove();
            }));

            it(`should cancel pending virtual focus after a null related target with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                spyOn(viewport, "scrollToIndex").and.stub();
                const pages = popupRoot.querySelectorAll<HTMLButtonElement>(
                    "button[data-nui-paginator-page]"
                );
                const firstPage = pages[0];
                const lastRendered = pages[pages.length - 1];
                const nextPage =
                    Number(lastRendered.dataset.nuiPaginatorPage) + 1;
                lastRendered.focus({ preventScroll: true });
                keydown(lastRendered, { key: "Tab", code: "Tab" });
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);

                viewport.elementRef.nativeElement.blur();
                firstPage.focus();
                const latePage = document.createElement("button");
                latePage.dataset.nuiPaginatorPage = String(nextPage);
                popupRoot.appendChild(latePage);
                tick(20);

                expect(popupComponent().isOpen).toBeTrue();
                expect(activeElement()).toBe(firstPage);
            }));

            it(`should report and recover if a virtual page never renders with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const warn = jasmine.createSpy("warn");
                spyOnProperty(
                    TestBed.inject(LoggerService),
                    "warn"
                ).and.returnValue(warn);
                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                spyOn(viewport, "checkViewportSize").and.stub();
                spyOn(viewport, "scrollToIndex").and.stub();
                const pages = popupRoot.querySelectorAll<HTMLButtonElement>(
                    "button[data-nui-paginator-page]"
                );
                const lastRendered = pages[pages.length - 1];
                const nextPage =
                    Number(lastRendered.dataset.nuiPaginatorPage) + 1;
                lastRendered.focus({ preventScroll: true });

                keydown(lastRendered, { key: "Tab", code: "Tab" });
                tick(4999);
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);
                expect(warn).not.toHaveBeenCalled();

                tick(1);
                expect(warn).toHaveBeenCalledWith(
                    `Timed out focusing virtual paginator page ${nextPage}.`
                );
                expect(activeElement()).toBe(button(".nui-paginator__dots"));
                expect(popupComponent().isOpen).toBeFalse();
            }));

            it(`should queue focus at the first page when entering a scrolled virtual popup with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;
                simulateVirtualPageSlice(popupRoot, 506);
                const scrollToIndex = spyOn(
                    viewport,
                    "scrollToIndex"
                ).and.stub();
                const trigger = button(".nui-paginator__dots");
                trigger.focus();

                const firstTab = keydown(trigger, {
                    key: "Tab",
                    code: "Tab",
                });
                expect(firstTab.defaultPrevented).toBeTrue();
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);
                expect(scrollToIndex).toHaveBeenCalledWith(0);

                const secondTab = keydown(viewport.elementRef.nativeElement, {
                    key: "Tab",
                    code: "Tab",
                });
                expect(secondTab.defaultPrevented).toBeTrue();
                expect(scrollToIndex).toHaveBeenCalledTimes(2);
                expect(popupComponent().isOpen).toBeTrue();

                keydown(viewport.elementRef.nativeElement, {
                    key: "Escape",
                    code: "Escape",
                });
                tick();
            }));

            it(`should navigate to the preceding virtual page from a rendered boundary with appendToBody=${appendToBody}`, fakeAsync(() => {
                subject.appendToBody = appendToBody;
                render(2000, 1);
                const popupRoot = openPopup();
                tick(20);
                fixture.detectChanges();

                const viewport = fixture.debugElement.query(
                    By.directive(CdkVirtualScrollViewport)
                ).componentInstance as CdkVirtualScrollViewport;

                simulateVirtualPageSlice(popupRoot, 506);

                const firstRendered = button(
                    "button[data-nui-paginator-page]",
                    popupRoot
                );
                const firstRenderedPage = Number(
                    firstRendered.getAttribute("data-nui-paginator-page")
                );
                expect(firstRenderedPage).toBeGreaterThan(6);
                const scrollToIndex = spyOn(
                    viewport,
                    "scrollToIndex"
                ).and.stub();
                firstRendered.focus({ preventScroll: true });

                const event = keydown(firstRendered, {
                    key: "Tab",
                    code: "Tab",
                    shiftKey: true,
                });
                expect(event.defaultPrevented).toBeTrue();
                expect(popupComponent().isOpen).toBeTrue();
                expect(activeElement()).toBe(viewport.elementRef.nativeElement);
                expect(scrollToIndex).toHaveBeenCalledWith(
                    Math.floor((firstRenderedPage - 1 - 6) / 5)
                );

                keydown(viewport.elementRef.nativeElement, {
                    key: "Escape",
                    code: "Escape",
                });
                tick();
            }));
        });

        [false, true].forEach(appendToBody => {
            describe(`popup keyboard with appendToBody=${appendToBody} >`, () => {
                let outside: HTMLButtonElement;

                const open = (): HTMLElement => {
                    subject.appendToBody = appendToBody;
                    render(40, 1);
                    const popupRoot = openPopup();
                    tick(20);
                    fixture.detectChanges();
                    return popupRoot;
                };

                beforeEach(() => {
                    outside = document.createElement("button");
                    document.body.appendChild(outside);
                });

                afterEach(() => outside.remove());

                it("should close the popup on Escape and return focus to the trigger", fakeAsync(() => {
                    const popupRoot = open();
                    const trigger = button(".nui-paginator__dots");
                    button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    ).focus();

                    const event = keydown(activeElement() as HTMLElement, {
                        key: "Escape",
                        code: "Escape",
                    });
                    tick();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(popupComponent().isOpen).toBeFalse();
                    expect(activeElement()).toBe(trigger);
                }));

                it("should close the popup on Escape pressed on the trigger", fakeAsync(() => {
                    open();
                    const trigger = button(".nui-paginator__dots");
                    trigger.focus();

                    keydown(trigger, { key: "Escape", code: "Escape" });
                    tick();

                    expect(popupComponent().isOpen).toBeFalse();
                    expect(activeElement()).toBe(trigger);
                }));

                it("should close the popup when focus moves outside of it", fakeAsync(() => {
                    const popupRoot = open();
                    button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    ).focus();

                    outside.focus();
                    tick();

                    expect(popupComponent().isOpen).toBeFalse();
                    expect(activeElement()).toBe(outside);
                }));

                it("should close the popup when focus leaves without a related target", fakeAsync(() => {
                    const popupRoot = open();
                    const pageButton = button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    pageButton.blur();
                    tick();

                    expect(popupComponent().isOpen).toBeFalse();
                    expect(activeElement()).toBe(document.body);
                }));

                it("should keep the popup open when focus returns inside after a null related target", fakeAsync(() => {
                    const popupRoot = open();
                    const firstPage = button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    );
                    const nextPage = button(
                        `button[aria-label="Go to page 8"]`,
                        popupRoot
                    );
                    firstPage.focus();

                    firstPage.blur();
                    queueMicrotask(() => nextPage.focus());
                    tick();

                    expect(popupComponent().isOpen).toBeTrue();
                    expect(activeElement()).toBe(nextPage);
                }));

                it("should keep the popup open when a null related target does not move focus", fakeAsync(() => {
                    const popupRoot = open();
                    const pageButton = button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    pageButton.dispatchEvent(
                        new FocusEvent("focusout", {
                            bubbles: true,
                            relatedTarget: null,
                        })
                    );
                    tick();

                    expect(popupComponent().isOpen).toBeTrue();
                    expect(activeElement()).toBe(pageButton);
                }));

                it("should keep the popup open when focus returns to its trigger in a shadow root", fakeAsync(() => {
                    const shadowHost = document.createElement("div");
                    document.body.appendChild(shadowHost);
                    const shadowRoot = shadowHost.attachShadow({
                        mode: "open",
                    });
                    shadowRoot.appendChild(host);

                    try {
                        const popupRoot = open();
                        const trigger = button(".nui-paginator__dots");
                        const pageButton = button(
                            `button[aria-label="Go to page 7"]`,
                            popupRoot
                        );
                        pageButton.focus();

                        pageButton.blur();
                        queueMicrotask(() => trigger.focus());
                        tick();

                        expect(popupComponent().isOpen).toBeTrue();
                        expect(shadowRoot.activeElement).toBe(trigger);
                    } finally {
                        fixture.destroy();
                        shadowHost.remove();
                    }
                }));

                it("should keep the popup open when focus moves directly to its shadow-root trigger", fakeAsync(() => {
                    const shadowHost = document.createElement("div");
                    document.body.appendChild(shadowHost);
                    const shadowRoot = shadowHost.attachShadow({
                        mode: "open",
                    });
                    shadowRoot.appendChild(host);

                    try {
                        const popupRoot = open();
                        const trigger = button(".nui-paginator__dots");
                        button(
                            `button[aria-label="Go to page 7"]`,
                            popupRoot
                        ).focus();

                        trigger.focus();
                        tick();

                        expect(popupComponent().isOpen).toBeTrue();
                        expect(shadowRoot.activeElement).toBe(trigger);
                    } finally {
                        fixture.destroy();
                        shadowHost.remove();
                    }
                }));

                it("should close the popup when focus moves to another element in the trigger's shadow root", fakeAsync(() => {
                    const shadowHost = document.createElement("div");
                    document.body.appendChild(shadowHost);
                    const shadowRoot = shadowHost.attachShadow({
                        mode: "open",
                    });
                    shadowRoot.appendChild(host);
                    const shadowOutside = document.createElement("button");
                    shadowRoot.appendChild(shadowOutside);

                    try {
                        const popupRoot = open();
                        button(
                            `button[aria-label="Go to page 7"]`,
                            popupRoot
                        ).focus();

                        shadowOutside.focus();
                        tick();

                        expect(popupComponent().isOpen).toBeFalse();
                        expect(shadowRoot.activeElement).toBe(shadowOutside);
                    } finally {
                        fixture.destroy();
                        shadowHost.remove();
                    }
                }));

                it("should cancel a delayed focus check when the popup is reopened", fakeAsync(() => {
                    const popupRoot = open();
                    const popup = popupComponent();
                    const pageButton = button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    pageButton.blur();
                    popup.closePopup();
                    popup.isOpen = true;
                    tick();

                    expect(popup.isOpen).toBeTrue();
                    expect(popup.visible).toBeTrue();
                }));

                it("should cancel a delayed focus check when destroyed", fakeAsync(() => {
                    const popupRoot = open();
                    const popup = popupComponent();
                    const closePopup = spyOn(
                        popup,
                        "closePopup"
                    ).and.callThrough();
                    const pageButton = button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    pageButton.blur();
                    fixture.destroy();
                    tick();

                    expect(closePopup).not.toHaveBeenCalled();
                }));

                it("should close the popup when its focused page is removed during a total update", fakeAsync(() => {
                    const popupRoot = open();
                    const popup = popupComponent();
                    const pageButton = button(
                        `button[aria-label="Go to page 6"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    subject.total = 410;
                    subject.ngOnChanges({
                        total: new SimpleChange(400, 410, false),
                    });
                    TestBed.tick();
                    tick();

                    expect(pageButton.isConnected).toBeFalse();
                    expect(popup.isOpen).toBeFalse();
                    expect(activeElement()).toBe(
                        button("button[aria-current=page]")
                    );
                }));

                it("should close the popup when focusout does not bubble and focus state is temporarily stale", fakeAsync(() => {
                    const popupRoot = open();
                    const popup = popupComponent();
                    const pageButton = button(
                        `button[aria-label="Go to page 6"]`,
                        popupRoot
                    );
                    const matches = popupRoot.matches.bind(popupRoot);
                    let focusStateIsStale = true;
                    spyOn(popupRoot, "matches").and.callFake(
                        selector =>
                            (selector === ":focus-within" &&
                                focusStateIsStale) ||
                            matches(selector)
                    );
                    pageButton.focus();
                    pageButton.addEventListener(
                        "focusout",
                        event => event.stopPropagation(),
                        { once: true }
                    );

                    subject.total = 410;
                    subject.ngOnChanges({
                        total: new SimpleChange(400, 410, false),
                    });
                    focusStateIsStale = false;
                    TestBed.tick();
                    tick();

                    expect(pageButton.isConnected).toBeFalse();
                    expect(popup.isOpen).toBeFalse();
                    expect(activeElement()).toBe(
                        button("button[aria-current=page]")
                    );
                }));

                it("should keep the popup open when a total update leaves focus on its trigger", fakeAsync(() => {
                    open();
                    const trigger = button(".nui-paginator__dots");
                    trigger.focus();

                    subject.total = 410;
                    subject.ngOnChanges({
                        total: new SimpleChange(400, 410, false),
                    });
                    TestBed.tick();
                    tick();

                    expect(popupComponent().isOpen).toBeTrue();
                    expect(activeElement()).toBe(trigger);
                }));

                it("should keep the popup open when focus returns inside during a total update", fakeAsync(() => {
                    const popupRoot = open();
                    const pageButton = button(
                        `button[aria-label="Go to page 6"]`,
                        popupRoot
                    );
                    pageButton.focus();

                    subject.total = 410;
                    subject.ngOnChanges({
                        total: new SimpleChange(400, 410, false),
                    });
                    const replacement = button(
                        `button[aria-label="Go to page 6"]`,
                        popupRoot
                    );
                    replacement.focus();
                    TestBed.tick();
                    tick();

                    expect(replacement).not.toBe(pageButton);
                    expect(popupComponent().isOpen).toBeTrue();
                    expect(activeElement()).toBe(replacement);
                }));

                it("should close the popup when a page change removes its focused page", fakeAsync(() => {
                    const popupRoot = open();
                    const popup = popupComponent();
                    button(
                        `button[aria-label="Go to page 6"]`,
                        popupRoot
                    ).focus();

                    subject.goToPage(6);
                    TestBed.tick();
                    tick();

                    expect(popup.isOpen).toBeFalse();
                    expect(activeElement()).toBe(
                        button("button[aria-current=page]")
                    );
                }));

                it("should keep the popup open while focus moves between the trigger and its pages", fakeAsync(() => {
                    const popupRoot = open();

                    button(".nui-paginator__dots").focus();
                    button(
                        `button[aria-label="Go to page 7"]`,
                        popupRoot
                    ).focus();
                    tick();

                    expect(popupComponent().isOpen).toBeTrue();
                }));

                it("should move focus from the trigger straight into the popup on Tab", fakeAsync(() => {
                    const popupRoot = open();
                    const trigger = button(".nui-paginator__dots");
                    trigger.focus();

                    const event = keydown(trigger, { key: "Tab", code: "Tab" });

                    expect(event.defaultPrevented).toBeTrue();
                    expect(activeElement()).toBe(
                        button(`button[aria-label="Go to page 6"]`, popupRoot)
                    );
                }));

                it("should return focus to the trigger and close the popup when tabbing past its last page", fakeAsync(() => {
                    const popupRoot = open();
                    const pages = popupRoot.querySelectorAll("button");
                    (pages[pages.length - 1] as HTMLElement).focus();

                    keydown(activeElement() as HTMLElement, {
                        key: "Tab",
                        code: "Tab",
                    });
                    tick();

                    expect(activeElement()).toBe(
                        button(".nui-paginator__dots")
                    );
                    expect(popupComponent().isOpen).toBeFalse();
                }));

                it("should return focus to the trigger when Shift+Tab is pressed on the first page", fakeAsync(() => {
                    const popupRoot = open();
                    (popupRoot.querySelector("button") as HTMLElement).focus();

                    const event = keydown(activeElement() as HTMLElement, {
                        key: "Tab",
                        code: "Tab",
                        shiftKey: true,
                    });
                    tick();

                    expect(event.defaultPrevented).toBeTrue();
                    expect(activeElement()).toBe(
                        button(".nui-paginator__dots")
                    );
                    expect(popupComponent().isOpen).toBeFalse();
                }));
            });
        });

        it("should preserve focus moved outside after body-appended popup selection", fakeAsync(() => {
            subject.appendToBody = true;
            render(40, 1);
            const popupButton = button(
                `button[aria-label="Go to page 20"]`,
                openPopup()
            );
            const outside = document.createElement("button");
            document.body.appendChild(outside);
            try {
                popupButton.focus();
                popupButton.click();
                outside.focus();
                TestBed.tick();

                expect(subject.page).toBe(20);
                expect(activeElement()).toBe(outside);
            } finally {
                outside.remove();
                flush();
            }
        }));
    });
});
