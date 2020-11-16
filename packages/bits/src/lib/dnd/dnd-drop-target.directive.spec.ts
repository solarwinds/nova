import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild} from "@angular/core";
import {ComponentFixture, fakeAsync, flush, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

import {DndDropTargetDirective} from "./dnd-drop-target.directive";

@Component({
    template: `
        <div cdkDropList nuiDndDropTarget>
            <div cdkDrag [cdkDragData]="'allowed'">Allowed</div>
            <div cdkDrag [cdkDragData]="'three'">Three</div>
            <div cdkDrag [cdkDragData]="'not-allowed'">Not Allowed</div>
        </div>
    `,
})
class DropTargetTestingComponent {
    @ViewChild(CdkDropList) dropListInstance: CdkDropList;
}

describe("directives >", () => {
    describe("nuiDndDropTarget >", () => {
        let fixture: ComponentFixture<DropTargetTestingComponent>;
        let subject: DropTargetTestingComponent;
        let dropTargetElement: DebugElement;
        let dropTargetDirective: DndDropTargetDirective;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DragDropModule],
                declarations: [DndDropTargetDirective, DropTargetTestingComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(DropTargetTestingComponent);
            subject = fixture.componentInstance;
            dropTargetElement = fixture.debugElement.query(By.directive(DndDropTargetDirective));
            dropTargetDirective = dropTargetElement.injector.get(DndDropTargetDirective) as DndDropTargetDirective;
        });

        it("should assign CSS class 'nui-dnd-dropzone' to host element", () => {
            expect(dropTargetElement.nativeElement).not.toBeNull();
            fixture.detectChanges();
            expect(dropTargetElement.nativeElement.classList.contains("nui-dnd-dropzone")).toBeTruthy();
        });

        it("should have some draggable items", () => {
            fixture.detectChanges();
            expect(dropTargetDirective.draggables.length).toBe(3);
        });

        describe("dropzone >", () => {
            it("should be highlighted when dragging starts", fakeAsync(() => {
                fixture.detectChanges();

                // dropzone should not be active since dragging hasn't start
                expect(dropTargetDirective.isDropZoneActive).toBeFalsy();

                startDraggingViaMouse(fixture, dropTargetDirective.draggables.first.element.nativeElement);
                const dropListRect = subject.dropListInstance.element.nativeElement.getBoundingClientRect();
                dispatchMouseEvent(document, "mousemove", dropListRect.right, dropListRect.top);
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(dropTargetDirective.isDropZoneActive).toBeTruthy();
                    expect(dropTargetElement.nativeElement.classList.contains("nui-dnd-dropzone--active")).toBeTruthy();
                });
            }));

            it("should NOT be highlighted after dragging stopped", fakeAsync(() => {
                const results: boolean[] = [];
                fixture.detectChanges();

                dropTargetDirective.showDropZone$.subscribe((value) => {
                    results.push(value);
                });

                // dropzone should not be active since dragging hasn't start
                expect(dropTargetDirective.isDropZoneActive).toBeFalsy();

                const dropListRect = subject.dropListInstance.element.nativeElement.getBoundingClientRect();
                dragElementViaMouse(fixture, dropTargetDirective.draggables.first.element.nativeElement, dropListRect.right + 100, dropListRect.top + 100);
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    // we should've been called two times:
                    // - first time with true since dragging started
                    // - second time with false since dragging stopped
                    expect(results).toEqual([true, false]);

                    // - finally the dropzone should not be active since dragging stopped
                    expect(dropTargetDirective.isDropZoneActive).toBeFalsy();
                    expect(dropTargetElement.nativeElement.classList.contains("nui-dnd-dropzone--active")).toBeFalsy();
                });
            }));
        });

        describe("Draggable items >", () => {
            it("- allow an item to be dropped", fakeAsync(() => {
                fixture.detectChanges();

                const spyItemCanBeDropped = jasmine.createSpy("canBeDropped spy").and.returnValue(true);
                dropTargetDirective.canBeDropped = spyItemCanBeDropped;

                startDraggingViaMouse(fixture, dropTargetDirective.draggables.first.element.nativeElement);
                expect(spyItemCanBeDropped).not.toHaveBeenCalled();
                dispatchMouseEvent(document, "mousemove", 50, 100);
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(spyItemCanBeDropped).toHaveBeenCalledTimes(1);
                    expect(spyItemCanBeDropped).toHaveBeenCalledWith("allowed", subject.dropListInstance);

                    expect(dropTargetElement.nativeElement.classList.contains("nui-dnd-dropzone--drop-allowed")).toBeTruthy();
                });
            }));

            it("- NOT allow an item to be dropped", fakeAsync(() => {
                fixture.detectChanges();

                const spyItemCanBeDropped = jasmine.createSpy("canBeDropped spy").and.returnValue(false);
                dropTargetDirective.canBeDropped = spyItemCanBeDropped;

                startDraggingViaMouse(fixture, dropTargetDirective.draggables.last.element.nativeElement);
                expect(spyItemCanBeDropped).not.toHaveBeenCalled();
                dispatchMouseEvent(document, "mousemove", 50, 100);

                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(spyItemCanBeDropped).toHaveBeenCalledTimes(1);
                    expect(spyItemCanBeDropped).toHaveBeenCalledWith("not-allowed", subject.dropListInstance);

                    expect(dropTargetElement.nativeElement.classList.contains("nui-dnd-dropzone--drop-not-allowed")).toBeTruthy();
                });
            }));
        });

    });
});

