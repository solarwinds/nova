import { OnDestroy } from "@angular/core";
import each from "lodash/each";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IEventDefinition } from "./public-api";

/**
 * @ignore
 */
// TODO: Add Angular decorator.
export class EventBus<T> implements OnDestroy {

    public streamAdded = new ReplaySubject<string>();
    private streams: { [key: string]: Subject<T> } = {};

    // Workaround to avoid refactoring of EventBus that is using by default NuiEvent as generic type
    // But we're storing a generic set of data types in our registered subjects
    public getStream(event: IEventDefinition<T>): Subject<T | any> {
        if (!this.streams[event.id]) {
            const subject = event.subjectFactory ? event.subjectFactory() : new Subject<T>();

            // we're decorating the payload with the stream id
            const originalNext = subject.next.bind(subject);
            subject.next = (value?: T) => originalNext(<any>Object.assign(value || {}, { id: event.id }));
            this.streams[event.id] = subject;

            this.streamAdded.next(event.id);
        }
        return this.streams[event.id];
    }

    public ngOnDestroy() {
        each(Object.keys(this.streams), (key: string) => {
            this.streams[key].complete();
        });
    }

    public subscribe(event: IEventDefinition<T>, next: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.getStream(event).subscribe(next, error, complete);
    }

    public subscribeUntil(event: IEventDefinition<T>,
                          until: Observable<any>,
                          next: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        return this.getStream(event)
            .pipe(takeUntil(until))
            .subscribe(next, error, complete);
    }

    public next(event: IEventDefinition<T>, value?: T) {
        return this.getStream(event).next(value);
    }

}
