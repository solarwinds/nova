import { Inject, Injectable, OnDestroy } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DATA_SOURCE_OUTPUT } from "../../configurator/types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IHasComponent, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../types";

import { IDataSourceOutputPayload } from "./types";

@Injectable()
export class StatusContentFallbackAdapter implements OnDestroy, IHasComponent {

    protected destroy$ = new Subject();
    protected componentId: string;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
                protected pizzagnaService: PizzagnaService) {
        this.eventBus.getStream(DATA_SOURCE_OUTPUT)
            .pipe(takeUntil(this.destroy$)).subscribe((event: IEvent<any | IDataSourceOutputPayload<any>>) => {
                this.handleDataSourceOutput(event);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: any, componentId: string) {
        this.componentId = componentId;
    }

    protected handleDataSourceOutput(event: IEvent<any | IDataSourceOutputPayload<any>>) {
        this.pizzagnaService.setProperty({
            componentId: this.componentId,
            propertyPath: ["fallbackKey"],
            pizzagnaKey: PizzagnaLayer.Data,
        }, typeof event.payload?.error?.type !== "undefined" ? event.payload?.error?.type.toString() : undefined);
    }
}
