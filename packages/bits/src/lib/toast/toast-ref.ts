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

import { Observable, Subject } from "rxjs";

import { IToastRef } from "./public-api";
import { ToastContainerService } from "./toast-container.service";

/**
 * Reference to a toast opened via the Toast service.
 * Used to provide toast events hooks
 */
/** @ignore */
export class ToastRef<T> implements IToastRef<T> {
    /** The instance of component opened into the toast. */
    public componentInstance: T;
    /** Subject for notifying user, that the toast has finished closing. */
    private readonly afterClosedSubject = new Subject<void>();
    private readonly activateSubject = new Subject<void>();
    private readonly manualCloseSubject = new Subject<void>();

    constructor(private toastContainerService: ToastContainerService) {}

    public manualClose(): void {
        this.manualCloseSubject.next();
        this.manualCloseSubject.complete();
    }

    public manualClosed(): Observable<any> {
        return this.manualCloseSubject.asObservable();
    }

    /**
     * Close toast
     */
    public close(): void {
        this.toastContainerService.detachToast(this.componentInstance);
        this.afterClosedSubject.next();
        this.afterClosedSubject.complete();
    }

    /** Gets an observable that is notified when the toast has finished closing. */
    public afterClosed(): Observable<any> {
        return this.afterClosedSubject.asObservable();
    }

    public isInactive(): boolean {
        return this.activateSubject.isStopped;
    }

    public activate(): void {
        this.activateSubject.next();
        this.activateSubject.complete();
    }

    /** Gets an observable that is notified when the toast has started opening. */
    public afterActivate(): Observable<any> {
        return this.activateSubject.asObservable();
    }
}
