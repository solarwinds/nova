import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import _noop from "lodash/noop";

import { UtilService } from "../../../services/util.service";
import { DragAndDropService } from "./drag-and-drop.service";
import { DraggableDirective } from "./draggable.directive";

@Component({
    template: `<div
        nuiDraggable
        id="test-draggable"
        [payload]="draggableString"
        [adornerDragClass]="'demoDragClass'"
        (dragStart)="onDragStart($event)"
        (dragEnd)="onDragEnd()"
    ></div>`,
})
class DraggableTestingComponent {
    public draggableString = "this is a string";
    public onDragStart(event: DragEvent) {
        _noop();
    }

    public onDragEnd(event: DragEvent) {
        _noop();
    }
}

describe("directives >", () => {
    describe("draggable >", () => {
        type DragEventType = "drag" | "dragstart" | "dragend" | "dragover";
        const dragAndDropServiceMock = jasmine.createSpyObj(
            "DragAndDropService",
            [
                "onDragStateChanged",
                "setDragPayload",
                "getDragPayload",
                "resetPayload",
            ]
        );
        let component: DraggableTestingComponent;
        let fixture: ComponentFixture<DraggableTestingComponent>;
        let draggableElement: DebugElement;
        let draggableDirective: DraggableDirective;

        const emitEvent = (
            eventType: DragEventType,
            element: HTMLElement | Document
        ) => {
            const event = new DragEvent(eventType, {
                dataTransfer: new DataTransfer(),
            });
            element.dispatchEvent(event);
        };

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [DraggableDirective, DraggableTestingComponent],
                providers: [
                    {
                        provide: DragAndDropService,
                        useValue: dragAndDropServiceMock,
                    },
                    UtilService,
                    { provide: "windowObject", useValue: window },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(DraggableTestingComponent);
            fixture.autoDetectChanges(true);
            component = fixture.componentInstance;
            draggableElement = fixture.debugElement.query(
                By.directive(DraggableDirective)
            );
            draggableDirective = draggableElement.injector.get(
                DraggableDirective
            ) as DraggableDirective;
        });

        afterEach(() => {
            fixture = TestBed.createComponent(DraggableTestingComponent);
        });

        it("should set draggable attribute to a draggable element", () => {
            expect(
                draggableElement.nativeElement.hasAttribute("draggable")
            ).toBeTruthy();
        });

        it("should set draggable decoration class", () => {
            expect(
                draggableElement.nativeElement.classList.contains(
                    "nui-drag__draggable"
                ) !== -1
            ).toBeTruthy();
        });

        it("should trigger emission of dragstart event", () => {
            spyOn(component, "onDragStart");
            emitEvent("dragstart", draggableElement.nativeElement);
            expect(component.onDragStart).toHaveBeenCalled();
        });

        it("should set drag payload", () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            expect(dragAndDropServiceMock.setDragPayload).toHaveBeenCalled();
        });

        it("should trigger emission of dragend event", () => {
            spyOn(component, "onDragEnd");
            emitEvent("dragend", draggableElement.nativeElement);
            expect(component.onDragEnd).toHaveBeenCalled();
        });

        it("should reset payload", () => {
            emitEvent("dragend", draggableElement.nativeElement);
            expect(dragAndDropServiceMock.resetPayload).toHaveBeenCalled();
        });

        it("should create overlay of draggable element", async () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            expect(
                draggableDirective["dragsourceOverlay"]?.classList.contains(
                    "nui-drag__drag-source--overlay"
                )
            ).toBeTruthy();
            await fixture.whenStable().then(() => {
                const firstChild = draggableElement.nativeElement.firstChild;
                expect(
                    firstChild.classList.contains(
                        "nui-drag__drag-source--overlay"
                    )
                ).toBeTruthy();
            });
        });

        it("should create adorner element", () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            expect(draggableDirective["adorner"]).not.toBeUndefined();
        });

        it("should add halo to adorner element", () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            const haloChild = draggableDirective["adorner"]?.firstElementChild;
            expect(haloChild).not.toBeUndefined();
            expect(
                haloChild?.classList.contains("nui-drag__drag-halo")
            ).toBeTruthy();
        });

        it("should add draggable element to adorner", () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            const draggable = draggableDirective["adorner"]?.lastElementChild;
            expect(draggable).not.toBeUndefined();
            expect(draggable?.id).toEqual("test-draggable");
        });

        it("should remove overlay on dragend", () => {
            emitEvent("dragstart", draggableElement.nativeElement);
            expect(
                draggableDirective["dragsourceOverlay"]?.classList.contains(
                    "nui-drag__drag-source--overlay"
                )
            ).toBeTruthy();
            emitEvent("dragend", draggableElement.nativeElement);
            expect(draggableDirective["dragsourceOverlay"]).toBeUndefined();
        });

        it("should autoscroll on drag over", async () => {
            spyOn<any>(draggableDirective, "moveDragAdorner");
            emitEvent("dragstart", draggableElement.nativeElement);
            emitEvent("dragover", document);
            await fixture.whenStable().then(() => {
                expect(
                    draggableDirective["moveDragAdorner"]
                ).toHaveBeenCalled();
            });
        });
    });
});
