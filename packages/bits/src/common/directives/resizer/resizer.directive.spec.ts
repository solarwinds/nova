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

import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { UtilService } from "../../../services/util.service";
import { ResizeDirection, ResizeUnit } from "./public-api";
import { ResizerDirective } from "./resizer.directive";

@Component({
    template: `<div style="position: relative; height: 50px">
        <div
            class="resize-gutter-element"
            nuiResizer
            [resizerDirection]="resizeDirection"
            [resizerDisabled]="disabled"
            [resizerValue]="unitsValue"
            (resizerSizeChanged)="containerResizeHandler($event)"
        ></div>
    </div>`,
})
class ResizeSplitTestingComponent {
    public resizeDirection = ResizeDirection.right;
    public unitsValue = ResizeUnit.percent;
    public disabled = false;

    public containerResizeHandler(entry: any) {
        return entry;
    }
}

describe("directives >", () => {
    describe("resizer", () => {
        let fixture: ComponentFixture<ResizeSplitTestingComponent>;
        let component: ResizeSplitTestingComponent;

        let resizeSplitDebugElement: DebugElement;
        let subject: ResizerDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ResizeSplitTestingComponent, ResizerDirective],
                providers: [UtilService],
            });
            fixture = TestBed.createComponent(ResizeSplitTestingComponent);
            component = fixture.componentInstance;

            resizeSplitDebugElement = fixture.debugElement.query(
                By.directive(ResizerDirective)
            );
            subject = resizeSplitDebugElement.injector.get(
                ResizerDirective
            ) as ResizerDirective;
        });

        it("should emit resize event and call containerResizeHandler function", async () => {
            const spy = spyOn(component, "containerResizeHandler");
            subject.resizerSizeChanged.emit();
            await fixture.whenStable().then(() => {
                expect(spy).toHaveBeenCalled();
            });
        });
        it("should have correct class have when nuiResizerDisabled input is set to true", () => {
            fixture.detectChanges();
            component.disabled = true;
            fixture.detectChanges();
            const resizeElement =
                resizeSplitDebugElement.nativeElement.firstChild;
            expect(resizeElement.classList).toContain(
                "nui-resize-gutter-disabled"
            );
        });
        it("should have correct class when direction is 'right'", () => {
            component.resizeDirection = ResizeDirection.right;
            fixture.detectChanges();
            const resizeElement =
                resizeSplitDebugElement.nativeElement.firstChild;
            const resizeSplitElement = resizeElement.firstChild;
            expect(resizeSplitElement.classList).toContain(
                "nui-resize-gutter__split-horizontal"
            );
        });

        it("should have correct class when direction is 'top'", () => {
            component.resizeDirection = ResizeDirection.top;
            fixture.detectChanges();
            const resizeElement =
                resizeSplitDebugElement.nativeElement.firstChild;
            const resizeSplitElement = resizeElement.firstChild;
            expect(resizeSplitElement.classList).toContain(
                "nui-resize-gutter__split-vertical"
            );
        });

        it("should have correct classes while mouse events emitted", () => {
            fixture.detectChanges();
            const resizeElement =
                resizeSplitDebugElement.nativeElement.firstChild;
            resizeElement.dispatchEvent(new MouseEvent("mousedown"));
            expect(resizeElement.classList).toContain(
                "nui-resize-gutter--active"
            );

            document.dispatchEvent(new MouseEvent("mouseup"));
            expect(resizeElement.classList).not.toContain(
                "nui-resize-gutter--active"
            );
        });
    });
});
