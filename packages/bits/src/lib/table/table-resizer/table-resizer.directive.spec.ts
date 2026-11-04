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
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
//  IN THE SOFTWARE.

import { Component } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";

import {
    TableResizePhase,
    TableResizerDirective,
} from "./table-resizer.directive";
import { TableStateHandlerService } from "../table-state-handler.service";

@Component({
    template: `
        <div (click)="onParentClick()" (keydown)="onParentKeyDown()">
            <button type="button" nuiTableResizer [columnIndex]="1"></button>
        </div>
    `,
    standalone: false,
})
class TableResizerTestingComponent {
    public onParentClick = jasmine.createSpy("parent click");
    public onParentKeyDown = jasmine.createSpy("parent keydown");
}

describe("TableResizerDirective >", () => {
    let fixture: ComponentFixture<TableResizerTestingComponent>;
    let directive: TableResizerDirective;
    let tableStateHandlerService: jasmine.SpyObj<TableStateHandlerService>;
    let host: HTMLButtonElement;
    let resizeRequested: jasmine.Spy;
    let resizerMovement: jasmine.Spy;

    beforeEach(() => {
        tableStateHandlerService =
            jasmine.createSpyObj<TableStateHandlerService>(
                "TableStateHandlerService",
                ["emitResizeEvent"]
            );
        TestBed.configureTestingModule({
            declarations: [TableResizerDirective, TableResizerTestingComponent],
            providers: [
                {
                    provide: TableStateHandlerService,
                    useValue: tableStateHandlerService,
                },
            ],
        });

        fixture = TestBed.createComponent(TableResizerTestingComponent);
        fixture.detectChanges();
        directive = fixture.debugElement.children[0].children[0].injector.get(
            TableResizerDirective
        );
        host = fixture.nativeElement.querySelector("button");
        resizeRequested = jasmine.createSpy("resize requested");
        resizerMovement = jasmine.createSpy("resizer movement");
        directive.resizeRequested.subscribe(resizeRequested);
        directive.resizerMovement.subscribe(resizerMovement);
    });

    afterEach(() => {
        if (!fixture.componentRef.hostView.destroyed) {
            fixture.destroy();
        }
    });

    it("should request the column-width editor on a click without dragging", fakeAsync(() => {
        host.dispatchEvent(
            new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
            })
        );
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        tick();

        host.dispatchEvent(
            new MouseEvent("click", { bubbles: true, detail: 1 })
        );

        expect(resizeRequested).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.onParentClick).not.toHaveBeenCalled();
    }));

    it("should not request the editor after a pointer drag", fakeAsync(() => {
        host.dispatchEvent(
            new MouseEvent("mousedown", { bubbles: true, cancelable: true })
        );
        const moveEvent = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(moveEvent, "movementX", { value: 8 });
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        tick();
        host.dispatchEvent(
            new MouseEvent("click", { bubbles: true, detail: 1 })
        );

        expect(resizeRequested).not.toHaveBeenCalled();
        expect(tableStateHandlerService.emitResizeEvent).toHaveBeenCalledWith(
            1,
            TableResizePhase.start
        );
        expect(resizerMovement).toHaveBeenCalledWith(8);
        expect(resizerMovement).toHaveBeenCalledWith(null);
    }));

    it("should recognize native keyboard clicks even after a drag", fakeAsync(() => {
        host.dispatchEvent(
            new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
            })
        );
        const moveEvent = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(moveEvent, "movementY", { value: 4 });
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        tick();

        host.dispatchEvent(
            new MouseEvent("click", { bubbles: true, detail: 0 })
        );

        expect(resizeRequested).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.onParentClick).not.toHaveBeenCalled();
    }));

    it("should stop Enter and Space without preventing native activation", () => {
        for (const [key, code] of [
            ["Enter", "Enter"],
            [" ", "Space"],
        ]) {
            const event = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key,
                code,
            });
            host.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(false);
        }

        expect(
            fixture.componentInstance.onParentKeyDown
        ).not.toHaveBeenCalled();
    });

    it("should leave unrelated keydown events unaffected", () => {
        const event = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Tab",
            code: "Tab",
        });
        host.dispatchEvent(event);

        expect(fixture.componentInstance.onParentKeyDown).toHaveBeenCalledTimes(
            1
        );
        expect(event.defaultPrevented).toBe(false);
    });

    it("should preserve pointer-resize start and end notifications", fakeAsync(() => {
        const downEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
        });
        host.dispatchEvent(downEvent);
        expect(downEvent.defaultPrevented).toBe(true);

        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        tick();

        expect(tableStateHandlerService.emitResizeEvent).toHaveBeenCalledWith(
            1,
            TableResizePhase.start
        );
        expect(tableStateHandlerService.emitResizeEvent).toHaveBeenCalledWith(
            1,
            TableResizePhase.end
        );
    }));

    it("should remove document mouse listeners when destroyed", fakeAsync(() => {
        host.dispatchEvent(
            new MouseEvent("mousedown", { bubbles: true, cancelable: true })
        );
        fixture.destroy();

        const moveEvent = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
        });
        Object.defineProperty(moveEvent, "movementX", { value: 8 });
        document.dispatchEvent(moveEvent);
        document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        tick();

        expect(resizerMovement).not.toHaveBeenCalled();
        expect(tableStateHandlerService.emitResizeEvent).toHaveBeenCalledTimes(
            1
        );
        expect(tableStateHandlerService.emitResizeEvent).toHaveBeenCalledWith(
            1,
            TableResizePhase.start
        );
    }));
});
