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

import { CdkDrag, CdkDragStart, CdkDropList } from "@angular/cdk/drag-drop";
import {
    AfterContentInit,
    ContentChildren,
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    QueryList,
    Renderer2,
} from "@angular/core";
import { combineLatest, fromEvent, merge, Observable, of, Subject } from "rxjs";
import {
    distinctUntilChanged,
    map,
    mapTo,
    shareReplay,
    startWith,
    switchMap,
    takeUntil,
    tap,
} from "rxjs/operators";

@Directive({
    selector: "[cdkDropList][nuiDndDropTarget]",
    exportAs: "nuiDndDropTarget",
    host: {
        // Setting proper highlight state class on host container,
        // to let the user customize drop zone only via css
        "[class.nui-dnd-dropzone]": "true",
        "[class.nui-dnd-dropzone--active]": "isDropZoneActive",
        "[class.nui-dnd-dropzone--drop-allowed]":
            "isDropZoneActive && canLastDragItemBeDropped",
        "[class.nui-dnd-dropzone--drop-not-allowed]":
            "isDropZoneActive && canLastDragItemBeDropped === false",
    },
})
export class DndDropTargetDirective implements AfterContentInit, OnDestroy {
    @ContentChildren(CdkDrag, { descendants: true })
    draggables: QueryList<CdkDrag>;

    @Input() canBeDropped: (item: any, dropListRef?: CdkDropList) => boolean;

    public showDropZone$: Observable<boolean>;
    public canLastDragItemBeDropped$: Observable<boolean>;

    private itemDragStarted$: Subject<CdkDrag> = new Subject();
    private _destroy$: Subject<unknown> = new Subject();

    // true when the drag has started
    public get isDropZoneActive(): boolean {
        // Using cdk default isReceiving and isDragging (When the item is assigned without drop to dropList,
        // isReceiving returns false, and we replace it with isDragging to maintain the expected behavior.)
        return (
            this.targetDropList._dropListRef.isReceiving() ||
            this.targetDropList._dropListRef.isDragging()
        );
    }

    private _canLastDragItemBeDropped: boolean;

    // and also available for consumer to be able to use it without async
    public get canLastDragItemBeDropped(): boolean {
        return this._canLastDragItemBeDropped;
    }

    // canDrop primitive value is used for the host element class binding
    constructor(
        private targetDropList: CdkDropList,
        private renderer: Renderer2,
        hostElement: ElementRef
    ) {
        const mouseEnter$: Observable<unknown> = fromEvent(
            hostElement.nativeElement,
            "mouseenter"
        );
        // Cdk bug fix: When an item is dragged outside of the container but not into another container,
        // the placeholder is not removed. So, to fix this, we're removing the placeholder if the user's mouse
        // cursor leaves the container.
        const mouseLeave$: Observable<unknown> = fromEvent(
            hostElement.nativeElement,
            "mouseleave"
        );

        // Events streams for switching the drop zone state.
        const showDropZoneTrigger$: Observable<unknown> = merge(
            mouseEnter$,
            this.itemDragStarted$,
            this.targetDropList.entered
        );
        const hideDropZoneTrigger$: Observable<unknown> = merge(
            mouseLeave$,
            this.targetDropList.dropped,
            this.targetDropList.exited
        );

        // Main placeholder stream that decides to show/hide drop zone
        this.showDropZone$ = merge(
            showDropZoneTrigger$.pipe(mapTo(true)),
            hideDropZoneTrigger$.pipe(mapTo(false))
        ).pipe(distinctUntilChanged(), shareReplay());

        // Merging observables to obtain reliable draggedItem reference
        const draggedItem$: Observable<CdkDrag> = merge(
            this.targetDropList.entered.pipe(map((event) => event.item)),
            this.itemDragStarted$
        ).pipe(shareReplay());

        // Drop zone state stream used to return the result of the predicate provided by user.
        // Here we're taking the current moving item in case the drop zone is active to be able to execute the callback.
        this.canLastDragItemBeDropped$ = combineLatest<
            Observable<boolean>,
            Observable<CdkDrag>
        >([this.showDropZone$, draggedItem$]).pipe(
            switchMap(([showDropZone, drag]) => {
                let result: boolean = false;
                if (showDropZone) {
                    const ACCEPT_ALL_ITEMS: boolean = true;
                    result =
                        this.canBeDropped?.(drag.data, this.targetDropList) ??
                        ACCEPT_ALL_ITEMS;
                }
                this._canLastDragItemBeDropped = result;
                return of(result);
            }),
            distinctUntilChanged(),
            shareReplay()
        );

        // If consumer will not subscribe in the template to canDrop$ we should set proper classes anyway.
        // That's why we're subscribing also here, the number of observables will remain the same because of shareReplay
        this.canLastDragItemBeDropped$
            .pipe(takeUntil(this._destroy$))
            .subscribe();
    }

    public ngAfterContentInit(): void {
        // Using this to provide current draggable item reference that is needed for predicate validation
        // cdkDropList is not throwing any event on dragStart, then we should subscribe to dragStartEventEmitter from item
        this.draggables.changes
            .pipe(
                startWith(this.draggables.toArray()),
                switchMap((items: CdkDrag[]) =>
                    merge<CdkDragStart>(
                        ...items.map((drag: CdkDrag) => drag.started)
                    )
                ),
                tap((item: CdkDragStart) =>
                    this.itemDragStarted$.next(item.source)
                ),
                takeUntil(this._destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }
}
