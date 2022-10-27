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
import { Observable, Subject } from "rxjs";

import { ToastService } from "@nova-ui/bits";
import {
    IConfiguratorSource,
    IDashboardPersistenceHandler,
    IWidget,
} from "@nova-ui/dashboards";

@Injectable()
export class AcmeFormSubmitHandler implements IDashboardPersistenceHandler {
    public allowSubmit = true;
    public allowRemoval = true;

    constructor(private toastService: ToastService) {
        this.toastService.setConfig({
            timeOut: 2000,
        });
    }

    public trySubmit = (
        widget: IWidget,
        source: IConfiguratorSource
    ): Observable<IWidget> => {
        const subject = new Subject<IWidget>();

        setTimeout(() => {
            if (this.allowSubmit) {
                subject.next(widget);
            } else {
                const error = $localize`Submit failed.`;
                this.toastService.error({ title: error });
                subject.error(error);
            }
        }, 1000);

        return subject.asObservable();
    };

    public tryRemove = (widgetId: string): Observable<string> => {
        const subject = new Subject<string>();

        setTimeout(() => {
            if (this.allowRemoval) {
                subject.next(widgetId);
            } else {
                const error = $localize`Widget removal failed.`;
                this.toastService.error({ title: error });
                subject.error(error);
            }
        }, 200);

        return subject.asObservable();
    };
}
