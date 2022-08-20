import { Inject, Injectable, OnDestroy } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";
import isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
