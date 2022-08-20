import { Injectable, OnDestroy } from "@angular/core";
import { HttpStatusCode, IDataSourceOutput } from "@nova-ui/dashboards";
import { Subject } from "rxjs";

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
