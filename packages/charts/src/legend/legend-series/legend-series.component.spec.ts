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

import { RenderState } from "../../renderers/types";
import { LegendComponent } from "../legend.component";
import { LegendOrientation } from "../types";
import {
    LegendSeriesComponent,
    LEGEND_SERIES_CLASS_NAME,
} from "./legend-series.component";

interface IMockLegendInput {
    seriesIcon?: string;
    interactive?: boolean;
    active?: boolean;
    orientation?: LegendOrientation;
}

class MockLegendComponent extends LegendComponent {
    constructor(input: IMockLegendInput = {}) {
        super();
        this.seriesIcon = input.seriesIcon || this.seriesIcon;
        this.interactive = input.interactive || this.interactive;
        this.active = input.active || this.active;
        this.orientation = input.orientation || this.orientation;
    }
}

describe("LegendSeries >", () => {
    let fixture: ComponentFixture<LegendSeriesComponent>;
    let series: LegendSeriesComponent;
    let hostElement: HTMLElement;

    const prepareComponent = (mockLegend: MockLegendComponent) => {
        TestBed.overrideComponent(LegendSeriesComponent, {
            set: {
                providers: [{ provide: LegendComponent, useValue: mockLegend }],
            },
        });
        fixture = TestBed.createComponent(LegendSeriesComponent);
        series = fixture.debugElement.componentInstance;
        hostElement = fixture.debugElement.nativeElement;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LegendSeriesComponent, LegendComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
    });

    describe("host bindings", () => {
        const activeClass = "inverse";
        const interactiveClass = `${LEGEND_SERIES_CLASS_NAME}--interactive`;
        const horizontalClass = `${LEGEND_SERIES_CLASS_NAME}--horizontal`;
        const deselectedClass = `${LEGEND_SERIES_CLASS_NAME}--deselected`;

        describe("active class", () => {
            it("should not be applied by default", () => {
                prepareComponent(new MockLegendComponent());
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(activeClass);
            });

            it("should be synchronized with the parent legend active input", () => {
                const mockLegend = new MockLegendComponent({ active: true });

                prepareComponent(mockLegend);
                fixture.detectChanges();
                expect(hostElement.classList).toContain(activeClass);

                mockLegend.active = false;
                mockLegend.ngOnChanges({
                    active: new SimpleChange(null, null, mockLegend.active),
                });
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(activeClass);
            });

            it("should be applied if the legend is active and the series render state is anything but 'hidden'", () => {
                prepareComponent(new MockLegendComponent({ active: true }));
                Object.keys(RenderState).forEach((state) => {
                    if (state !== RenderState.hidden) {
                        series.seriesRenderState = <RenderState>state;
                        fixture.detectChanges();
                        expect(hostElement.classList).toContain(activeClass);
                    }
                });
            });

            it("should not not be applied if the legend is active but the series render state is 'hidden'", () => {
                prepareComponent(new MockLegendComponent({ active: true }));

                series.seriesRenderState = RenderState.hidden;
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(activeClass);
            });
        });

        describe("interactive class", () => {
            it("should not be applied by default", () => {
                prepareComponent(new MockLegendComponent());
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(interactiveClass);
            });

            it("should be applied when the legend is interactive", () => {
                prepareComponent(
                    new MockLegendComponent({ interactive: true })
                );
                fixture.detectChanges();
                expect(hostElement.classList).toContain(interactiveClass);
            });

            it("should not be overridden when the legend is interactive", () => {
                prepareComponent(
                    new MockLegendComponent({ interactive: true })
                );
                series.interactive = false;
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(interactiveClass);
            });

            it("should not be overridden when the legend is not interactive", () => {
                prepareComponent(
                    new MockLegendComponent({ interactive: false })
                );
                series.interactive = true;
                fixture.detectChanges();
                expect(hostElement.classList).toContain(interactiveClass);
            });
        });

        describe("horizontal class", () => {
            it("should not be applied by default", () => {
                prepareComponent(new MockLegendComponent());
                fixture.detectChanges();
                expect(hostElement.classList).not.toContain(horizontalClass);
            });

            it("should be applied when the legend's orientation is horizontal", () => {
                prepareComponent(
                    new MockLegendComponent({
                        orientation: LegendOrientation.horizontal,
                    })
                );
                fixture.detectChanges();
                expect(hostElement.classList).toContain(horizontalClass);
            });
        });

        describe("deselected class", () => {
            it("should be applied when the series is not selected", () => {
                prepareComponent(new MockLegendComponent());
                series.isSelected = false;
                fixture.detectChanges();
                expect(hostElement.children[0].classList).toContain(
                    deselectedClass
                );
            });

            it("should not be applied when the series is selected", () => {
                prepareComponent(
                    new MockLegendComponent({ interactive: true })
                );
                series.isSelected = true;
                fixture.detectChanges();
                expect(hostElement.children[0].classList).not.toContain(
                    deselectedClass
                );
            });
        });
    });

    describe("template conditionals", () => {
        beforeEach(() => {
            prepareComponent(new MockLegendComponent());
        });

        it("should hide the description elements if they are not set or set to empty", () => {
            expect(fixture.componentInstance.hasInputDescription()).toBe(false);
            series.descriptionPrimary = "";
            series.descriptionSecondary = "";
            expect(fixture.componentInstance.hasInputDescription()).toBe(false);
        });

        it("should not hide descriptions if the descriptionPrimary is set", () => {
            series.descriptionPrimary = "test description";
            expect(fixture.componentInstance.hasInputDescription()).toBe(true);
        });

        it("should not hide descriptions if the descriptionSecondary is set", () => {
            series.descriptionSecondary = "test description";
            expect(fixture.componentInstance.hasInputDescription()).toBe(true);
        });
    });

    describe("input handling logic", () => {
        const legendSeriesIcon = "fallback-series-icon";

        beforeEach(() => {
            prepareComponent(
                new MockLegendComponent({ seriesIcon: legendSeriesIcon })
            );
            fixture.detectChanges();
        });

        it("should use the icon value from the parent legend seriesIcon input", () => {
            expect(series.icon).toEqual(legendSeriesIcon);
        });

        it("should use the icon value from series icon input", () => {
            const seriesSpecificIcon = "series-specific-icon";

            series.icon = seriesSpecificIcon;
            series.ngAfterContentInit();

            expect(series.icon).toEqual(seriesSpecificIcon);
        });
    });

    describe("seriesRenderState", () => {
        it("getter should return RenderState.default if value is not set", () => {
            prepareComponent(new MockLegendComponent());
            expect(series.seriesRenderState).toEqual(RenderState.default);
        });
    });

    describe("isSelectedChange", () => {
        it("should emit correct value in isSelectedChange on click when series is in interactive mode", () => {
            prepareComponent(new MockLegendComponent());
            spyOn(series.isSelectedChange, "next");
            series.interactive = true;
            series.isSelected = false;
            hostElement.dispatchEvent(new Event("click"));
            expect(series.isSelectedChange.next).toHaveBeenCalledWith(true);
        });

        it("should not emit isSelectedChange on click when series is not in interactive mode", () => {
            prepareComponent(new MockLegendComponent());
            spyOn(series.isSelectedChange, "next");
            series.interactive = false;
            hostElement.dispatchEvent(new Event("click"));
            expect(series.isSelectedChange.next).not.toHaveBeenCalled();
        });
    });
});
