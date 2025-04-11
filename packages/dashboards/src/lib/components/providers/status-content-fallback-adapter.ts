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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { IDataSourceOutputPayload } from "./types";
import { DATA_SOURCE_OUTPUT } from "../../configurator/types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IHasComponent, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../types";

@Injectable()
export class StatusContentFallbackAdapter implements OnDestroy, IHasComponent {
    protected readonly destroy$ = new Subject<void>();
    protected componentId: string;

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        protected pizzagnaService: PizzagnaService
    ) {
        this.eventBus
            .getStream(DATA_SOURCE_OUTPUT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IEvent<any | IDataSourceOutputPayload<any>>) => {
                this.handleDataSourceOutput(event);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: any, componentId: string): void {
        this.componentId = componentId;
    }

    protected handleDataSourceOutput(
        event: IEvent<any | IDataSourceOutputPayload<any>>
    ): void {
        this.pizzagnaService.setProperty(
            {
                componentId: this.componentId,
                propertyPath: ["fallbackKey"],
                pizzagnaKey: PizzagnaLayer.Data,
            },
            typeof event.payload?.error?.type !== "undefined"
                ? event.payload?.error?.type.toString()
                : undefined
        );
    }
}
