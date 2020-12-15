import { Injectable, OnDestroy } from "@angular/core";
import { DataSourceService } from "@nova-ui/bits";
import { IFilteringOutputs } from "@nova-ui/bits/services/data-source/public-api";
import { IDataSource } from "@nova-ui/dashboards";
import { BehaviorSubject } from "rxjs";

import { getMockBeerReviewCountsByCity, getMockBeerReviewCountsByCity2, IProportionalWidgetData } from "./widget-data";

@Injectable()
export class BeerReviewCountsByCityMockDataSource extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "BeerReviewCountsByCityMockDataSource";
    public busy = new BehaviorSubject(false);

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.outputsSubject.next({ result: getMockBeerReviewCountsByCity() });
                this.busy.next(false);
            }, 300);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class BeerReviewCountsByCityMockDataSource2 extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "BeerReviewCountsByCityMockDataSource2";
    public busy = new BehaviorSubject(false);

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.outputsSubject.next({ result: getMockBeerReviewCountsByCity2() });
                this.busy.next(false);
            }, 1500);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
