import { Inject, Injectable, OnDestroy } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { takeUntil } from "rxjs/operators";

import { DATA_SOURCE_DESTROYED } from "../../configurator/types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { HttpStatusCode, IConfigurable, IHasComponent, IProperties, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../types";

import { StatusContentFallbackAdapter } from "./status-content-fallback-adapter";
import { IComponentIdPayload, IDataSourceOutputPayload } from "./types";

export interface IKpiFallbackAdapterProperties extends IProperties {
    // Fallback node key to use if multiple tile data sources report different errors
    multipleErrorFallbackKey: string;
}

@Injectable()
export class KpiStatusContentFallbackAdapter extends StatusContentFallbackAdapter implements OnDestroy, IHasComponent, IConfigurable {

    /**
     * Fallback node key to use if multiple tile data sources report different errors
     */
    public multipleErrorFallbackKey: string = HttpStatusCode.Unknown;

    /**
     * Map of kpi tile component id's to their corresponding error
     */
    private errorMap: Record<string, string> = {};

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                pizzagnaService: PizzagnaService) {
        super(eventBus, pizzagnaService);

        this.eventBus.getStream(DATA_SOURCE_DESTROYED)
            .pipe(takeUntil(this.destroy$)).subscribe((event: IEvent<IComponentIdPayload>) => {
                this.handleDataSourceDestroyed(event);
            });
    }

    public updateConfiguration(properties: IKpiFallbackAdapterProperties) {
        if (properties.multipleErrorFallbackKey) {
            this.multipleErrorFallbackKey = properties.multipleErrorFallbackKey;
        }
    }

    protected handleDataSourceOutput(event: IEvent<any | IDataSourceOutputPayload<any>>) {
        this.errorMap = this.updateErrorMap(event);

        this.setFallbackKeyProperty();
    }

    protected handleDataSourceDestroyed(event: IEvent<IComponentIdPayload>) {
        if (event.payload?.componentId) {
            delete this.errorMap[event.payload.componentId];
        }

        this.setFallbackKeyProperty();
    }

    private setFallbackKeyProperty() {
        this.pizzagnaService.setProperty({
            componentId: this.componentId,
            propertyPath: ["fallbackKey"],
            pizzagnaKey: PizzagnaLayer.Data,
        }, this.getFallbackKey());
    }

    private getFallbackKey(): string | undefined {
        if (isEmpty(this.errorMap)) {
            return undefined;
        }

        const uniqueErrors = uniq(Object.values(this.errorMap));
        return uniqueErrors.length === 1 ? uniqueErrors[0] : this.multipleErrorFallbackKey;
    }

    private updateErrorMap(event: IEvent<any | IDataSourceOutputPayload<any>>) {
        const errorMap = this.errorMap;
        const errorCode = typeof event.payload?.error?.type !== "undefined" ? event.payload?.error?.type.toString() : undefined;

        // an undefined result indicates the kpi tile was destroyed
        if (!errorCode) {
            delete errorMap[event.payload.componentId];
        } else if (errorCode) {
            errorMap[event.payload.componentId] = errorCode;
        }

        return errorMap;
    }
}
