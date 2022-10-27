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

import { Inject, Injectable, OnDestroy } from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IDataField, IDataSource, IEvent } from "@nova-ui/bits";

import { IDataSourceError } from "../../components/providers/types";
import { PIZZAGNA_EVENT_BUS } from "../../types";
import { DashwizService } from "../components/wizard/dashwiz/dashwiz.service";
import { DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../types";

@Injectable()
export class ConfiguratorDataSourceManagerService implements OnDestroy {
    private onDestroy$: Subject<void> = new Subject<void>();
    private dataSourceCreated$: Subject<void> = new Subject<void>();
    public dataSource: IDataSource;
    public error$: Subject<IDataSourceError | null> =
        new Subject<IDataSourceError | null>();
    public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    public dataSourceFields$: BehaviorSubject<Array<IDataField>> =
        new BehaviorSubject<Array<IDataField>>([]);

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private dashwizService: DashwizService
    ) {
        this.eventBus.subscribeUntil(
            DATA_SOURCE_CREATED,
            this.onDestroy$,
            (event: IEvent<IDataSource>) => {
                if (!event.payload) {
                    return;
                }
                this.onDataSourceCreated(event.payload);
            }
        );

        this.eventBus.subscribeUntil(
            DATA_SOURCE_OUTPUT,
            this.onDestroy$,
            (event: IEvent) => {
                if (event.payload?.error) {
                    this.error$.next(event.payload.error);
                } else {
                    this.error$.next(undefined);
                    const payload = isUndefined(event.payload.result)
                        ? event.payload
                        : event.payload.result || {};
                    if (payload?.dataFields) {
                        this.dataSourceFields$.next(payload.dataFields);
                    }
                }
            }
        );
    }

    onDataSourceCreated(dataSource: IDataSource): void {
        this.dataSource = dataSource;
        this.dataSourceCreated$.next();

        this.dataSource.busy
            ?.pipe(takeUntil(this.dataSourceCreated$))
            .subscribe((isBusy: boolean) => {
                this.dashwizService?.component?.navigationControl.next({
                    busyState: {
                        busy: isBusy,
                    },
                    allowStepChange: !isBusy,
                });

                this.busy$.next(isBusy);
            });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
