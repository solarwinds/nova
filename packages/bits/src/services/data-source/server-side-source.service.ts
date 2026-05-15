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
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

import { DataSourceService } from "./data-source.service";
import { IFilteringOutputs, IFilters } from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/server-side-data-source</example-url>
 */
@Injectable()
export abstract class ServerSideDataSource<
        T,
        F extends IFilters = IFilters,
        D extends IFilters = IFilters
    >
    extends DataSourceService<T>
    implements OnDestroy
{
    public busy = new BehaviorSubject(false);

    protected applyFilters$ = new Subject<F>();
    protected destroy$: Subject<void> = new Subject<void>();

    constructor() {
        super();

        this.setupFilters();
    }

    protected setupFilters(): void {
        this.applyFilters$
            .pipe(
                tap((filters) => this.beforeApplyFilters(filters)),
                switchMap((filters: F) => this.getBackendData(filters)),
                tap(async (data: D) => this.afterApplyFilters(data)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    // make sure we clean upon service destruction
    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.busy.complete();
    }

    protected beforeApplyFilters(filters: F): void {
        // show the loader
        this.busy.next(true);

        this.shouldResetFilters(filters);
    }

    protected async afterApplyFilters(data: D): Promise<void> {
        await super.afterApplyFilters(data);

        // no matter if the backend response was successful or not,
        // we need to hide our loader and reset the filters
        this.busy.next(false);
    }

    public async applyFilters(): Promise<void> {
        this.applyFilters$.next(this.getFilters() as F);
    }

    public abstract getFilteredData(data: D): Promise<IFilteringOutputs>;

    protected abstract getBackendData(filters: F): Observable<D>;
}
