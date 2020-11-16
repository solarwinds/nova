import { Inject, Optional } from "@angular/core";
import { EventBus, IDataSource, IEvent, IFilteringOutputs, VirtualViewportManager } from "@solarwinds/nova-bits";
import { merge, Observable, zip } from "rxjs";
import { debounceTime, startWith, switchMap, takeUntil, tap } from "rxjs/operators";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { REFRESH, SCROLL_NEXT_PAGE, WIDGET_READY } from "../../services/types";
import { DATA_SOURCE, IProperties, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../types";

import { DataSourceAdapter } from "./data-source-adapter";

export class TableDataSourceAdapter<T extends IFilteringOutputs> extends DataSourceAdapter<T> {
    private dataPath: string;
    private dataFieldsPath: string;
    private totalItemsPath: string;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                @Inject(DATA_SOURCE) dataSource: IDataSource,
                pizzagnaService: PizzagnaService,
                @Optional() protected virtualViewport: VirtualViewportManager) {
        super(eventBus, dataSource, pizzagnaService);
    }

    protected setupRefreshListener() {
        // Note: We should wait until TableWidget is ready to be able to proceed with reset event
        // We can also listen after SCROLL_NEXT_PAGE instead of WIDGET_READY because right now
        // they are executed simultaneously but we don't know how things will change in the future
        const refresh$: Observable<void> = zip(this.eventBus.getStream(WIDGET_READY), this.eventBus.getStream(REFRESH)).pipe(
            // Note: Using startWith() to re-trigger the REFRESH stream that was triggered at least on time before WIDGET_READY
            switchMap(() => this.eventBus.getStream(REFRESH).pipe(startWith(undefined))),
            tap(() => this.virtualViewport.reset({emitFirstPage: false})));

        merge(refresh$, this.eventBus.getStream(SCROLL_NEXT_PAGE)).pipe(
            // Note: While SCROLL_NEXT_PAGE is triggered on TableWidget initialization aka WIDGET_READY
            // we might encounter REFRESH and SCROLL_NEXT_PAGE triggered at the same time.
            // Setting a small debounceTime will help us manage simultaneous requests
            debounceTime(10),
            tap(() => this.handleRefresh()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    protected updateAdapterProperties(properties: IProperties) {
        this.dataPath = properties.dataPath;
        this.dataFieldsPath = properties.dataFieldsPath;
        this.totalItemsPath = properties.totalItemsPath;
    }

    protected updateOutput(output: IFilteringOutputs | undefined) {
        const total = output?.paginator?.total;
        const items = output?.repeat?.itemsSource;
        const dataFields = output?.dataFields;

        this.pizzagnaService.setProperty({
            pizzagnaKey: PizzagnaLayer.Data,
            componentId: this.componentId,
            propertyPath: [this.totalItemsPath],
        }, total);

        this.pizzagnaService.setProperty({
            pizzagnaKey: PizzagnaLayer.Data,
            componentId: this.componentId,
            propertyPath: [this.dataPath],
        }, items);

        this.pizzagnaService.setProperty({
            pizzagnaKey: PizzagnaLayer.Data,
            componentId: this.componentId,
            propertyPath: [this.dataFieldsPath],
        }, dataFields);
    }
}
