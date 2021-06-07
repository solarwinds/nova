import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
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
    templateUrl: "./data-source-error-handling.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceErrorHandlingComponent implements OnDestroy, OnInit, OnChanges {
    public static lateLoadKey = "DataSourceErrorHandlingComponent";

    @Input() public dataSource: IDataSource;
    @Output() public errorState = new EventEmitter<boolean>();

    public dataSourceError: IDataSourceError | null;
    public busy: boolean;
    private dataSourceChange$: Subject<void> = new Subject<void>();
    public onDestroy$: Subject<void> = new Subject<void>();
    public data: any;

    constructor(
        public changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit() {
        // This setTimeout is here so we wait for a tick otherwise the subscriptions does not happen
        // since the dataSource input does not exist yet
        setTimeout(() => {
            this.onDataSourceChanged();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.dataSource) {
            this.onDataSourceChanged();
        }
    }

    onDataSourceChanged() {
        this.dataSourceChange$.next();

        this.dataSource?.busy?.pipe(takeUntil(this.dataSourceChange$))
            .subscribe((isBusy: boolean) => {
                this.busy = isBusy;
                this.changeDetector.markForCheck();
            });

        this.dataSource?.outputsSubject.pipe(takeUntil(this.dataSourceChange$))
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
    }
}
