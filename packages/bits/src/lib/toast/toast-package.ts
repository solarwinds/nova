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

import { SafeHtml } from "@angular/platform-browser";
import { Observable, Subject } from "rxjs";

import { IToastConfig } from "./public-api";
import { ToastRef } from "./toast-ref";

/**
 * __Description:__ Represents metadata of a toast.
 * Used as an injectable entity, that injects into a toast component.
 */
/** @ignore */
export class ToastPackage {
    private onClickSubject = new Subject<void>();

    constructor(
        public toastId: number,
        public config: IToastConfig,
        public body: string | SafeHtml | undefined,
        public title: string | undefined,
        public toastType: string,
        public toastRef: ToastRef<any>
    ) {}

    /** Fires after clicking on toast */
    public triggerClick(): void {
        this.onClickSubject.next();
    }

    public onClick(): Observable<any> {
        return this.onClickSubject.asObservable();
    }
}
