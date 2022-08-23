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
