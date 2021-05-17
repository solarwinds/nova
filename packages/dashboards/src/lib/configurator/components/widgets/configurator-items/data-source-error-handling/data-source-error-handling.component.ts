import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Optional,
    Output,
} from "@angular/core";
import { ConfiguratorDataSourceManagerService } from "../../../../services/configurator-data-source-manager.service";
import { IDataSourceError } from "@nova-ui/dashboards";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
    selector: "nui-data-source-error-handling",
    templateUrl: "./data-source-error-handling.component.html",
    styleUrls: ["./data-source-error-handling.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceErrorHandlingComponent implements OnDestroy, OnInit {
    @Output() public errorState = new EventEmitter<boolean>();

    public static lateLoadKey = "DataSourceErrorHandlingComponent";
    public dataSourceError: IDataSourceError | null;
    public busy: boolean;
    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private changeDetector: ChangeDetectorRef,
        @Optional() public dataSourceManager: ConfiguratorDataSourceManagerService
    ) {}

    ngOnInit() {
        this.dataSourceManager?.error
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((err: IDataSourceError | null) => {
            this.dataSourceError = err;
            this.errorState.emit(!!this.dataSourceError);
            this.changeDetector.markForCheck();
        });

        this.dataSourceManager?.busy$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((isBusy: boolean) => {
                this.busy = isBusy;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
