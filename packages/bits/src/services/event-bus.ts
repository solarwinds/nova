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

import { Injectable, OnDestroy } from "@angular/core";
import each from "lodash/each";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IEventDefinition } from "./public-api";

/**
 * @ignore
 */
@Injectable()
export class EventBus<T> implements OnDestroy {
    public streamAdded = new ReplaySubject<string>();
    private streams: { [key: string]: Subject<T> } = {};

    // Workaround to avoid refactoring of EventBus that is using by default NuiEvent as generic type
    // But we're storing a generic set of data types in our registered subjects
    public getStream<U = T>(event: IEventDefinition<U>): Subject<U> {
        if (!this.streams[event.id]) {
            const subject = event.subjectFactory
                ? event.subjectFactory()
                : new Subject<T>();

            // we're decorating the payload with the stream id
            const originalNext = subject.next.bind(subject);
            subject.next = (value?: T) =>
                originalNext(<any>Object.assign(value || {}, { id: event.id }));
            this.streams[event.id] = subject as unknown as Subject<T>;

            this.streamAdded.next(event.id);
        }
        return this.streams[event.id] as unknown as Subject<U>;
    }

    public ngOnDestroy(): void {
        each(Object.keys(this.streams), (key: string) => {
            this.streams[key].complete();
        });
    }

    public subscribe(
        event: IEventDefinition<T>,
        next: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        return this.getStream(event).subscribe(next, error, complete);
    }

    public subscribeUntil(
        event: IEventDefinition<T>,
        until: Observable<any>,
        next: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void
    ): Subscription {
        return this.getStream(event)
            .pipe(takeUntil(until))
            .subscribe(next, error, complete);
    }

    public next(event: IEventDefinition<T>, value: T): void {
        return this.getStream(event).next(value);
    }
}
