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

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { DomUtilService } from "./dom-util.service";

describe("services >", () => {
    describe("DomUtilService >", () => {
        let domUtilService: DomUtilService;
        let fixture: ComponentFixture<DomUtilServiceTestComponent>;
        let sourceElement: HTMLElement;

        @Component({})
        class DomUtilServiceTestComponent {}

        const createHtml = () =>
            `<span id="match-by-tag">
                        <div id="match-by-class" class="match-class">
                            <div>
                                <div id="source-element"></div>
                            </div>
                        </div>
                    </span>`;

        const createTestComponent = async () => {
            TestBed.overrideComponent(DomUtilServiceTestComponent, {
                set: {
                    template: createHtml(),
                },
            });
            await TestBed.compileComponents();
            return TestBed.createComponent(DomUtilServiceTestComponent);
        };

        beforeEach(() => {
            domUtilService = new DomUtilService(document);
            TestBed.configureTestingModule({
                declarations: [DomUtilServiceTestComponent],
            });
        });
        beforeEach(async () => {
            fixture = await createTestComponent();
            sourceElement = fixture.debugElement.query(
                By.css("#source-element")
            ).nativeElement;
        });

        describe("getClosest > ", () => {
            it("should get the closest matching element by class", () => {
                const matchingParent = fixture.debugElement.query(
                    By.css("#match-by-class")
                ).nativeElement;

                expect(
                    domUtilService.getClosest(sourceElement, ".match-class")
                ).toEqual(matchingParent);
            });

            it("should get the closest matching element by tag", () => {
                const matchingParent = fixture.debugElement.query(
                    By.css("#match-by-tag")
                ).nativeElement;

                expect(
                    domUtilService.getClosest(sourceElement, "span")
                ).toEqual(matchingParent);
            });

            it("should return null if no match is found", () => {
                expect(
                    domUtilService.getClosest(
                        sourceElement,
                        ".non-existent-class"
                    )
                ).toEqual(null);
            });
        });
    });
});
