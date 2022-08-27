import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from "@angular/core";
import _isNil from "lodash/isNil";
import throttle from "lodash/throttle";
import { Subscription } from "rxjs";

import { DragAndDropService } from "./drag-and-drop.service";
import { scrollConstants } from "./dragdrop.constants";
import {
    IDragEvent,
    IDragPayload,
    IDragState,
    IDropEvent,
    IDropValidator,
} from "./public-api";

/**
 * Directive that provides behavior of droppable zone for an element
 *
 *  __Usage:__
 *
 * Bind this directive to an element that will be a zone for dropping elements there.
 *
 *        `<div nuiDroppable>Some content</div>`
 *
 * Make sure that this zone has some content, because droppable directive doesn't set any height
 * to the element. This won't work:
 *
 *        `<div nuiDroppable></div>`
 *
 * To subscribe to an event `dragOver, dragEnter, dragLeave, dropSuccess` just transmit an attribute
 *
 *         `<div nuiDroppable (dropSuccess)="onDropObject($event)"></div>`
 *
 * And `onDropObject` method will look like that:
 *
 *         `public onDropObject(dropEvent: INuiDropEvent) {
 *
 *              const extractedData = dropEvent.payload; //some data that you passed to draggable directive
 *
 *              const actualEvent = dropEvent.event; // an HTML 5 event (native)
 *
 *          };`
 * If you want to validate if data can be dropped you can set validator.
 * By default if you don't specify it all drags will be accepted.
 *
 *          `<div nuiDroppable [validator]="validator"></div>`
 *
 * Validator is an object that should implement IDropValidator interface.
 *
 *          `interface IDropValidator {
 *              isValidDropTarget(payload: any, isExternal?: boolean): boolean;
 *          };`
 * Payload is an dragged payload, and isExternal will be set to true if source of drag is NOT nui-draggable (it can be some other document, excel file etc.)
 *
 * You can also specify css classes that will be set:
 *
 * `dragOverClass` - will set this class when drag is over and validator returns true or there is no validator
 *
 * `invalidDragOverClass` - will set this class when drag is over and validator returns false
 *
 * `dropIndicatorClass` - will set this class when you start dragging something that can be dropped on this nui-droppable
 */
/**
 * <example-url>./../examples/index.html#/dragdrop</example-url>
 */

/** @ignore */
@Directive({
    selector: "[nuiDroppable]",
})
export class DroppableDirective implements OnInit, OnDestroy {
    @Input() dragOverClass = "nui-drag--over";
    @Input() invalidDragOverClass: string;
    @Input() dropIndicatorClass: string;
    @Input() dropValidator: IDropValidator;

    @Output() dragOver = new EventEmitter<DragEvent>();
    @Output() dragEnter = new EventEmitter<DragEvent>();
    @Output() dragLeave = new EventEmitter<DragEvent>();
    @Output() dropSuccess = new EventEmitter<IDropEvent>();

    private dragElements: Array<HTMLElement> = [];

    private onDragStateChangedSubscription: Subscription;

    private dragThrottle = throttle(
        (dragEvent: any) => {
            this.dragOver.emit(dragEvent);
        },
        scrollConstants.checkIntervalInMs,
        { trailing: false }
    );

    @HostListener("dragenter", ["$event"])
    onDragEnter(event: IDragEvent) {
        const payload = this.dragAndDropService.getDragPayload(event);
        if (this.validateDrop(payload) && this.dragElements.length === 0) {
            this.elRef.nativeElement.classList.remove(this.dropIndicatorClass);
            this.elRef.nativeElement.classList.add(this.dragOverClass);
            this.dragEnter.emit(event);
        } else if (
            this.dragElements.length === 0 &&
            this.invalidDragOverClass
        ) {
            this.elRef.nativeElement.classList.add(this.invalidDragOverClass);
        }
        this.dragElements.push(<HTMLElement>event.target);
        event.preventDefault();
    }

    @HostListener("dragover", ["$event"])
    onDragOver(event: IDragEvent) {
        const payload = this.dragAndDropService.getDragPayload(event);
        if (this.validateDrop(payload)) {
            this.dragThrottle(event);
        }
        event.preventDefault();
    }

    @HostListener("dragleave", ["$event"])
    onDragLeave(event: IDragEvent) {
        const payload = this.dragAndDropService.getDragPayload(event);
        this.dragElements = this.dragElements.filter(
            (el) => el !== event.target
        );
        if (this.validateDrop(payload) && this.dragElements.length === 0) {
            this.elRef.nativeElement.classList.remove(this.dragOverClass);
            if (!payload?.isExternal) {
                // dropIndicatorClass shouldn't be added if dragged item comes from outside of the browser - there is no easy way to remove it later.
                this.elRef.nativeElement.classList.add(this.dropIndicatorClass);
            }
            this.dragLeave.emit(event);
        } else if (
            this.dragElements.length === 0 &&
            this.invalidDragOverClass
        ) {
            this.elRef.nativeElement.classList.remove(
                this.invalidDragOverClass
            );
        }
    }

    @HostListener("drop", ["$event"])
    onDrop(event: IDragEvent) {
        const payload = this.dragAndDropService.getDragPayload(event);
        event.preventDefault();
        if (this.validateDrop(payload)) {
            this.dragElements = [];
            if (
                (typeof DragEvent !== "undefined" &&
                    event instanceof DragEvent) ||
                (<any>event).dataTransfer
            ) {
                this.dropSuccess.emit({ event, payload: payload.data });
            }
            this.elRef.nativeElement.classList.remove(this.dragOverClass);
        } else if (!_isNil(this.invalidDragOverClass)) {
            this.elRef.nativeElement.classList.remove(
                this.invalidDragOverClass
            );
        }
        this.dragAndDropService.resetPayload();
        event.stopPropagation();
        return false;
    }

    constructor(
        private elRef: ElementRef,
        private dragAndDropService: DragAndDropService
    ) {}
    ngOnInit(): void {
        this.onDragStateChangedSubscription =
            this.dragAndDropService.onDragStateChanged.subscribe(
                (item: IDragState) => {
                    if (
                        !_isNil(this.dropIndicatorClass) &&
                        this.validateDrop({
                            data: item.payload,
                            isExternal: false,
                        })
                    ) {
                        if (item.isInProgress) {
                            this.elRef.nativeElement.classList.add(
                                this.dropIndicatorClass
                            );
                        } else {
                            this.elRef.nativeElement.classList.remove(
                                this.dropIndicatorClass
                            );
                        }
                    }
                }
            );
    }

    private validateDrop(payload: IDragPayload) {
        if (!this.dropValidator) {
            return true; // if there is no drop validator specified drop is always valid
        }
        return this.dropValidator.isValidDropTarget(
            payload.data,
            payload.isExternal
        );
    }

    ngOnDestroy(): void {
        if (!_isNil(this.onDragStateChangedSubscription)) {
            this.onDragStateChangedSubscription.unsubscribe();
        }
    }
}
