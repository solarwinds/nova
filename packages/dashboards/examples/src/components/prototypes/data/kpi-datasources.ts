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

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import {
    DataSourceFeatures,
    DataSourceService,
    IDataSource,
    IFilteringOutputs,
} from "@nova-ui/bits";
import { IKpiData, WellKnownDataSourceFeatures } from "@nova-ui/dashboards";

@Injectable()
export class AcmeKpiDataSource
    extends DataSourceService<IKpiData>
    implements IDataSource, OnDestroy
{
    public static providerId = "AcmeKpiDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        if (!AcmeKpiDataSource.mockError) {
            return new Promise((resolve) =>
                setTimeout(() => {
                    this.busy.next(false);
                    return resolve({
                        result: {
                            value: 0.000000000564564654654,
                            anotherFieldFromDataSource: "whatever",
                        },
                    });
                }, 2000)
            );
        } else {
            return new Promise((resolve) => {
                // generate a 404
                this.http
                    .get(
                        "http://www.mocky.io/v2/5ec6bfd93200007800d75100?mocky-delay=2000ms"
                    )
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

@Injectable()
export class AcmeKpiDataSource2
    extends DataSourceService<IKpiData>
    implements OnDestroy
{
    public static providerId = "AcmeKpiDataSource2";
    public static mockError = false;
    public features = new DataSourceFeatures({
        [WellKnownDataSourceFeatures.Interactivity]: { enabled: true },
    });

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public properties: any;

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        if (!AcmeKpiDataSource2.mockError) {
            return new Promise((resolve) =>
                setTimeout(() => {
                    this.busy.next(false);
                    return resolve({
                        result: {
                            value: 2.543,
                            numberFormat: this.properties?.numberFormat,
                            link: "http://www.solarwinds.com",
                            icon: "state_ok",
                        },
                    });
                }, 4000)
            );
        } else {
            return new Promise((resolve) => {
                // generate a 403
                this.http
                    .get(
                        "http://www.mocky.io/v2/5ecc724a3200000f0023614a?mocky-delay=4000ms"
                    )
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

    public updateConfiguration(properties: any): void {
        this.properties = properties;
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class AcmeKpiDataSource3
    extends DataSourceService<any>
    implements OnDestroy
{
    public static providerId = "AcmeKpiDataSource3";

    public busy = new BehaviorSubject<boolean>(false);

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) =>
            setTimeout(() => {
                this.busy.next(false);
                return resolve({
                    result: {
                        value: 1,
                    },
                });
            }, 1000)
        );
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
