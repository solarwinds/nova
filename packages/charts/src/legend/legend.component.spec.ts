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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LegendComponent } from "./legend.component";
import { LegendOrientation } from "./types";

describe("components >", () => {
    describe("legend >", () => {
        let fixture: ComponentFixture<LegendComponent>;
        let legend: LegendComponent;
        let element: HTMLElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [LegendComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(LegendComponent);
            legend = fixture.debugElement.componentInstance;
            element = fixture.debugElement.query(
                By.css(".nui-legend")
            ).nativeElement;
            fixture.detectChanges();
        });

        it("should emit active changed with the new active value", () => {
            legend.active = false;

            spyOn(legend.activeChanged, "emit");
            legend.active = true;

            legend.ngOnChanges({
                active: new SimpleChange(null, null, legend.active),
            });

            expect(legend.activeChanged.emit).toHaveBeenCalledWith(true);
        });

        it("should have 'flex-column' class by default", () => {
            expect(element.classList).toContain("flex-column");
        });

        it("should remove 'flex-column' class if orientation is horizaontal", () => {
            legend.orientation = LegendOrientation.horizontal;
            fixture.detectChanges();
            expect(element.classList).not.toContain("flex-column");
        });
    });
});
