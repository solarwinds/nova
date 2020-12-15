import { Inject, Injectable, OnDestroy } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { PIZZAGNA_EVENT_BUS } from "../../types";

/**
 * A provider that helps with debugging events on the pizzagna event bus. Include it anywhere in the widget to activate it.
 */
@Injectable()
export class EventBusDebugger implements OnDestroy {

    private destroy$ = new Subject();

    constructor(@Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
        eventBus.streamAdded
            .pipe(takeUntil(this.destroy$))
            .subscribe((stream) => {
                eventBus.getStream({ id: stream })
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
