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
import isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE_BUSY } from "../../services/types";
import { IHasComponent, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../types";
import { IDataSourceBusyPayload } from "./types";

@Injectable()
export class LoadingAdapter implements OnDestroy, IHasComponent {
    private loadingMap: Record<string, boolean> = {};
    private destroy$ = new Subject();
    private componentId: string;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private pizzagnaService: PizzagnaService
    ) {
        this.eventBus
            .getStream(DATA_SOURCE_BUSY)
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ payload }: IEvent<IDataSourceBusyPayload>) => {
                if (payload?.componentId) {
                    if (payload?.busy) {
                        this.loadingMap[payload.componentId] = true;
                    } else {
                        delete this.loadingMap[payload.componentId];
                    }
                }

                this.pizzagnaService.setProperty(
                    {
                        componentId: this.componentId,
                        propertyPath: ["active"],
                        pizzagnaKey: PizzagnaLayer.Data,
                    },
                    !isEmpty(this.loadingMap)
                );
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: any, componentId: string): void {
        this.componentId = componentId;
    }
}
