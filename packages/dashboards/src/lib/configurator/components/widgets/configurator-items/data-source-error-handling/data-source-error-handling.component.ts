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
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { IDataField } from "@nova-ui/bits";
import { IDataSourceError } from "../../../../../components/providers/types";

@Component({
    selector: "nui-data-source-error-handling",
    templateUrl: "./data-source-error-handling.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceErrorHandlingComponent implements OnDestroy, OnInit {
    public static lateLoadKey = "DataSourceErrorHandlingComponent";

    @Output() public errorState = new EventEmitter<boolean>();

    public dataSourceError: IDataSourceError | null;
    public busy: boolean;
    public onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
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
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
