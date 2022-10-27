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

import {
    CUSTOM_ELEMENTS_SCHEMA,
    DebugElement,
    SimpleChange,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SvgMarker } from "../core/common/palette/markers/svg-marker";
import { ChartMarkerComponent } from "./chart-marker.component";

describe("components >", () => {
    describe("chart-marker >", () => {
        let fixture: ComponentFixture<ChartMarkerComponent>;
        let subject: ChartMarkerComponent;
        let de: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ChartMarkerComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(ChartMarkerComponent);
            de = fixture.debugElement;
            subject = de.children[0].componentInstance;
            fixture.detectChanges();
        });

        describe("marker input >", () => {
            it("renders marker svg", () => {
                subject.marker = new SvgMarker("xxx");
                subject.ngOnChanges({
                    marker: new SimpleChange(null, subject.marker, false),
                });

                expect(subject.svgContent.nativeElement.innerHTML).toContain(
                    subject.marker.getSvg()
                );
            });
        });

        describe("color input >", () => {
            it("renders colored marker svg", () => {
                const color = "red";
                const testMarker = new SvgMarker("xxx");
                testMarker.setColor(color);

                subject.marker = new SvgMarker("xxx");
                subject.color = color;
                subject.ngOnChanges({
                    marker: new SimpleChange(null, subject.marker, false),
                    color: new SimpleChange(null, color, false),
                });

                expect(subject.svgContent.nativeElement.innerHTML).toContain(
                    testMarker.getSvg()
                );
            });
        });

        describe("drawLine input >", () => {
            it("renders a line with a corrent color", () => {
                const color = "red";
                const testMarker = new SvgMarker("xxx");
                const lineSvg = `<line x1="-10" y1="0" x2="10" y2="0" style="stroke:${color};stroke-width:2"></line>`;
                testMarker.setColor(color);

                subject.marker = new SvgMarker("xxx");
                subject.drawLine = true;
                subject.color = color;
                subject.ngOnChanges({
                    marker: new SimpleChange(null, subject.marker, false),
                    color: new SimpleChange(null, color, false),
                    drawLine: new SimpleChange(null, true, false),
                });

                expect(subject.svgContent.nativeElement.innerHTML).toContain(
                    lineSvg
                );
            });
        });
    });
});
