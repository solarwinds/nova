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

import { CdkDropList, DragDropModule } from "@angular/cdk/drag-drop";
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    DebugElement,
    ViewChild,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { DndDropTargetDirective } from "./dnd-drop-target.directive";

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
                declarations: [
                    DndDropTargetDirective,
                    DropTargetTestingComponent,
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(DropTargetTestingComponent);
            subject = fixture.componentInstance;
            dropTargetElement = fixture.debugElement.query(
                By.directive(DndDropTargetDirective)
            );
            dropTargetDirective = dropTargetElement.injector.get(
                DndDropTargetDirective
            ) as DndDropTargetDirective;
        });

        it("should assign CSS class 'nui-dnd-dropzone' to host element", () => {
            expect(dropTargetElement.nativeElement).not.toBeNull();
            fixture.detectChanges();
            expect(
                dropTargetElement.nativeElement.classList.contains(
                    "nui-dnd-dropzone"
                )
            ).toBeTruthy();
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

                startDraggingViaMouse(
                    fixture,
                    dropTargetDirective.draggables.first.element.nativeElement
                );
                const dropListRect =
                    subject.dropListInstance.element.nativeElement.getBoundingClientRect();
                dispatchMouseEvent(
                    document,
                    "mousemove",
                    dropListRect.right,
                    dropListRect.top
                );
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(dropTargetDirective.isDropZoneActive).toBeTruthy();
                    expect(
                        dropTargetElement.nativeElement.classList.contains(
                            "nui-dnd-dropzone--active"
                        )
                    ).toBeTruthy();
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

                const dropListRect =
                    subject.dropListInstance.element.nativeElement.getBoundingClientRect();
                dragElementViaMouse(
                    fixture,
                    dropTargetDirective.draggables.first.element.nativeElement,
                    dropListRect.right + 100,
                    dropListRect.top + 100
                );
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    // we should've been called two times:
                    // - first time with true since dragging started
                    // - second time with false since dragging stopped
                    expect(results).toEqual([true, false]);

                    // - finally the dropzone should not be active since dragging stopped
                    expect(dropTargetDirective.isDropZoneActive).toBeFalsy();
                    expect(
                        dropTargetElement.nativeElement.classList.contains(
                            "nui-dnd-dropzone--active"
                        )
                    ).toBeFalsy();
                });
            }));
        });

        describe("Draggable items >", () => {
            it("- allow an item to be dropped", fakeAsync(() => {
                fixture.detectChanges();

                const spyItemCanBeDropped = jasmine
                    .createSpy("canBeDropped spy")
                    .and.returnValue(true);
                dropTargetDirective.canBeDropped = spyItemCanBeDropped;

                startDraggingViaMouse(
                    fixture,
                    dropTargetDirective.draggables.first.element.nativeElement
                );
                expect(spyItemCanBeDropped).not.toHaveBeenCalled();
                dispatchMouseEvent(document, "mousemove", 50, 100);
                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(spyItemCanBeDropped).toHaveBeenCalledTimes(1);
                    expect(spyItemCanBeDropped).toHaveBeenCalledWith(
                        "allowed",
                        subject.dropListInstance
                    );

                    expect(
                        dropTargetElement.nativeElement.classList.contains(
                            "nui-dnd-dropzone--drop-allowed"
                        )
                    ).toBeTruthy();
                });
            }));

            it("- NOT allow an item to be dropped", fakeAsync(() => {
                fixture.detectChanges();

                const spyItemCanBeDropped = jasmine
                    .createSpy("canBeDropped spy")
                    .and.returnValue(false);
                dropTargetDirective.canBeDropped = spyItemCanBeDropped;

                startDraggingViaMouse(
                    fixture,
                    dropTargetDirective.draggables.last.element.nativeElement
                );
                expect(spyItemCanBeDropped).not.toHaveBeenCalled();
                dispatchMouseEvent(document, "mousemove", 50, 100);

                flush();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    expect(spyItemCanBeDropped).toHaveBeenCalledTimes(1);
                    expect(spyItemCanBeDropped).toHaveBeenCalledWith(
                        "not-allowed",
                        subject.dropListInstance
                    );

                    expect(
                        dropTargetElement.nativeElement.classList.contains(
                            "nui-dnd-dropzone--drop-not-allowed"
                        )
                    ).toBeTruthy();
                });
            }));
        });
    });
});

function dispatchEvent(node: Node | Window, event: Event): Event {
    node.dispatchEvent(event);
    return event;
}

function dispatchMouseEvent(
    node: Node,
    type: string,
    x = 0,
    y = 0,
    event = createMouseEvent(type, x, y)
): MouseEvent {
    return dispatchEvent(node, event) as MouseEvent;
}

/**
 * Creates a browser MouseEvent with the specified options.
 * @docs-private
 */
function createMouseEvent(
    type: string,
    clientX = 0,
    clientY = 0,
    offsetX = 0,
    offsetY = 0,
    button = 0,
    modifiers : any = {},
) {
    // Note: We cannot determine the position of the mouse event based on the screen
    // because the dimensions and position of the browser window are not available
    // To provide reasonable `screenX` and `screenY` coordinates, we simply use the
    // client coordinates as if the browser is opened in fullscreen.
    const screenX = clientX;
    const screenY = clientY;

    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true, // Required for shadow DOM events.
        view: window,
        detail: 1,
        relatedTarget: null,
        screenX,
        screenY,
        clientX,
        clientY,
        ctrlKey: modifiers.control,
        altKey: modifiers.alt,
        shiftKey: modifiers.shift,
        metaKey: modifiers.meta,
        button: button,
        buttons: 1,
    });

    // The `MouseEvent` constructor doesn't allow us to pass these properties into the constructor.
    // Override them to `1`, because they're used for fake screen reader event detection.
    if (offsetX != null) {
        defineReadonlyEventProperty(event, 'offsetX', offsetX);
    }

    if (offsetY != null) {
        defineReadonlyEventProperty(event, 'offsetY', offsetY);
    }

    return event;
}

/**
 * Defines a readonly property on the given event object. Readonly properties on an event object
 * are always set as configurable as that matches default readonly properties for DOM event objects.
 */
function defineReadonlyEventProperty(event: Event, propertyName: string, value: any) {
    Object.defineProperty(event, propertyName, {get: () => value, configurable: true});
}

/**
 * Dispatches the events for starting a drag sequence.
 * @param fixture Fixture on which to run change detection.
 * @param element Element on which to dispatch the events.
 * @param x Position along the x axis to which to drag the element.
 * @param y Position along the y axis to which to drag the element.
 */
function startDraggingViaMouse(
    fixture: ComponentFixture<any>,
    element: Element,
    x?: number,
    y?: number
) {
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
function dragElementViaMouse(
    fixture: ComponentFixture<any>,
    element: Element,
    x: number,
    y: number
) {
    startDraggingViaMouse(fixture, element);

    dispatchMouseEvent(document, "mousemove", x, y);
    fixture.detectChanges();

    dispatchMouseEvent(document, "mouseup", x, y);
    fixture.detectChanges();
}
