import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { OnDestroy } from "@angular/core";
import { DataSourceFeatures, DataSourceService, IDataSource, IFilteringOutputs } from "@nova-ui/bits";
import { IKpiData, WellKnownDataSourceFeatures } from "@nova-ui/dashboards";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

export class AcmeKpiDataSource extends DataSourceService<IKpiData> implements IDataSource, OnDestroy {
    public static providerId = "AcmeKpiDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http.get("https://jsonplaceholder.typicode.com/todos/1")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.id,
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

export class AcmeKpiDataSource2 extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "AcmeKpiDataSource2";
    public static mockError = false;
    public features = new DataSourceFeatures({ [WellKnownDataSourceFeatures.Interactivity]: { enabled: true } });

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public properties: any;

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        if (!AcmeKpiDataSource2.mockError) {
            return new Promise(resolve => setTimeout(() => {
                this.busy.next(false);
                return resolve({
                    result: {
                        value: 2.543,
                        numberFormat: this.properties?.numberFormat,
                        link: "http://www.solarwinds.com",
                        icon: "state_ok",
                    },
                });
            }, 4000));
        } else {
            return new Promise((resolve) => {
                // generate a 403
                this.http.get("http://www.mocky.io/v2/5ecc724a3200000f0023614a?mocky-delay=4000ms")
                    .pipe(finalize(() => this.busy.next(false)))
                    .subscribe({
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
    }

    public updateConfiguration(properties: any) {
        this.properties = properties;
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

}

export class AcmeKpiDataSource3 extends DataSourceService<IKpiData> implements IDataSource, OnDestroy {
    public static providerId = "AcmeKpiDataSource3";
    public static mockError = false;

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http.get("https://jsonplaceholder.typicode.com/todos/3")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.id,
                                "label":  data.title,
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
