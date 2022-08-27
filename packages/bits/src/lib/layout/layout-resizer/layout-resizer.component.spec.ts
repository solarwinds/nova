import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";

import { ResizerDirective } from "../../../common/directives";
import {
    ResizeDirection,
    ResizeUnit,
} from "../../../common/directives/resizer/public-api";
import { LayoutResizerComponent } from "./layout-resizer.component";

@Component({
    template: `<div>Loren Ipsum</div>`,
})
class LayoutResizerTestingComponent implements AfterViewInit {
    constructor(public elRef: ElementRef) {}
    ngAfterViewInit() {
        this.elRef.nativeElement.parentElement = document.createElement("div");
    }
}

describe("Components >", () => {
    describe("layoutResizer", () => {
        let testFixture: ComponentFixture<LayoutResizerTestingComponent>;
        let testComponent: LayoutResizerTestingComponent;

        let fixture: ComponentFixture<LayoutResizerComponent>;
        let resizerComponent: LayoutResizerComponent;

        beforeEach(() => {
            TestBed.overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [LayoutResizerComponent],
                },
            });
            TestBed.configureTestingModule({
                declarations: [
                    LayoutResizerTestingComponent,
                    LayoutResizerComponent,
                ],
                providers: [ResizerDirective],
            });
            fixture = TestBed.createComponent(LayoutResizerComponent);
            resizerComponent = fixture.componentInstance;

            testFixture = TestBed.createComponent(
                LayoutResizerTestingComponent
            );
            testComponent = testFixture.componentInstance;

            resizerComponent.resizeElement = testComponent;
            resizerComponent.enableSeparateOffsetSize = false;
            resizerComponent.resizeUnit = ResizeUnit.pixel;
        });

        it("should have correct classes", () => {
            resizerComponent.resizeDirection = ResizeDirection.right;
            fixture.detectChanges();
            const layoutResizer = fixture.elementRef.nativeElement;
            expect(layoutResizer.classList).toContain(
                "nui-layout-resizer--horizontal"
            );
        });
        it("should have correct classes", () => {
            resizerComponent.resizeDirection = ResizeDirection.bottom;
            fixture.detectChanges();
            const layoutResizer = fixture.elementRef.nativeElement;
            expect(layoutResizer.classList).toContain(
                "nui-layout-resizer--vertical"
            );
        });
    });
});
