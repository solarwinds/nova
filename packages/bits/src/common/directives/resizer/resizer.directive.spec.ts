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

import { ResizeDirection, ResizeUnit } from "./public-api";
import { ResizerDirective } from "./resizer.directive";
import { UtilService } from "../../../services/util.service";

@Component({
    template: `<div style="position: relative; width: 500px; height: 50px">
        <div
            class="resize-gutter-element"
            style="width: 250px"
            nuiResizer
            [resizerDirection]="resizeDirection"
            [resizerDisabled]="disabled"
            [resizerValue]="unitsValue"
            [resizerKeyboardEnabled]="keyboardEnabled"
            [resizerKeyboardLabel]="keyboardLabel"
            [resizerKeyboardMinSize]="keyboardMinSize"
            [resizerKeyboardMaxSize]="keyboardMaxSize"
            (resizerSizeChanged)="containerResizeHandler($event)"
        ></div>
    </div>`,
    standalone: false,
})
class ResizeSplitTestingComponent {
    public resizeDirection = ResizeDirection.right;
    public unitsValue = ResizeUnit.percent;
    public disabled = false;
    public keyboardEnabled = false;
    public keyboardLabel = "Resize test pane";
    public keyboardMinSize = "100px";
    public keyboardMaxSize = "400px";

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

        it("should expose keyboard separator semantics only when opted in", () => {
            fixture.detectChanges();
            let gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            expect(gutter.hasAttribute("role")).toBe(false);
            expect(gutter.hasAttribute("tabindex")).toBe(false);

            component.keyboardEnabled = true;
            component.unitsValue = ResizeUnit.pixel;
            fixture.detectChanges();
            gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;

            expect(gutter.getAttribute("role")).toBe("separator");
            expect(gutter.getAttribute("tabindex")).toBe("0");
            expect(gutter.getAttribute("aria-label")).toBe("Resize test pane");
            expect(gutter.getAttribute("aria-orientation")).toBe("vertical");
            expect(gutter.getAttribute("aria-valuemin")).toBe("100");
            expect(gutter.getAttribute("aria-valuemax")).toBe("400");
        });

