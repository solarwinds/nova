import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { DataSourceService, IFilteringOutputs } from "@nova-ui/bits";
import { IKpiData } from "@nova-ui/dashboards";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import { GOOGLE_BOOKS_URL } from "./table/constants";

@Injectable()
export class HarryPotterAverageRatingDataSource
    extends DataSourceService<IKpiData>
    implements OnDestroy
{
    public static providerId = "HarryPotterAverageRatingDataSource";

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            // *** Make a resource request to an external API (if needed)
            this.http
                .get(`${GOOGLE_BOOKS_URL}/5MQFrgEACAAJ`)
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.averageRating,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class HarryPotterRatingsCountDataSource
    extends DataSourceService<IKpiData>
    implements OnDestroy
{
    public static providerId = "HarryPotterRatingsCountDataSource";

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http
                .get(`${GOOGLE_BOOKS_URL}/5MQFrgEACAAJ`)
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.ratingsCount,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
