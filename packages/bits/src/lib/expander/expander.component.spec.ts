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

import { Component, DebugElement, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ExpanderComponent } from "./expander.component";

const customHeaderHtml = `<div nuiExpanderHeader=""><p>Custom Projected Header</p></div>`;
const customBodyHtml = `<div><span>Covfefe</span></div>`;

@Component({
    template: `<nui-expander [open]="open"
        >${customHeaderHtml}${customBodyHtml}</nui-expander
    >`,
})
class ExpanderUsageWithContentComponent {
    @Input() open = false;
}

@Component({
    selector: "nui-icon",
    template: "",
})
class MockIconComponent {
    @Input() icon: string;
    @Input() iconColor: string;
}

describe("components >", () => {
    describe("expander >", () => {
        let subject: ExpanderComponent;
        let fixture: ComponentFixture<ExpanderComponent>;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ExpanderComponent,
                    ExpanderUsageWithContentComponent,
                    MockIconComponent,
                ],
            });
        });

        describe("DOM >", () => {
            describe("sets expected header icon >", () => {
                let headerIconEl: DebugElement;
                let headerIcon: MockIconComponent;

                beforeEach(() => {
                    fixture = TestBed.createComponent(ExpanderComponent);
                    subject = fixture.componentInstance;
                    headerIconEl = fixture.debugElement.query(
                        By.css(".nui-expander__header-icon")
                    );
                    headerIcon = headerIconEl.injector.get(MockIconComponent);
                });

                it("when open", () => {
                    subject.open = true;
                    fixture.detectChanges();
                    expect(headerIcon.icon).toBe("triangle-down");
                });

                it("when closed", () => {
                    subject.open = false;
                    fixture.detectChanges();
                    expect(headerIcon.icon).toBe("triangle-right");
                });

                it("when disabled", () => {
                    subject.disabled = true;
                    fixture.detectChanges();
                    expect(headerIcon.iconColor).toBe("gray");
                });
            });

            describe("sets expected header style >", () => {
                let headerEl: DebugElement;

                beforeEach(() => {
                    fixture = TestBed.createComponent(ExpanderComponent);
                    subject = fixture.componentInstance;
                    subject.header = "Expander title";
                    fixture.detectChanges();
                    headerEl = fixture.debugElement.query(
                        By.css(".nui-expander__header-content-wrapper")
                    );
                });

                it("when enabled", () => {
                    subject.disabled = false;
                    fixture.detectChanges();
                    expect(headerEl.classes["text-muted"]).toBeFalsy();
                });
            });

            describe("when header content is specified >", () => {
                let usageFixture: ComponentFixture<ExpanderUsageWithContentComponent>;
                let headerContentEls: DebugElement[];

                beforeEach(() => {
                    usageFixture = TestBed.createComponent(
                        ExpanderUsageWithContentComponent
                    );
                    usageFixture.detectChanges();
                    headerContentEls = usageFixture.debugElement.queryAll(
                        By.css(".nui-expander__header-content-wrapper>*")
                    );
                });

                it("projects expected content", () => {
                    expect(
                        headerContentEls[0].nativeElement.innerText.trim()
                    ).toBe("Custom Projected Header");
                });

                it("removes default header content", () => {
                    expect(headerContentEls.length).toBe(1);
                });
            });

            describe("when header content is not specified >", () => {
                const getHeaderContentIconEl = () =>
                    fixture.debugElement.query(
                        By.css(".nui-expander__header-content-icon")
                    );

                beforeEach(() => {
                    fixture = TestBed.createComponent(ExpanderComponent);
                    subject = fixture.componentInstance;
                });

                it("sets icon property of icon in default header if specified", () => {
                    subject.icon = "clown-shoes";
                    fixture.detectChanges();
                    const headerContentIconEl = getHeaderContentIconEl();
                    expect(headerContentIconEl).not.toBeNull();
                    const headerContentIcon =
                        headerContentIconEl.injector.get(MockIconComponent);
                    expect(headerContentIcon.icon).toBe("clown-shoes");
                });

                it("hides icon in default header if icon is not specified", () => {
                    fixture.detectChanges();
                    expect(getHeaderContentIconEl()).toBeNull();
                });

                it("sets expected header text in default header", () => {
                    subject.header = "Scrunch Bunch";
                    fixture.detectChanges();
                    const headerTextEl = fixture.debugElement.query(
                        By.css(".nui-expander__header-title")
                    );
                    expect(headerTextEl.nativeElement.innerHTML).toBe(
                        "Scrunch Bunch"
                    );
                });

                it("applies proper classes if header content is empty", () => {
                    subject.header = "";
                    fixture.detectChanges();
                    const headerElement = fixture.debugElement.query(
                        By.css(".nui-expander__header--empty")
                    );
                    const headerContentWrapperElement =
                        fixture.debugElement.query(
                            By.css(".nui-expander__custom-header--empty")
                        );
                    expect(headerElement).not.toBeNull();
                    expect(headerContentWrapperElement).not.toBeNull();
                    expect(subject.isCustomHeaderContentEmpty).toEqual(true);
                });
            });

            describe("when body content is specified", () => {
                let usageFixture: ComponentFixture<ExpanderUsageWithContentComponent>;
                let usageSubject: ExpanderUsageWithContentComponent;
                const getBodyContentEl = () =>
                    usageFixture.debugElement.query(
                        By.css(".nui-expander__body-wrapper")
                    );

                beforeEach(() => {
                    usageFixture = TestBed.createComponent(
                        ExpanderUsageWithContentComponent
                    );
                    usageSubject = usageFixture.componentInstance;
                });

                it("should project content when open", () => {
                    usageSubject.open = true;
                    usageFixture.detectChanges();
                    expect(getBodyContentEl()).not.toBeNull();
                });

                it("should not project content when closed", () => {
                    usageSubject.open = false;
                    usageFixture.detectChanges();
                    expect(
                        getBodyContentEl().nativeElement.innerHTML
                    ).not.toContain(customBodyHtml);
                });
            });

            it("toggles open state when header is clicked", () => {
                fixture = TestBed.createComponent(ExpanderComponent);
                subject = fixture.componentInstance;
                const wasOpen = subject.open;
                const headerEl = fixture.debugElement.query(
                    By.css(".nui-expander__header")
                );
                headerEl.triggerEventHandler("click", null);
                expect(subject.open).not.toEqual(wasOpen);
            });
        });

        describe("toggle >", () => {
            beforeEach(() => {
                subject =
                    TestBed.createComponent(
                        ExpanderComponent
                    ).componentInstance;
            });

            describe("when enabled >", () => {
                describe("when closed >", () => {
                    beforeEach(() => {
                        subject.open = false;
                    });

                    it("sets open state to true", () => {
                        subject.toggle();
                        expect(subject.open).toBeTruthy();
                    });

                    it("emits open change event with expected value", (done: Function) => {
                        subject.openChange.subscribe((isOpen: boolean) => {
                            expect(isOpen).toBeTruthy();
                            done();
                        });
                        subject.toggle();
                    });
                });

                describe("when open >", () => {
                    beforeEach(() => {
                        subject.open = true;
                    });

                    it("sets open state to false", () => {
                        subject.toggle();
                        expect(subject.open).toBeFalsy();
                    });

                    it("emits open change event with expected value", (done: Function) => {
                        subject.openChange.subscribe((isOpen: boolean) => {
                            expect(isOpen).toBeFalsy();
                            done();
                        });
                        subject.toggle();
                    });
                });
            });

            describe("when disabled >", () => {
                it("does not change open state when it is false", () => {
                    subject.open = false;
                    subject.disabled = true;
                    subject.toggle();
                    expect(subject.open).toBeFalsy();
                });

                it("does not change open state when it is true", () => {
                    subject.open = true;
                    subject.disabled = true;
                    subject.toggle();
                    expect(subject.open).toBeTruthy();
                });

                it("does not emit open change event", (done: any) => {
                    subject.openChange.subscribe(done.fail);
                    subject.disabled = true;
                    subject.toggle();
                    done();
                });
            });
        });
    });
});
