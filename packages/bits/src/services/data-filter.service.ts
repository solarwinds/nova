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

import { Injectable, OnDestroy, Optional, SkipSelf } from "@angular/core";
import _forEach from "lodash/forEach";
import _omit from "lodash/omit";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { INovaFilters } from "./data-source/public-api";
import {
    IFilteringParticipant,
    IFilteringParticipants,
    IFilterPub,
    IFilters,
} from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/data-filter-service</example-url>
 */
@Injectable()
export class DataFilterService implements IFilterPub, OnDestroy {
    protected _filters: IFilteringParticipants = {};
    public filteringSubject: Subject<void> = new Subject<void>();
    public onDestroy$ = new Subject<void>();
    private destroySubscriptions: Subscription[] = [];
    constructor(@Optional() @SkipSelf() public parent: DataFilterService) {
        if (this.parent) {
            this.parent.filteringSubject
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.filteringSubject.next();
                });
        }
    }

    public registerFilter(filter: IFilteringParticipants): void {
        this._filters = {
            ...this._filters,
            ...filter,
        };

        // subscribing to onDestroy of filtering components to remove them from memory when this components are destroyed
        _forEach(this._filters, (node: IFilteringParticipant, key: string) => {
            if (node.componentInstance.onDestroy$) {
                this.destroySubscriptions.push(
                    node.componentInstance.onDestroy$.subscribe(() => {
                        this.unregisterFilters([key]);
                    })
                );
            }
        });
        this.filteringSubject.next();
    }

    public unregisterFilters(filtersToUnregister: string[]): void {
        this._filters = _omit(this._filters, filtersToUnregister);
        this.filteringSubject.next();
    }

    public getFilters(): INovaFilters {
        let filters: IFilters = {};

        if (this.parent) {
            filters = this.parent.getFilters();
        }

        // Merge current filters
        _forEach(this._filters, (node: IFilteringParticipant, key: string) => {
            const getFilters =
                node &&
                node.componentInstance &&
                node.componentInstance.getFilters;
            if (typeof getFilters === "function") {
                filters[key] = node.componentInstance.getFilters();
            }
        });
        return filters;
    }

    public applyFilters(): void {
        this.filteringSubject.next();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.destroySubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
