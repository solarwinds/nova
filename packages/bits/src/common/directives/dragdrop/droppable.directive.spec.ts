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

import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import _noop from "lodash/noop";
import { Subject } from "rxjs";

import { DragAndDropService } from "./drag-and-drop.service";
import { DraggableDirective } from "./draggable.directive";
import { DroppableDirective } from "./droppable.directive";
import { IDragState, IDropEvent } from "./public-api";
import { UtilService } from "../../../services/util.service";

const DEFAULT_DRAGOVER_CLASS = "nui-drag--over";

@Component({
    template: `<div
            nuiDraggable
            id="test-draggable"
            [payload]="draggableString"
            [adornerDragClass]="'demoDragClass'"
            (dragStart)="onDragStart($event)"
            (dragEnd)="onDragEnd($event)"
        ></div>
        <div
            nuiDroppable
            id="test-droppable"
            (dropSuccess)="onDropString($event)"
            (dragOver)="onDragOver($event)"
            (dragEnter)="onDragEnter($event)"
            (dragLeave)="onDragLeave($event)"
        ></div>`,
})
class DroppableTestingComponent {
    public draggableString = "this is a string";
    public transferredString: any;

    public onDragStart(event: DragEvent) {
        _noop();
    }
    public onDragEnd(event: DragEvent) {
        _noop();
    }
    public onDropString(event: IDropEvent) {
        this.transferredString = event.payload;
    }
    public onDragOver(event: DragEvent) {
        _noop();
    }
    public onDragEnter(event: DragEvent) {
        _noop();
    }
    public onDragLeave(event: DragEvent) {
        _noop();
    }
}

