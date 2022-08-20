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
