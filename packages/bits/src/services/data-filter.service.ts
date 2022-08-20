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

    public registerFilter(filter: IFilteringParticipants) {
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

    public unregisterFilters(filtersToUnregister: string[]) {
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

    public applyFilters() {
        this.filteringSubject.next();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.destroySubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
