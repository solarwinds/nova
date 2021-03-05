import { Inject, Injectable, OnDestroy } from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataSourceError } from "../../components/providers/types";
import { PIZZAGNA_EVENT_BUS } from "../../types";
import { DashwizService } from "../components/wizard/dashwiz/dashwiz.service";
import { DATA_SOURCE_CHANGE, DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../types";

@Injectable()
export class ConfiguratorDataSourceManagerService implements OnDestroy {

    private onDestroy$: Subject<void> = new Subject<void>();
    private dataSourceCreated: Subject<void> = new Subject<void>();
    public dataSource: IDataSource;
    public error: Subject<(IDataSourceError) | null> = new Subject<IDataSourceError | null>();

    constructor(@Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>, private dashwizService: DashwizService) {
        this.eventBus.subscribeUntil(DATA_SOURCE_CREATED, this.onDestroy$, (event: IEvent<IDataSource>) => {
            if (!event.payload) {
                return;
            }

            this.dataSource = event.payload;
            this.dataSourceCreated.next();

            this.dataSource.busy?.pipe(takeUntil(this.dataSourceCreated)).subscribe((isBusy) => {
                dashwizService?.component?.navigationControl.next({
                    busyState: {
                        busy: isBusy,
                    },
                    allowStepChange: !isBusy,
                });
            });
        });

        this.eventBus.subscribeUntil(DATA_SOURCE_OUTPUT, this.onDestroy$, (event: IEvent) => {
            if (event.payload?.error) {
                this.error.next(event.payload.error);
            } else {
                this.error.next(undefined);
            }
        });

        this.eventBus.subscribeUntil(DATA_SOURCE_CHANGE, this.onDestroy$, (event: IEvent<any>) => {
        });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
