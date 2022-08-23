import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CHART_VIEW_STATUS_EVENT } from "../constants";
import { Chart } from "../core/chart";
import { XYGrid } from "../core/grid/xy-grid";
import { ChartComponent } from "./chart.component";

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
