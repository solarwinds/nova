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

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CHART_VIEW_STATUS_EVENT } from "../constants";
import { ChartComponent } from "./chart.component";
import { Chart } from "../core/chart";
import { XYGrid } from "../core/grid/xy-grid";

describe("ChartComponent", () => {
    let fixture: ComponentFixture<ChartComponent>;
    let component: ChartComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChartComponent],
        });
        fixture = TestBed.createComponent(ChartComponent);
        component = fixture.componentInstance;
        component.chart = new Chart(new XYGrid());
        fixture.detectChanges();
    });

    describe("view status detection", () => {
        describe("ngOnInit", () => {
            it("should create an IntersectionObserver", () => {
                (<any>component).intersectionObserver = undefined;
                component.ngOnInit();
                expect((<any>component).intersectionObserver).toBeDefined();
            });

            it("should invoke observe on the IntersectionObserver", () => {
                const spy = spyOn(
                    window.IntersectionObserver.prototype,
                    "observe"
                );
                component.ngOnInit();
                expect(spy).toHaveBeenCalledWith(
                    (<any>component).elRef.nativeElement
                );
            });
        });

        describe("ngOnDestroy", () => {
            it("should invoke unobserve on the IntersectionObserver", () => {
                const spy = spyOn(
                    window.IntersectionObserver.prototype,
                    "unobserve"
                );
                component.ngOnDestroy();
                expect(spy).toHaveBeenCalledWith(
                    (<any>component).elRef.nativeElement
                );
            });
        });

        describe("intersectionObserverCallback", () => {
            it("should emit CHART_VIEW_STATUS_EVENT with isChartInView set to true", () => {
                const spy = spyOn(
                    component.chart
                        .getEventBus()
                        .getStream(CHART_VIEW_STATUS_EVENT),
                    "next"
                );
                (<any>component).intersectionObserverCallback([
                    { isIntersecting: true },
                ]);
                expect(spy).toHaveBeenCalledWith({
                    data: { isChartInView: true },
                });
            });

            it("should emit CHART_VIEW_STATUS_EVENT with isChartInView set to false", () => {
                const spy = spyOn(
                    component.chart
                        .getEventBus()
                        .getStream(CHART_VIEW_STATUS_EVENT),
                    "next"
                );
                (<any>component).intersectionObserverCallback([
                    { isIntersecting: false },
                ]);
                expect(spy).toHaveBeenCalledWith({
                    data: { isChartInView: false },
                });
            });
        });
    });
});
