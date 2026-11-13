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
import { ChartTooltipsPlugin } from "../core/plugins/tooltips/chart-tooltips-plugin";

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

    describe("opt-in keyboard tooltips", () => {
        let host: HTMLElement;
        let keyboardTooltips: jasmine.SpyObj<ChartTooltipsPlugin>;

        beforeEach(() => {
            host = fixture.nativeElement;
            keyboardTooltips = jasmine.createSpyObj<ChartTooltipsPlugin>(
                "ChartTooltipsPlugin",
                [
                    "getKeyboardDataPointCount",
                    "showForIndex",
                    "hideKeyboardTooltips",
                ]
            );
            keyboardTooltips.getKeyboardDataPointCount.and.returnValue(3);
        });

        const dispatchKey = (
            target: HTMLElement,
            key: string,
            options: KeyboardEventInit = {}
        ): void => {
            target.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key,
                    bubbles: true,
                    ...options,
                })
            );
            fixture.detectChanges();
        };

        const focusHost = (): void => {
            spyOn(host, "matches").and.returnValue(true);
            host.dispatchEvent(new FocusEvent("focus"));
        };

        it("does not make the chart focusable by default", () => {
            expect(host.getAttribute("tabindex")).toBeNull();

            host.dispatchEvent(new FocusEvent("focus"));

            expect(host.getAttribute("tabindex")).toBeNull();
        });

        it("starts at zero and clamps arrow navigation to the available range", () => {
            component.keyboardTooltips = keyboardTooltips;
            fixture.detectChanges();

            expect(host.getAttribute("tabindex")).toBe("0");

            focusHost();
            expect(keyboardTooltips.showForIndex).toHaveBeenCalledWith(0);

            dispatchKey(host, "ArrowRight");
            dispatchKey(host, "ArrowRight");
            dispatchKey(host, "ArrowRight");
            expect(keyboardTooltips.showForIndex).toHaveBeenCalledWith(2);
            expect(keyboardTooltips.showForIndex.calls.count()).toBe(4);

            dispatchKey(host, "ArrowLeft");
            dispatchKey(host, "ArrowLeft");
            dispatchKey(host, "ArrowLeft");
            expect(
                keyboardTooltips.showForIndex.calls.mostRecent().args
            ).toEqual([0]);
            expect(keyboardTooltips.showForIndex.calls.count()).toBe(7);
        });

        it("hides on Escape and reopens on the next arrow key", () => {
            component.keyboardTooltips = keyboardTooltips;
            fixture.detectChanges();
            focusHost();
            dispatchKey(host, "ArrowRight");

            dispatchKey(host, "Escape");
            expect(keyboardTooltips.hideKeyboardTooltips).toHaveBeenCalledTimes(
                1
            );

            dispatchKey(host, "ArrowRight");
            expect(
                keyboardTooltips.showForIndex.calls.mostRecent().args
            ).toEqual([2]);
        });

        it("hides and resets the index on blur", () => {
            component.keyboardTooltips = keyboardTooltips;
            fixture.detectChanges();
            focusHost();
            dispatchKey(host, "ArrowRight");

            host.dispatchEvent(new FocusEvent("blur"));
            expect(keyboardTooltips.hideKeyboardTooltips).toHaveBeenCalledTimes(
                1
            );

            host.dispatchEvent(new FocusEvent("focus"));
            expect(
                keyboardTooltips.showForIndex.calls.mostRecent().args
            ).toEqual([0]);
        });

        it("does not show a tooltip when there are no data points", () => {
            keyboardTooltips.getKeyboardDataPointCount.and.returnValue(0);
            component.keyboardTooltips = keyboardTooltips;
            fixture.detectChanges();

            focusHost();
            dispatchKey(host, "ArrowRight");

            expect(keyboardTooltips.showForIndex).not.toHaveBeenCalled();
        });

        it("ignores modified keys and key events from nested controls", () => {
            component.keyboardTooltips = keyboardTooltips;
            fixture.detectChanges();
            focusHost();
            keyboardTooltips.showForIndex.calls.reset();

            dispatchKey(host, "ArrowRight", { shiftKey: true });
            dispatchKey(host, "ArrowLeft", { ctrlKey: true });
            expect(keyboardTooltips.showForIndex).not.toHaveBeenCalled();

            const nestedControl = document.createElement("button");
            host.appendChild(nestedControl);
            dispatchKey(nestedControl, "ArrowRight");

            expect(keyboardTooltips.showForIndex).not.toHaveBeenCalled();
        });
    });
});
