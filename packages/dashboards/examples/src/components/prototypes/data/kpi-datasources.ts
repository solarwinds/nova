import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { OnDestroy } from "@angular/core";
import { DataSourceFeatures, DataSourceService, IDataField, IDataSource, IFilteringOutputs } from "@nova-ui/bits";
import { IKpiData, WellKnownDataSourceFeatures } from "@nova-ui/dashboards";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

export class AcmeKpiDataSource extends DataSourceService<IKpiData> implements IDataSource, OnDestroy {
    public static providerId = "AcmeKpiDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject<boolean>(false);

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
        { id: "anotherFieldFromDataSource", label: "Another Field From DataSource" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        if (!AcmeKpiDataSource.mockError) {
            return new Promise(resolve => setTimeout(() => {
                this.busy.next(false);
                return resolve({
                    result: {
                        value: 0.000000000564564654654,
                        anotherFieldFromDataSource: "whatever",
                    },
                });
            }, 2000));
        } else {
            return new Promise((resolve) => {
                // generate a 404
                this.http.get("http://www.mocky.io/v2/5ec6bfd93200007800d75100?mocky-delay=2000ms")
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

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

export class AcmeKpiDataSource2 extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "AcmeKpiDataSource2";
    public static mockError = false;
    public features = new DataSourceFeatures({ [WellKnownDataSourceFeatures.Interactivity]: { enabled: true } });

    public busy = new BehaviorSubject<boolean>(false);

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
        { id: "numberFormat", label: "Number Format" },
        { id: "link", label: "Link" },
        { id: "icon", label: "Icon" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
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

export class AcmeKpiDataSource3 extends DataSourceService<any> implements OnDestroy {
    public static providerId = "AcmeKpiDataSource3";

    public busy = new BehaviorSubject<boolean>(false);

    public dataFields: Partial<IDataField>[] = [
        { id: "value", label: "Value" },
    ];

    constructor(private http: HttpClient) {
        super();
        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise(resolve => setTimeout(() => {
            this.busy.next(false);
            return resolve({
                result: {
                    value: 1,
                },
            });
        }, 1000));
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

}
