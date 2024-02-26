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

import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { PopupDeprecatedComponent } from "./popup.component";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";

describe("components >", () => {
    describe("popup >", () => {
        let subject: PopupDeprecatedComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [PopupDeprecatedComponent],
                providers: [
                    DomUtilService,
                    ChangeDetectorRef,
                    LoggerService,
                    EdgeDetectionService,
                ],
            });
            const componentFixture = TestBed.createComponent(
                PopupDeprecatedComponent
            );
            subject = componentFixture.componentInstance;
        });

        describe("toggleOpened >", () => {
            describe("on click", () => {
                const clickEvent = { type: "click" } as Event;
                it("should set opened if it is not", () => {
                    subject.isOpen = false;
                    subject.visible = false;
                    subject.toggleOpened(clickEvent);

                    expect(subject.isOpen).toBe(true);
                    expect(subject.visible).toBe(true);
                });

                it("should discard opened flag if it is", () => {
                    subject.isOpen = true;
                    subject.visible = true;
                    subject.toggleOpened(clickEvent);

                    expect(subject.visible).toBe(false);
                    expect(subject.isOpen).toBe(false);
                });

                it("should be opened if isOpen input is true", () => {
                    subject.isOpen = true;
                    subject.visible = false;
                    subject.ngOnInit();

                    expect(subject.visible).toBe(true);
                });

                it("should close popup", () => {
                    subject.isOpen = true;
                    subject.visible = true;

                    const mouseEvent = new MouseEvent("click");
                    subject.closePopup(mouseEvent);

                    expect(subject.visible).toBe(false);
                    expect(subject.isOpen).toBe(false);
                });
            });

            describe("on focus", () => {
                const focusInEvent = { type: "focusin" } as Event;
                const focusOutEvent = { type: "focusout" } as Event;
                it("should set opened if it is not", () => {
                    subject.isOpen = false;
                    subject.toggleOpened(focusInEvent);

                    expect(subject.isOpen).toBe(true);
                });

                it("should discard opened flag if it is", () => {
                    subject.isOpen = true;
                    subject.toggleOpened(focusInEvent);

                    expect(subject.isOpen).toBe(false);
                });

                xit("should not change flag on focusout if popup already open", () => {
                    subject.isOpen = false;
                    subject.toggleOpened(focusOutEvent);

                    expect(subject.isOpen).toBe(false);
                });
            });
        });
    });
});

export class MockElementRef extends ElementRef {
    constructor() {
        super(null);
    }
}
