import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import {
    DataSourceService,
    IDataSource,
    IFilteringOutputs,
} from "@nova-ui/bits";
import { IConfigurable, IProperties } from "@nova-ui/dashboards";
import { BehaviorSubject, Subject } from "rxjs";
import { finalize } from "rxjs/operators";

import {
    getFixedProportionalWidgetData,
    getRandomProportionalWidgetData,
    IProportionalWidgetData,
} from "./widget-data";

const EUROPEAN_CITIES = ["London", "Paris", "Brno", "Kyiv", "Lisbon"];

@Injectable()
export class AcmeProportionalDataSource
    extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy, IConfigurable
{
    public static providerId = "AcmeProportionalDataSource";
    public static mockError = false;

    public busy = new Subject<boolean>();

    public properties: IProperties = {
        isEuropeOnly: false,
    };

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);

        if (!AcmeProportionalDataSource.mockError) {
            const citiesToInclude = this.properties.isEuropeOnly
                ? [EUROPEAN_CITIES]
                : [];
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        result: getRandomProportionalWidgetData(
                            ...citiesToInclude
                        ),
                    });
                    this.busy.next(false);
                }, 1000);
            });
        } else {
            // generate a 404
            return new Promise((resolve) => {
                this.http
                    .get(
                        "http://www.mocky.io/v2/5ec6bfd93200007800d75100?mocky-delay=1000ms"
                    )
                    .pipe(
                        finalize(() => {
                            this.busy.next(false);
                        })
                    )
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

    public updateConfiguration(properties: IProperties): void {
        this.properties = properties;
    }
}

@Injectable()
export class AcmeProportionalDataSource2
    extends DataSourceService<IProportionalWidgetData>
    implements IDataSource<IProportionalWidgetData>, OnDestroy, IConfigurable
{
    public static providerId = "AcmeProportionalDataSource2";
    public busy = new BehaviorSubject(false);

    public properties: IProperties = {
        isEuropeOnly: false,
    };

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(false);

        const citiesToInclude = this.properties.isEuropeOnly
            ? [EUROPEAN_CITIES]
            : [];
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    result: getFixedProportionalWidgetData(...citiesToInclude),
                });
                this.busy.next(false);
            }, 1000);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

    public updateConfiguration(properties: IProperties): void {
        this.properties = properties;
    }
}
