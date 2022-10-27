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

import { HttpStatusCode, IDataSourceOutput } from "@nova-ui/dashboards";

import {
    IProportionalWidgetData,
    PROPORTIONAL_WIDGET_DATA_BIG_NUMBERS,
    PROPORTIONAL_WIDGET_DATA_LARGE,
    PROPORTIONAL_WIDGET_DATA_MEDIUM,
    PROPORTIONAL_WIDGET_DATA_SMALL,
} from "./widget-data";

@Injectable()
export class TestProportionalDataSource implements OnDestroy {
    public static providerId = "TestProportionalDataSource";

    public outputsSubject = new Subject<IProportionalWidgetData[]>();

    public applyFilters(): void {
        this.outputsSubject.next(PROPORTIONAL_WIDGET_DATA_SMALL);
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestProportionalDataSource2 implements OnDestroy {
    public static providerId = "TestProportionalDataSource2";
    public static mockError = false;

    public outputsSubject = new Subject<
        IDataSourceOutput<IProportionalWidgetData[]>
    >();

    public applyFilters(): void {
        if (!TestProportionalDataSource2.mockError) {
            this.outputsSubject.next({
                result: PROPORTIONAL_WIDGET_DATA_MEDIUM,
            });
        } else {
            this.outputsSubject.next({
                // @ts-ignore: Mock
                result: null,
                error: { type: HttpStatusCode.Unknown },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestProportionalDataSource3 implements OnDestroy {
    public static providerId = "TestProportionalDataSource3";

    public outputsSubject = new Subject<IProportionalWidgetData[]>();

    public applyFilters(): void {
        this.outputsSubject.next(PROPORTIONAL_WIDGET_DATA_LARGE);
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Injectable()
export class TestProportionalDataSource4 implements OnDestroy {
    public static providerId = "TestProportionalDataSource4";

    public outputsSubject = new Subject<IProportionalWidgetData[]>();

    public applyFilters(): void {
        this.outputsSubject.next(PROPORTIONAL_WIDGET_DATA_BIG_NUMBERS);
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
