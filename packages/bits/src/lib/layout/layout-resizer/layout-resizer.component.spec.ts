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
    public ngAfterViewInit(): void {
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
