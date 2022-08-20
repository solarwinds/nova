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
