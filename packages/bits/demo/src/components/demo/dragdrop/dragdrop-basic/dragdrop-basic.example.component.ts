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

import { Component, Inject } from "@angular/core";

import {
    IDropEvent,
    IDropValidator,
    IToastService,
    ToastService,
} from "@nova-ui/bits";

class IsStringValidator implements IDropValidator {
    isValidDropTarget(payload: any, isExternal: boolean): boolean {
        if (isExternal) {
            return false;
        }
        return typeof payload === "string";
    }
}

class IsObjectValidator implements IDropValidator {
    isValidDropTarget(payload: any): boolean {
        return typeof payload === "object";
    }
}

@Component({
    selector: "nui-dragdrop-validator-example",
    templateUrl: "./dragdrop-basic.example.component.html",
    standalone: false
})
export class DragdropBasicExampleComponent {
    public draggableString = "this is a string";
    public draggableObj = {
        imma: "little",
        teapot: "short and stout",
    };
    public destObject: object;
    public destString: string;
    public destAnything: any;
    public draggableExcel =
        "<table>" +
        "<tr>" +
        "<th>thing1</th>" +
        "<th>thing2</th>" +
        "</tr>" +
        "<tr>" +
        "<td>jeff</td>" +
        "<td>4</td>" +
        "</tr>" +
        "<tr>" +
        "<td>john</td>" +
        "<td>8</td>" +
        "</tr>" +
        "</table>";
    public isStringValidator = new IsStringValidator();
    public isObjectValidator = new IsObjectValidator();

    constructor(@Inject(ToastService) private toastService: IToastService) {}

    public onDropObject(dropEvent: IDropEvent): void {
        this.toastService.info({ message: $localize`Drop object!` });
        this.destObject = dropEvent.payload;
    }

    public onDropString(dropEvent: IDropEvent): void {
        this.toastService.info({ message: $localize`Drop string!` });
        this.destString = JSON.stringify(dropEvent.payload);
    }

    public onDropAnything(dropEvent: IDropEvent): void {
        this.toastService.info({ message: $localize`Drop anything!` });
        this.destAnything = dropEvent.payload;
    }

    public onDragStart(event: DragEvent): void {
        this.toastService.info({ message: $localize`Drag start` });
    }

    public onDragEnd(event: DragEvent): void {
        this.toastService.info({ message: $localize`Drag end` });
    }

    public onDragOver(event: DragEvent): void {
        this.toastService.info({
            message: $localize`Drag over`,
            options: { preventDuplicates: true },
        });
    }

    public onDragEnter(event: DragEvent): void {
        this.toastService.info({ message: $localize`Drag enter` });
    }

    public onDragLeave(event: DragEvent): void {
        this.toastService.info({ message: $localize`Drag leave` });
    }
}
