// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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

import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RiskScoreComponent } from "./risk-score.component";

describe("components >", () => {
    describe("risk-score >", () => {
        let subject: RiskScoreComponent;
        let fixture: ComponentFixture<RiskScoreComponent>;
        let debugElement: DebugElement;

        const minValue = 0;
        const maxValue = 10;
        let width = 0;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [],
                providers: [],
                declarations: [RiskScoreComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(RiskScoreComponent);
            debugElement = fixture.debugElement;

            subject = fixture.componentInstance;
            subject.level = 1;
            subject.minLevel = minValue;
            subject.maxLevel = maxValue;
            subject.ngAfterViewInit();
            width = subject["colorLine"].nativeElement.offsetWidth;
        });

        it("should create", () => {
            expect(subject).toBeTruthy();
        });

        it("level = 1(between min and max). should provide floatOffset greater than 0 and less than 100", () => {
            expect(subject.floatOffset).toBeGreaterThan(0);
            expect(subject.floatOffset).toBeLessThan(width);
        });

        it("level = min. should provide floatOffset equal to 0", () => {
            subject.level = minValue;
            subject.ngOnChanges({});
            expect(subject.floatOffset).toEqual(0);
        });

        it("level = max. should provide floatOffset equal to 100", () => {
            subject.level = maxValue;
            subject.ngOnChanges({});
            expect(subject.floatOffset).toEqual(width);
        });

        it("level < min. should provide floatOffset equal to 0", () => {
            subject.level = minValue - 1;
            subject.ngOnChanges({});
            expect(subject.floatOffset).toEqual(0);
        });

        it("level > max. should provide floatOffset equal to 100", () => {
            subject.level = maxValue + 1;
            subject.ngOnChanges({});
            expect(subject.floatOffset).toEqual(width);
        });
    });
});
