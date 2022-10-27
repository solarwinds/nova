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

import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { OverlayItemComponent } from "./overlay-item.component";

describe("OverlayItemComponent", () => {
    let component: OverlayItemComponent;
    let fixture: ComponentFixture<OverlayItemComponent>;
    let debug: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OverlayItemComponent],
            imports: [],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
        TestBed.configureTestingModule({
            declarations: [OverlayItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OverlayItemComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("active style", () => {
        afterAll(() => {
            component.active = false;
        });

        it("should set active styles", () => {
            component.active = false;
            component.setActiveStyles();
            expect(component.active).toEqual(true);
        });

        it("should set inactive styles", () => {
            component.active = true;
            component.setInactiveStyles();
            expect(component.active).toEqual(false);
        });
    });

    it("should call scrollIntoView", () => {
        const scrollSpy = spyOn<any>(debug.nativeElement, "scrollIntoView");
        component.scrollIntoView();
        expect(scrollSpy).toHaveBeenCalled();
    });

    describe("host binding inputs >", () => {
        afterAll(() => {
            component.isDisabled = false;
            component.active = false;
        });

        ["active", "disabled"].forEach((className) => {
            it(`is not have ${className} class name by default`, () => {
                expect(
                    debug.nativeElement.classList.value.includes(className)
                ).toBe(false);
            });
        });

        it(`the "disabled" class is added`, () => {
            component.isDisabled = true;
            fixture.detectChanges();
            expect(
                debug.nativeElement.classList.value.includes("disabled")
            ).toBe(true);
        });

        it(`the "active" class is added`, () => {
            component.active = true;
            fixture.detectChanges();
            expect(debug.nativeElement.classList.value.includes("active")).toBe(
                true
            );
        });
    });
});
