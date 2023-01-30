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

import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import _cloneDeep from "lodash/cloneDeep";
import _forEach from "lodash/forEach";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { BehaviorSubject, Observable, Subject } from "rxjs";

import {
    IDataField,
    IDataFieldsConfig,
    IFilter,
    IFilteringOutputs,
    IFilteringParticipant,
    IFilteringParticipants,
    IFilters,
} from "./public-api";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class DataSourceService<
    T,
    F extends IFilters = IFilters,
    D = any
> extends DataSource<T> {
    public dataSubject: BehaviorSubject<T[]>;
    public outputsSubject: Subject<IFilteringOutputs>;
    public dataFieldsConfig: IDataFieldsConfig;

    protected _previousFilters: F;

    protected _components: IFilteringParticipants;

    constructor() {
        super(); // in future dataSource in cdk may have some constructor.
        this.dataSubject = new BehaviorSubject<T[]>([]); // in general we do not have data at this point - that's why empty array
        this.outputsSubject = new Subject<any>(); // some empty state
        this.dataFieldsConfig = {
            dataFields$: new BehaviorSubject<IDataField[]>([]),
        };
    }

    public set componentTree(components: IFilteringParticipants) {
        this._components = components;
    }

    public registerComponent(components: IFilteringParticipants): void {
        this._components = {
            ...this._components,
            ...components,
        };
    }

    public deregisterComponent(componentKey: string): void {
        delete this._components?.[componentKey];
    }

    public abstract getFilteredData(data: D): Promise<IFilteringOutputs>;

    public connect(
        collectionViewer: CollectionViewer
    ): Observable<T[] | ReadonlyArray<T>> {
        return this.dataSubject.asObservable();
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
    }

    public async applyFilters(): Promise<void> {
        // store a copy of the filters to avoid altering the stored values by reference
        const filters = _cloneDeep(this.getFilters());

        this.beforeApplyFilters(filters);
        await this.afterApplyFilters(filters);
    }

    public getFilter(
        componentName: keyof IFilteringParticipants
    ): F | undefined {
        const filter = this._components[componentName];
        if (!filter) {
            throw new Error(
                `Invalid filter name '${componentName}' requested; available filter names are: ${Object.keys(
                    this._components
                )}`
            );
        }

        return filter?.componentInstance?.getFilters() as F;
    }

    public getFilters(): F {
        const filters: F = {} as F;

        // Merge current filters
        _forEach(
            this._components,
            (
                node: IFilteringParticipant,
                componentName: keyof IFilteringParticipants
            ) => {
                (filters as IFilters)[componentName] =
                    this.getFilter(componentName);
            }
        );

        return filters;
    }

    public get monitoredFilters(): string[] {
        const filters: string[] = [];

        _forEach(
            this._components,
            (
                node: IFilteringParticipant,
                componentName: keyof IFilteringParticipants
            ) => {
                if (node.componentInstance?.detectFilterChanges === true) {
                    filters.push(componentName as string);
                }
            }
        );

        return filters;
    }

    // check if a specific filter changed
    public filterChanged(
        filterName: keyof IFilteringParticipants,
        currentFilterValue?: IFilter<any>
    ): boolean {
        // retrieve provided value if provided, otherwise get a fresh one
        const filterValue = (currentFilterValue ?? this.getFilter(filterName))
            ?.value;
        return (
            !isNil(filterValue) &&
            this._previousFilters &&
            !isEqual(filterValue, this._previousFilters[filterName]?.value)
        );
    }

    // checks if any of the filters specified by name have changed from the previous evaluation
    public filtersChanged(
        filters: F,
        ...filterNames: (keyof IFilteringParticipants)[]
    ): boolean {
        for (let i = 0; i < filterNames.length; i++) {
            const filterName = filterNames[i];
            if (this.filterChanged(filterName, filters[filterName])) {
                return true;
            }
        }

        return false;
    }

    public computeFiltersChange(filters: F): boolean {
        return this.filtersChanged(filters, ...this.monitoredFilters);
    }

    protected beforeApplyFilters(filters: F): void {}

    protected async afterApplyFilters(data: D): Promise<void> {
        this.outputsSubject.next(await this.getFilteredData(data));

        this._previousFilters = this.getFilters();
    }

    protected shouldResetFilters(filters: F): boolean {
        const filtersChanged = this.computeFiltersChange(filters);
        if (filtersChanged) {
            this.resetFilters(filters);
        }

        return filtersChanged;
    }

    protected resetFilters(filters: F): void {
        _forEach(filters, (node, key) => {
            const filter = this._components[key].componentInstance;
            if (filter?.resetFilter) {
                filter.resetFilter();
                node.value = filter.getFilters().value;
            }
        });
    }
}
