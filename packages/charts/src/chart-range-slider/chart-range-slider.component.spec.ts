import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChartRangeSliderComponent } from "./chart-range-slider.component";
import { IChartRangeSliderSeries } from "./types";

describe("ChartRangeSliderComponent", () => {
    let fixture: ComponentFixture<ChartRangeSliderComponent>;
    let component: ChartRangeSliderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChartRangeSliderComponent],
        });

        fixture = TestBed.createComponent(ChartRangeSliderComponent);
        component = fixture.componentInstance;
    });

    it("builds the selection window from the visible range and selected index", () => {
        component.series = createSeries();
        component.visibleRange = 4;
        component.selectedIndex = 3;

        applyInputs(component, fixture);

        expect(component.selectionRect.width).toBeCloseTo(40, 4);
        expect(component.selectionRect.x).toBeCloseTo(30, 4);
        expect(component.selectionRange).toEqual(
            jasmine.objectContaining({
                startIndex: 3,
                endIndex: 6,
                startValue: 3,
                endValue: 6,
            })
        );
    });

    it("clamps the selected index to the last possible window", () => {
        component.series = createSeries();
        component.visibleRange = 4;
        component.selectedIndex = 20;

        applyInputs(component, fixture);

        expect(component.selectedIndex).toBe(6);
        expect(component.selectionRange.startIndex).toBe(6);
        expect(component.selectionRange.endIndex).toBe(9);
    });

    it("emits the new window when the track is clicked", () => {
        const selectedIndexChangeSpy = spyOn(
            component.selectedIndexChange,
            "emit"
        );
        const rangeChangeSpy = spyOn(component.rangeChange, "emit");

        component.series = createSeries();
        component.visibleRange = 4;
        component.selectedIndex = 0;

        applyInputs(component, fixture);
        setTrackRect(component, 100, 0);

        component.onTrackMouseDown(createMouseEvent(80));

        expect(selectedIndexChangeSpy).toHaveBeenCalledWith(6);
        expect(rangeChangeSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                startIndex: 6,
                endIndex: 9,
                startValue: 6,
                endValue: 9,
            })
        );
    });

    it("drags the selection window and clamps it at the start of the track", () => {
        const selectedIndexChangeSpy = spyOn(
            component.selectedIndexChange,
            "emit"
        );

        component.series = createSeries();
        component.visibleRange = 4;
        component.selectedIndex = 3;

        applyInputs(component, fixture);
        setTrackRect(component, 100, 0);

        component.onSelectionMouseDown(createMouseEvent(35));
        component.onDocumentMouseMove(createMouseEvent(-10));
        component.onDocumentMouseUp();

        expect(component.selectionRange.startIndex).toBe(0);
        expect(selectedIndexChangeSpy).toHaveBeenCalledWith(0);
    });

    it("expands the selection to the full width when the visible range exceeds the data", () => {
        component.series = createSeries(5);
        component.visibleRange = 20;
        component.selectedIndex = 4;

        applyInputs(component, fixture);

        expect(component.selectionRect.width).toBe(100);
        expect(component.selectionRect.x).toBe(0);
        expect(component.selectionRange.startIndex).toBe(0);
        expect(component.selectionRange.endIndex).toBe(4);
    });

    it("renders only active series", () => {
        component.series = createSeries();
        component.series[1].active = false;
        component.visibleRange = 4;

        applyInputs(component, fixture);

        expect(component.previewSeries.length).toBe(1);
        expect(component.previewSeries[0].id).toBe("latency");
    });
});

function applyInputs(
    component: ChartRangeSliderComponent,
    fixture: ComponentFixture<ChartRangeSliderComponent>
): void {
    component.ngOnChanges({
        series: new SimpleChange(null, component.series, false),
        visibleRange: new SimpleChange(null, component.visibleRange, false),
        selectedIndex: new SimpleChange(null, component.selectedIndex, false),
        height: new SimpleChange(null, component.height, false),
    });
    fixture.detectChanges();
}

function setTrackRect(
    component: ChartRangeSliderComponent,
    width: number,
    left: number
): void {
    spyOn(
        component.track.nativeElement,
        "getBoundingClientRect"
    ).and.returnValue({
        left,
        width,
    } as DOMRect);
}

function createMouseEvent(clientX: number): MouseEvent {
    return {
        clientX,
        preventDefault: jasmine.createSpy("preventDefault"),
        stopPropagation: jasmine.createSpy("stopPropagation"),
    } as unknown as MouseEvent;
}

function createSeries(length = 10): IChartRangeSliderSeries[] {
    return [
        {
            id: "latency",
            color: "#3f85af",
            data: Array.from({ length }, (_, index) => ({
                x: index,
                y: (index + 1) * 10,
            })),
        },
        {
            id: "jitter",
            color: "#f59e0b",
            data: Array.from({ length }, (_, index) => ({
                x: index,
                y: index * 5,
            })),
        },
    ];
}
