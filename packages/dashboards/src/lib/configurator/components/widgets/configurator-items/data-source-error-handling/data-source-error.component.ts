import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { IDataSourceError } from "../../../../../components/providers/types";
import { IDataSource } from "@nova-ui/bits";
import isUndefined from "lodash/isUndefined";

@Component({
    selector: "nui-data-source-error-handling",
    templateUrl: "./data-source-error.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceErrorComponent implements OnDestroy, OnChanges {
    public static lateLoadKey = "DataSourceErrorHandlingComponent";

    @Input() public dataSource: IDataSource;
    @Output() public errorState = new EventEmitter<boolean>();

    public dataSourceError: IDataSourceError | null;
    public busy: boolean;
    public onDestroy$: Subject<void> = new Subject<void>();
    public data: any;

    private dataSourceClear$: Subject<void> = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if(changes.dataSource) {
            this.onDataSourceChanged();
        }
    }

    onDataSourceChanged() {
        this.dataSourceClear$.next();

        this.dataSource?.busy?.pipe(takeUntil(this.dataSourceClear$))
            .subscribe((isBusy: boolean) => {
                this.busy = isBusy;
                this.changeDetector.markForCheck();
            });

        this.dataSource?.outputsSubject.pipe(takeUntil(this.dataSourceClear$))
            .subscribe((value) => {
                this.data = isUndefined(value?.result) ? value : value?.result;
                this.dataSourceError = value?.error;
                this.errorState.emit(!!this.dataSourceError);
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.dataSourceClear$.next();
        this.dataSourceClear$.complete();
    }
}