function dispatchEvent(node: Node | Window, event: Event): Event {
    node.dispatchEvent(event);
    return event;
}

function dispatchMouseEvent(node: Node, type: string, x = 0, y = 0,
                            event = createMouseEvent(type, x, y)): MouseEvent {
    return dispatchEvent(node, event) as MouseEvent;
}

/**
 * Creates a browser MouseEvent with the specified options.
 */
export function createMouseEvent(type: string, x = 0, y = 0, button = 0) {
    const event = document.createEvent("MouseEvent");
    const originalPreventDefault = event.preventDefault.bind(event);

    event.initMouseEvent(type,
        true, /* canBubble */
        true, /* cancelable */
        window, /* view */
        0, /* detail */
        x, /* screenX */
        y, /* screenY */
        x, /* clientX */
        y, /* clientY */
        false, /* ctrlKey */
        false, /* altKey */
        false, /* shiftKey */
        false, /* metaKey */
        button, /* button */
        null /* relatedTarget */);

    // `initMouseEvent` doesn't allow us to pass the `buttons` and
    // defaults it to 0 which looks like a fake event.
    Object.defineProperty(event, "buttons", {get: () => 1});

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = () => {
        Object.defineProperty(event, "defaultPrevented", { get: () => true });
        return originalPreventDefault();
    };

    return event;
}

/**
 * Dispatches the events for starting a drag sequence.
 * @param fixture Fixture on which to run change detection.
 * @param element Element on which to dispatch the events.
 * @param x Position along the x axis to which to drag the element.
 * @param y Position along the y axis to which to drag the element.
 */
function startDraggingViaMouse(fixture: ComponentFixture<any>,
                               element: Element, x?: number, y?: number) {
    dispatchMouseEvent(element, "mousedown", x, y);
    fixture.detectChanges();

    dispatchMouseEvent(document, "mousemove", x, y);
    fixture.detectChanges();
}

/**
 * Drags an element to a position on the page using the mouse.
 * @param fixture Fixture on which to run change detection.
 * @param element Element which is being dragged.
 * @param x Position along the x axis to which to drag the element.
 * @param y Position along the y axis to which to drag the element.
 */
function dragElementViaMouse(fixture: ComponentFixture<any>,
                             element: Element, x: number, y: number) {

    startDraggingViaMouse(fixture, element);

    dispatchMouseEvent(document, "mousemove", x, y);
    fixture.detectChanges();

    dispatchMouseEvent(document, "mouseup", x, y);
    fixture.detectChanges();
}
