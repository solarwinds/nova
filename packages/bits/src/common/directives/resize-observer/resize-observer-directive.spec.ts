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
