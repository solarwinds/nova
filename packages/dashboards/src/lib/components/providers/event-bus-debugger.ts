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

import { PIZZAGNA_EVENT_BUS } from "../../types";

/**
 * A provider that helps with debugging events on the pizzagna event bus. Include it anywhere in the widget to activate it.
 */
@Injectable()
export class EventBusDebugger implements OnDestroy {
    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {
        eventBus.streamAdded
            .pipe(takeUntil(this.destroy$))
            .subscribe((stream) => {
                eventBus
                    .getStream({ id: stream })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((event) => {
                        console.log(`${event.id}: `, event.payload);
                    });
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
