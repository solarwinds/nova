import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import { EventBus, IDataSource, IEvent, IFilteringOutputs } from "@nova-ui/bits";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DATA_SOURCE_DESTROYED, DATA_SOURCE_OUTPUT } from "../../configurator/types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE_BUSY, DATA_SOURCE_INVOKED, REFRESH } from "../../services/types";
import { DATA_SOURCE, IConfigurable, IProperties, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../types";

import { IComponentIdPayload, IDataSourceBusyPayload, IDataSourceOutput } from "./types";

@Injectable()
export class DataSourceAdapter<T extends IFilteringOutputs = IFilteringOutputs> implements IConfigurable, OnDestroy {
    protected componentId: string;
    protected lastValue: T;
    protected destroy$ = new Subject();
    protected dataSourceConfiguration: Record<string, any>;

    private propertyPath: string;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>,
                @Optional() @Inject(DATA_SOURCE) public dataSource: IDataSource<T>,
                protected pizzagnaService: PizzagnaService) {
        if (!this.dataSource) {
            return;
        }
        this.setupRefreshListener();

        this.dataSource.outputsSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: T | IDataSourceOutput<T>) => this.handleDataSourceUpdate(event));

        if (this.dataSource.busy) {
            this.dataSource.busy
                .pipe(takeUntil(this.destroy$))
                .subscribe((busy: boolean) => {
                    this.eventBus.getStream(DATA_SOURCE_BUSY).next({
                        payload: {
                            componentId: this.componentId,
                            busy,
                        } as IDataSourceBusyPayload,
                    });
                });
        }
    }

    protected setupRefreshListener(): void {
        this.eventBus.getStream(REFRESH)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.handleRefresh());
    }

    protected handleRefresh() {
        this.eventBus.getStream(DATA_SOURCE_INVOKED).next();
        this.dataSource.applyFilters();
    }

    protected handleDataSourceUpdate(value: T | IDataSourceOutput<T>) {
        this.lastValue = isUndefined(value?.result) ? value : value?.result;
        this.updateOutput(this.lastValue);
        this.eventBus.getStream(DATA_SOURCE_OUTPUT).next({ payload: { componentId: this.componentId, ...value } });
    }

    public ngOnDestroy(): void {
        this.updateOutput(undefined);

        const destroyedEvent: IEvent<IComponentIdPayload> = { payload: { componentId: this.componentId } };
        this.eventBus.getStream(DATA_SOURCE_DESTROYED).next(destroyedEvent);

        const busyEvent: IEvent<IDataSourceBusyPayload> = { payload: { componentId: this.componentId, busy: false } };
        this.eventBus.getStream(DATA_SOURCE_BUSY).next(busyEvent);

        this.destroy$.next();
        this.destroy$.complete();
    }

    public updateConfiguration(properties: IProperties) {
        if (properties.componentId) {
            this.componentId = properties.componentId;
        }

        this.updateAdapterProperties(properties);
        this.updateDataSourceProperties(properties);

        if (typeof this.lastValue !== "undefined") {
            this.updateOutput(this.lastValue);
        }
    }

    protected updateAdapterProperties(properties: IProperties) {
        this.propertyPath = properties.propertyPath;
    }

    protected updateDataSourceProperties(properties: IProperties) {
        const dataSourceConfiguration = properties?.dataSource?.properties;
        if (this.dataSourceConfiguration !== dataSourceConfiguration) {
            this.dataSourceConfiguration = dataSourceConfiguration;
            const configurableDataSource = (this.dataSource as unknown as IConfigurable);
            if (configurableDataSource?.updateConfiguration) {
                configurableDataSource.updateConfiguration(properties.dataSource?.properties);
            }
            this.eventBus.getStream(REFRESH).next();
        }

        // check if this is the first call of updateConfiguration and there is no dataSource configuration present in the incoming properties
        // This results in two initial invocations of the data source, and we should eventually remove it. But, currently,
        // widgets sometimes rely on it in order to display their initial data.
        if (typeof this.dataSourceConfiguration === "undefined" && typeof dataSourceConfiguration === "undefined") {
            // using a setTimeout here to give configurable data sources time to receive their configurations before they're invoked
            setTimeout(() => this.eventBus.getStream(REFRESH).next());
        }
    }

    protected updateOutput(value: T | undefined) {
        this.pizzagnaService.setProperty({
            pizzagnaKey: PizzagnaLayer.Data,
            componentId: this.componentId,
            propertyPath: [this.propertyPath],
        }, this.processOutput(value));
    }

    protected processOutput(value: T | undefined): T | undefined {
        return value;
    }
}
