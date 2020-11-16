import { OnDestroy } from "@angular/core";
import { HttpStatusCode, IDataSourceOutput, IKpiData } from "@solarwinds/nova-dashboards";
import { Subject } from "rxjs";

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
                error: { type: HttpStatusCode.Unknown },
            });
        }
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

}

export class TestKpiDataSource2 implements OnDestroy {
    public static providerId = "TestKpiDataSource2";

    public outputsSubject = new Subject<Partial<IKpiData>>();

    public applyFilters() {
        this.outputsSubject.next({
            value: 2,
            units: "MB/S",
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

}
