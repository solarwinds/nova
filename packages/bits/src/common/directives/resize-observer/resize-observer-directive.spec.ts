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

import { ResizeObserverDirective } from "./resize-observer.directive";

@Component({
    template: `<div
        nuiResizeObserver
        (containerResize)="containerResizeHandler(entry)"
    ></div>`,
})
class ResizeObserverTestingComponent {
    public containerResizeHandler(entry: any) {
        return entry;
    }
}

describe("directives >", () => {
    describe("resize-observer", () => {
        let fixture: ComponentFixture<ResizeObserverTestingComponent>;
        let component: ResizeObserverTestingComponent;

        let resizeObserverDebugElement: DebugElement;
        let subject: ResizeObserverDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ResizeObserverTestingComponent,
                    ResizeObserverDirective,
                ],
                providers: [],
            });
            fixture = TestBed.createComponent(ResizeObserverTestingComponent);
            component = fixture.componentInstance;

            resizeObserverDebugElement = fixture.debugElement.query(
                By.directive(ResizeObserverDirective)
            );
            subject = resizeObserverDebugElement.injector.get(
                ResizeObserverDirective
            ) as ResizeObserverDirective;
        });

        it("should emit resize event and call containerResizeHandler function", async () => {
            const spy = spyOn(component, "containerResizeHandler");
            subject.containerResize.emit();
            await fixture.whenStable().then(() => {
                expect(spy).toHaveBeenCalled();
            });
        });
    });
});
