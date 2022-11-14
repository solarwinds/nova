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
import { Subject } from "rxjs";

import {
    HttpStatusCode,
    IDataSourceOutput,
    IKpiData,
} from "@nova-ui/dashboards";

@Injectable()
export class TestKpiDataSource implements OnDestroy {
    public static providerId = "TestKpiDataSource";
    public static mockError = false;

    public outputsSubject = new Subject<IDataSourceOutput<Partial<IKpiData>>>();

    public applyFilters(): void {
        if (!TestKpiDataSource.mockError) {
            this.outputsSubject.next({
                result: {
                    value: 1,
                    units: "EB",
                },
            });
        } else {
            this.outputsSubject.next({
                // @ts-ignore: Mock
                result: null,
                error: {
                    type: HttpStatusCode.Unknown,
                    message: "Http Status Code Unknown",
                },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestKpiDataSource2 implements OnDestroy {
    public static providerId = "TestKpiDataSource2";
    public static mockError = false;

    public outputsSubject = new Subject<Partial<IKpiData>>();

    public applyFilters(): void {
        if (!TestKpiDataSource2.mockError) {
            this.outputsSubject.next({
                value: 2,
                units: "MB/S",
            });
        } else {
            this.outputsSubject.next({
                // @ts-ignore: Mock
                result: null,
                error: { type: HttpStatusCode.Forbidden },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestKpiDataSourceSmallNumber implements OnDestroy {
    public static providerId = "TestKpiDataSourceSmallNumber";
    public static mockError = false;

    public outputsSubject = new Subject<Partial<IKpiData>>();

    public applyFilters(): void {
        if (!TestKpiDataSourceSmallNumber.mockError) {
            this.outputsSubject.next({
                value: 0.000000000000432453453,
                units: "Lack_of_white_spaces_often_break_the_markup",
            });
        } else {
            this.outputsSubject.next({
                // @ts-ignore: Mock
                result: null,
                error: { type: HttpStatusCode.NotFound },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestKpiDataSourceBigNumber implements OnDestroy {
    public static providerId = "TestKpiDataSourceBigNumber";
    public static mockError = false;

    public outputsSubject = new Subject<Partial<IKpiData>>();

    public applyFilters(): void {
        if (!TestKpiDataSourceBigNumber.mockError) {
            this.outputsSubject.next({
                value: 32472894785734,
                units: "Extremely Long Units Value Which Does Represent The Amount Of Bytes",
            });
        } else {
            this.outputsSubject.next({
                // @ts-ignore: Mock
                result: null,
                error: { type: HttpStatusCode.NotFound },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
