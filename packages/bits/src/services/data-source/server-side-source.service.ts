import {Injectable, OnDestroy} from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {switchMap, takeUntil, tap} from "rxjs/operators";

import { DataSourceService } from "./data-source.service";
import { IFilteringOutputs, IFilters } from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/server-side-data-source</example-url>
 */
@Injectable()
export abstract class ServerSideDataSource<T, F extends IFilters = IFilters, D = any>
    extends DataSourceService<T> implements OnDestroy {

    public busy = new BehaviorSubject(false);

    protected applyFilters$ = new Subject<F>();
    protected destroy$: Subject<void> = new Subject();

    constructor() {
        super();

        this.setupFilters();
    }

    protected setupFilters() {
        this.applyFilters$.pipe(
            tap((filters) => this.beforeApplyFilters(filters)),
            switchMap((filters: F) => this.getBackendData(filters)),
            tap(async(data: D) => this.afterApplyFilters(data)),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    // make sure we clean upon service destruction
    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.busy.complete();
    }

    protected beforeApplyFilters(filters: F) {
        // show the loader
        this.busy.next(true);

        this.shouldResetFilters(filters);
    }

    protected async afterApplyFilters(data: D) {
        await super.afterApplyFilters(data);

        // no matter if the backend response was successful or not,
        // we need to hide our loader and reset the filters
        this.busy.next(false);
    }

    public async applyFilters() {
        this.applyFilters$.next(this.getFilters() as F);
    }

    public async abstract getFilteredData(data: D): Promise<IFilteringOutputs>;

    protected abstract getBackendData(filters: F): Observable<D>;
}
