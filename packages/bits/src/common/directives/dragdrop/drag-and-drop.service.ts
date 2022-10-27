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

import { Injectable } from "@angular/core";
import _isNil from "lodash/isNil";
import _isObject from "lodash/isObject";
import { Observable, Subject } from "rxjs";

import { IDragPayload, IDragState } from "./public-api";

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class DragAndDropService {
    private onDragStateSubject = new Subject<IDragState>();
    private dragPayload: any;

    public get onDragStateChanged(): Observable<IDragState> {
        return this.onDragStateSubject.asObservable();
    }

    public setDragPayload(payload: any, event: DragEvent) {
        this.dragPayload = payload;
        const stringifiedPayload = _isObject(payload)
            ? JSON.stringify(payload)
            : <string>payload;
        event.dataTransfer?.setData("Text", stringifiedPayload);
        event.dataTransfer?.setData("text/plain", stringifiedPayload);
        this.onDragStateSubject.next({
            payload: this.dragPayload,
            isInProgress: true,
        });
    }

    public getDragPayload(event: DragEvent): IDragPayload {
        if (_isNil(this.dragPayload)) {
            return { data: this.extractDragObject(event), isExternal: true };
        }
        return { data: this.dragPayload, isExternal: false };
    }

    public resetPayload() {
        this.onDragStateSubject.next({
            payload: this.dragPayload,
            isInProgress: false,
        });
        this.dragPayload = undefined;
    }

    private extractDragObject(event: DragEvent): any {
        const payload =
            event.dataTransfer?.getData("Text") ||
            event.dataTransfer?.getData("text/plain");
        try {
            return JSON.parse(payload || "");
        } catch (e) {
            return payload;
        }
    }
}
