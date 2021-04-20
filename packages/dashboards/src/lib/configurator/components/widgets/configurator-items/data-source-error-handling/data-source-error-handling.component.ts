import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, OnDestroy, OnInit,
} from "@angular/core";
import { ConfiguratorDataSourceManagerService } from "../../../../services/configurator-data-source-manager.service";
import { IDataSourceError } from "@nova-ui/dashboards";
import { takeUntil } from "rxjs/operators";
import { Subject, pipe } from "rxjs";

@Component({
    selector: "nui-data-source-error-handling",
    templateUrl: "./data-source-error-handling.component.html",
    styleUrls: ["./data-source-error-handling.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceErrorHandlingComponent implements OnDestroy, OnInit {
    public static lateLoadKey = "DataSourceErrorHandlingComponent";
    public dataSourceError: IDataSourceError | null;
    private onDestroy$: Subject<void> = new Subject<void>();


    constructor(
        private changeDetector: ChangeDetectorRef,
        public dataSourceManager: ConfiguratorDataSourceManagerService
    ) {}

    ngOnInit() {
        this.dataSourceManager.error
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((err: IDataSourceError | null) => {
            this.dataSourceError = err;
            this.changeDetector.markForCheck();
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
