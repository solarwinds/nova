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

import { PaginatorComponent } from "./paginator.component";
import { NuiPaginatorModule } from "./paginator.module";
import { LoggerService } from "../../services/log-service";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";

describe("components >", () => {
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
