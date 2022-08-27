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

    public applyFilters() {
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

    public applyFilters() {
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

    public applyFilters() {
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

    public applyFilters() {
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