describe("directives >", () => {
    describe("droppable >", () => {
        type DragEventType =
            | "drag"
            | "dragstart"
            | "dragend"
            | "dragover"
            | "dragenter"
            | "dragleave"
            | "drop";
        const dragAndDropServiceMock = jasmine.createSpyObj(
            "DragAndDropService",
            ["setDragPayload", "getDragPayload", "resetPayload"]
        );
        let dragStartSubject: Subject<IDragState>;
        let fixture: ComponentFixture<DroppableTestingComponent>;
        let component: DroppableTestingComponent;
        let droppableElement: DebugElement;
        let droppableDirective: DroppableDirective;

        const emitEvent = (eventType: DragEventType, element: HTMLElement) => {
            const event = new DragEvent(eventType);
            element.dispatchEvent(event);
        };

        function setValidator(validate: boolean) {
            const validator = jasmine.createSpyObj("Validator", [
                "isValidDropTarget",
            ]);
            validator.isValidDropTarget.and.returnValue(validate);
            droppableDirective.dropValidator = validator;
        }

        beforeEach(() => {
            dragStartSubject = new Subject<IDragState>();
            dragAndDropServiceMock.onDragStateChanged =
                dragStartSubject.asObservable();
            TestBed.configureTestingModule({
                declarations: [
                    DraggableDirective,
                    DroppableDirective,
                    DroppableTestingComponent,
                ],
                providers: [
                    UtilService,
                    {
                        provide: DragAndDropService,
                        useValue: dragAndDropServiceMock,
                    },
                    { provide: "windowObject", useValue: window },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(DroppableTestingComponent);
            fixture.autoDetectChanges(true);
            component = fixture.componentInstance;
            droppableElement = fixture.debugElement.query(
                By.directive(DroppableDirective)
            );
            droppableDirective = droppableElement.injector.get(
                DroppableDirective
            ) as DroppableDirective;
        });

        afterEach(() => {
            fixture = TestBed.createComponent(DroppableTestingComponent);
        });

        it("should trigger emission of drop event", async () => {
            spyOn(component, "onDropString");
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("Text", "This is a string");
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "This is a string",
                isExternal: false,
            });
            droppableElement.nativeElement.dispatchEvent(event);
            await fixture.whenStable().then(() => {
                expect(component.onDropString).toHaveBeenCalled();
            });
        });

        it("should NOT trigger emission of drop event if validator returns false", async () => {
            spyOn(component, "onDropString");
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("Text", "This is a string");
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "This is a string",
                isExternal: false,
            });
            setValidator(false);
            droppableElement.nativeElement.dispatchEvent(event);

            await fixture.whenStable().then(() => {
                expect(component.onDropString).not.toHaveBeenCalled();
            });
        });

        it("should NOT trigger emission of drop event if validator returns true", async () => {
            spyOn(component, "onDropString");
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("Text", "This is a string");
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "This is a string",
                isExternal: false,
            });
            setValidator(true);
            droppableElement.nativeElement.dispatchEvent(event);

            await fixture.whenStable().then(() => {
                expect(component.onDropString).toHaveBeenCalled();
            });
        });

        it("should remove invalidDragOverClass", async () => {
            spyOn(component, "onDropString");
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("Text", "This is a string");
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "This is a string",
                isExternal: false,
            });
            setValidator(false);
            const invalidDragOverClass = "invalid-drag-over-class";
            droppableDirective.invalidDragOverClass = invalidDragOverClass;
            droppableElement.nativeElement.classList.add(invalidDragOverClass);
            droppableElement.nativeElement.dispatchEvent(event);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).not.toContain(
                    invalidDragOverClass
                );
            });
        });

        it("should trigger emission of dragover event", () => {
            spyOn(component, "onDragOver");
            emitEvent("dragover", droppableElement.nativeElement);
            expect(component.onDragOver).toHaveBeenCalled();
        });

        it("should NOT trigger emission of dragover event if validator returns false", () => {
            spyOn(component, "onDragOver");
            setValidator(false);
            emitEvent("dragover", droppableElement.nativeElement);
            expect(component.onDragOver).not.toHaveBeenCalled();
        });

        it("should trigger emission of dragover event if validator returns true", () => {
            spyOn(component, "onDragOver");
            setValidator(true);
            emitEvent("dragover", droppableElement.nativeElement);
            expect(component.onDragOver).toHaveBeenCalled();
        });

        it("should trigger emission of dragenter event", () => {
            spyOn(component, "onDragEnter");
            emitEvent("dragenter", droppableElement.nativeElement);
            expect(component.onDragEnter).toHaveBeenCalled();
        });

        it("should NOT trigger emission of dragenter event if validator returns false", () => {
            spyOn(component, "onDragEnter");
            setValidator(false);
            emitEvent("dragenter", droppableElement.nativeElement);
            expect(component.onDragEnter).not.toHaveBeenCalled();
        });

        it("should trigger emission of dragenter event if validator returns true", () => {
            spyOn(component, "onDragEnter");
            setValidator(true);
            emitEvent("dragenter", droppableElement.nativeElement);
            expect(component.onDragEnter).toHaveBeenCalled();
        });

        it("should remove dropIndicatorClass and add dragOverClass if validator returns true", async () => {
            const dropIndicatorClass = "drop-indicator-class";
            droppableDirective.dropIndicatorClass = dropIndicatorClass;
            droppableElement.nativeElement.classList.add(dropIndicatorClass);
            const dragOverClass = "drag-over-class";
            droppableDirective.dragOverClass = dragOverClass;
            setValidator(true);
            emitEvent("dragenter", droppableElement.nativeElement);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).toContain(
                    dragOverClass
                );
                expect(droppableElement.nativeElement.classList).not.toContain(
                    dropIndicatorClass
                );
            });
        });

        it("should add invalidDragOverClass if validator returns false", async () => {
            const invalidDragOverClass = "drag-over-class";
            droppableDirective.invalidDragOverClass = invalidDragOverClass;
            setValidator(false);
            emitEvent("dragenter", droppableElement.nativeElement);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).toContain(
                    invalidDragOverClass
                );
            });
        });

        it("should trigger emission of dragleave event", () => {
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: false,
            });
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);
            expect(component.onDragLeave).toHaveBeenCalled();
        });

        it("should NOT trigger emission of dragleave event if validator returns false", () => {
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: false,
            });
            setValidator(false);
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);
            expect(component.onDragLeave).not.toHaveBeenCalled();
        });

        it("should trigger emission of dragleave event if validator returns true", () => {
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: false,
            });
            setValidator(true);
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);
            expect(component.onDragLeave).toHaveBeenCalled();
        });

        it("should remove dragOverClass if validator returns true", async () => {
            const dragOverClass = "drag-over-class";
            const dropIndicatorClass = "drop-indiecator-class";
            droppableDirective.dropIndicatorClass = dropIndicatorClass;
            droppableDirective.dragOverClass = dragOverClass;
            droppableElement.nativeElement.classList.add(dragOverClass);
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: false,
            });
            setValidator(true);
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).not.toContain(
                    dragOverClass
                );
                expect(droppableElement.nativeElement.classList).toContain(
                    dropIndicatorClass
                );
            });
        });

        it("should NOT add dropIndicatorClass if validator returns true and payloay is external", async () => {
            const dropIndicatorClass = "drop-indiecator-class";
            droppableDirective.dropIndicatorClass = dropIndicatorClass;
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: true,
            });
            setValidator(true);
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).not.toContain(
                    dropIndicatorClass
                );
            });
        });

        it("should remove invalidDragOverClass if validator returns false", async () => {
            const invalidDragOverClass = "invalidDragOverClass";
            droppableDirective.invalidDragOverClass = invalidDragOverClass;
            droppableElement.nativeElement.classList.add(invalidDragOverClass);
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "payload",
                isExternal: true,
            });
            setValidator(false);
            spyOn(component, "onDragLeave");
            emitEvent("dragleave", droppableElement.nativeElement);

            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).not.toContain(
                    invalidDragOverClass
                );
            });
        });

        it("should remove default class on dragleave", () => {
            emitEvent("dragleave", droppableElement.nativeElement);
            const hasDefaultClass =
                droppableElement.nativeElement.classList.contains(
                    DEFAULT_DRAGOVER_CLASS
                );
            expect(hasDefaultClass).toBe(false);
        });

        it("should transfer correct data", async () => {
            const dataTransfer = new DataTransfer();
            const payload = "This is a string";
            dataTransfer.setData("Text", payload);
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: payload,
                isExternal: false,
            });
            droppableElement.nativeElement.dispatchEvent(event);

            await fixture.whenStable().then(() => {
                expect(component.transferredString).toEqual(payload);
            });
        });

        it("should set default class on dragenter", () => {
            emitEvent("dragenter", droppableElement.nativeElement);
            const hasDefaultClass =
                droppableElement.nativeElement.classList.contains(
                    DEFAULT_DRAGOVER_CLASS
                );
            expect(hasDefaultClass).toBe(true);
        });

        it("should set transmitted class on dragenter", async () => {
            const dragOverClass = "my-class";
            droppableDirective.dragOverClass = dragOverClass;
            const dropIndicatorClass = "drop-indiecator-class";
            droppableDirective.dropIndicatorClass = dropIndicatorClass;
            droppableElement.nativeElement.classList.add(dropIndicatorClass);
            emitEvent("dragenter", droppableElement.nativeElement);
            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).toContain(
                    dragOverClass
                );
                expect(droppableElement.nativeElement.classList).not.toContain(
                    dropIndicatorClass
                );
            });
        });

        it("should set transmitted class on dragenter", async () => {
            const invalidDragOverClass = "my-class";
            droppableDirective.invalidDragOverClass = invalidDragOverClass;
            setValidator(false);
            emitEvent("dragenter", droppableElement.nativeElement);
            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).toContain(
                    invalidDragOverClass
                );
            });
        });

        it("should remove drag over class on drop", async () => {
            emitEvent("dragenter", droppableElement.nativeElement);
            droppableDirective.dragOverClass = "my-class";
            emitEvent("dragleave", droppableElement.nativeElement);
            await fixture.whenStable().then(() => {
                const haveClass =
                    droppableElement.nativeElement.classList.contains(
                        "my-class"
                    );
                expect(haveClass).toBeFalsy();
            });
        });

        it("should reset payload on drop event", () => {
            const dataTransfer = new DataTransfer();
            dataTransfer.setData("Text", "This is a string");
            const event = new DragEvent("drop", { dataTransfer });
            dragAndDropServiceMock.getDragPayload.and.returnValue({
                data: "This is a string",
                isExternal: false,
            });
            droppableElement.nativeElement.dispatchEvent(event);

            expect(dragAndDropServiceMock.resetPayload).toHaveBeenCalled();
        });

        it("should add dropIndicatorClass when drag is in progress", async () => {
            droppableDirective.dropIndicatorClass = "dropIndicatorClass";
            dragStartSubject.next({ isInProgress: true, payload: {} });

            expect(dragStartSubject.observers.length).toBe(1);
            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).toContain(
                    "dropIndicatorClass"
                );
            });
        });

        it("should remove dropIndicatorClass when drag is NOT in progress", async () => {
            droppableDirective.dropIndicatorClass = "dropIndicatorClass";
            droppableElement.nativeElement.classList.add("dropIndicatorClass");
            dragStartSubject.next({ isInProgress: false, payload: {} });

            expect(dragStartSubject.observers.length).toBe(1);
            await fixture.whenStable().then(() => {
                expect(droppableElement.nativeElement.classList).not.toContain(
                    "dropIndicatorClass"
                );
            });
        });

        it("should unsubscribe onDestroy", () => {
            droppableDirective.dropIndicatorClass = "dropIndicatorClass";
            expect(dragStartSubject.observers.length).toBe(1);

            droppableDirective.ngOnDestroy();
            expect(dragStartSubject.observers.length).toBe(0);
        });
    });
});