        it("should resize through the existing size-change output for keyboard input", () => {
            fixture.detectChanges();
            const target = fixture.nativeElement.querySelector(
                ".resize-gutter-element"
            ) as HTMLElement;
            target.style.width = "250px";
            (target.parentElement as HTMLElement).style.width = "500px";
            component.keyboardEnabled = true;
            component.unitsValue = ResizeUnit.pixel;
            component.resizeDirection = ResizeDirection.right;
            fixture.detectChanges();

            const gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            const event = new KeyboardEvent("keydown", {
                key: "ArrowRight",
                bubbles: true,
                cancelable: true,
            });
            const resizeChangedSpy = spyOn(component, "containerResizeHandler");
            gutter.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(true);
            expect(target.style.width).toBe("251px");
            expect(gutter.getAttribute("aria-valuenow")).toBe("251");
            expect(resizeChangedSpy).toHaveBeenCalledWith("251px");

            gutter.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "Home",
                    bubbles: true,
                    cancelable: true,
                })
            );
            expect(target.style.width).toBe("100px");
            expect(gutter.getAttribute("aria-valuenow")).toBe("100");

            gutter.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "End",
                    bubbles: true,
                    cancelable: true,
                })
            );
            expect(target.style.width).toBe("400px");
            expect(gutter.getAttribute("aria-valuenow")).toBe("400");
        });

        it("should resolve percentage and viewport bounds to numeric CSS pixels", () => {
            component.keyboardEnabled = true;
            component.keyboardMinSize = "20%";
            component.keyboardMaxSize = "80%";
            fixture.detectChanges();
            let gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            expect(gutter.getAttribute("aria-valuemin")).toBe("100");
            expect(gutter.getAttribute("aria-valuemax")).toBe("400");

            component.keyboardMinSize = "0vw";
            component.keyboardMaxSize = "200vw";
            fixture.detectChanges();
            gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            expect(gutter.getAttribute("aria-valuemin")).toBe("0");
            expect(gutter.getAttribute("aria-valuemax")).toBe(
                String(window.innerWidth * 2)
            );
        });

        it("should use physical arrow directions independent of text direction", () => {
            fixture.detectChanges();
            const target = fixture.nativeElement.querySelector(
                ".resize-gutter-element"
            ) as HTMLElement;
            target.style.width = "250px";
            target.dir = "rtl";
            component.keyboardEnabled = true;
            component.unitsValue = ResizeUnit.pixel;
            component.keyboardMinSize = "100px";
            component.keyboardMaxSize = "400px";
            component.resizeDirection = ResizeDirection.right;
            fixture.detectChanges();

            let gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            gutter.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    bubbles: true,
                    cancelable: true,
                })
            );
            expect(target.style.width).toBe("251px");

            component.resizeDirection = ResizeDirection.left;
            fixture.detectChanges();
            gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            gutter.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    bubbles: true,
                    cancelable: true,
                })
            );
            expect(target.style.width).toBe("250px");
        });

        it("should use CSS pixels and the containing block content box for percentage resizing", () => {
            component.keyboardEnabled = true;
            component.keyboardMinSize = "20%";
            component.keyboardMaxSize = "80%";
            fixture.detectChanges();
            const target: HTMLElement = resizeSplitDebugElement.nativeElement;
            const parent = target.parentElement!;
            parent.style.boxSizing = "border-box";
            parent.style.padding = "20px";
            parent.style.border = "10px solid";
            parent.style.transform = "scale(1.5)";
            const gutter: HTMLElement =
                target.querySelector(".nui-resize-gutter")!;
            gutter.dispatchEvent(
                new KeyboardEvent("keydown", {
                    key: "ArrowRight",
                    bubbles: true,
                    cancelable: true,
                })
            );
            expect(
                Number.parseFloat(getComputedStyle(target).width)
            ).toBeCloseTo(251, 1);
            expect(gutter.getAttribute("aria-valuenow")).toBe("251");
            expect(Number(gutter.getAttribute("aria-valuemin"))).toBeCloseTo(
                88,
                3
            );
            expect(Number(gutter.getAttribute("aria-valuemax"))).toBeCloseTo(
                352,
                3
            );
        });

        it("should retain the separator at zero and fractional CSS limits", () => {
            component.keyboardEnabled = true;
            component.unitsValue = ResizeUnit.pixel;
            component.keyboardMinSize = "0px";
            component.keyboardMaxSize = "400.3px";
            fixture.detectChanges();
            const target: HTMLElement = resizeSplitDebugElement.nativeElement;
            const gutter: HTMLElement =
                target.querySelector(".nui-resize-gutter")!;
            for (const [key, expected] of [
                ["End", 400.3],
                ["Home", 0],
                ["ArrowRight", 1],
            ] as const) {
                gutter.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key,
                        bubbles: true,
                        cancelable: true,
                    })
                );
                expect(
                    Number(gutter.getAttribute("aria-valuenow"))
                ).toBeCloseTo(expected, 2);
                expect(
                    Number.parseFloat(getComputedStyle(target).width)
                ).toBeCloseTo(expected, 1);
                expect(gutter.getAttribute("tabindex")).toBe("0");
            }
        });

        for (const direction of [ResizeDirection.top, ResizeDirection.bottom]) {
            it(`should resize vertically in the ${direction} direction`, () => {
                component.keyboardEnabled = true;
                component.unitsValue = ResizeUnit.pixel;
                component.resizeDirection = direction;
                const target: HTMLElement =
                    resizeSplitDebugElement.nativeElement;
                target.style.height = "250px";
                target.parentElement!.style.height = "500px";
                fixture.detectChanges();
                const gutter: HTMLElement =
                    target.querySelector(".nui-resize-gutter")!;
                gutter.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "ArrowDown",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                expect(target.style.height).toBe(
                    direction === ResizeDirection.top ? "249px" : "251px"
                );
                expect(gutter.getAttribute("aria-orientation")).toBe(
                    "horizontal"
                );
            });
        }

        it("should not expose an interactive separator for disabled or non-numeric bounds", () => {
            component.keyboardEnabled = true;
            component.disabled = true;
            fixture.detectChanges();
            let gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            expect(gutter.hasAttribute("tabindex")).toBe(false);

            component.disabled = false;
            component.keyboardMinSize = "auto";
            fixture.detectChanges();
            gutter = fixture.nativeElement.querySelector(
                ".nui-resize-gutter"
            ) as HTMLElement;
            expect(gutter.hasAttribute("tabindex")).toBe(false);
            expect(gutter.hasAttribute("aria-valuemin")).toBe(false);
        });
    });
});
