import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    Optional,
} from "@angular/core";

import { DataSourceErrorHandlingComponent } from "../data-source-error-handling.component";
import { takeUntil } from "rxjs/operators";
import { IDataField } from "@nova-ui/bits";
import { ConfiguratorDataSourceManagerService } from "../../../../../services/configurator-data-source-manager.service";

@Component({
    selector: "nui-table-data-source-error-handling",
    templateUrl: "./table-data-source-error-handling.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataSourceErrorHandlingComponent extends DataSourceErrorHandlingComponent implements OnDestroy, OnInit {
    public static lateLoadKey = "TableDataSourceErrorHandlingComponent";

    public dataFields: IDataField[];

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Optional() public dataSourceManager: ConfiguratorDataSourceManagerService
    ) {
        super(changeDetector, dataSourceManager);
    }

    ngOnInit() {
        super.ngOnInit();
        this.dataSourceManager?.dataSourceFields
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data: IDataField[]) => {
                this.dataFields = data;
                this.errorState.emit(!this.dataFields.length);
                this.changeDetector.markForCheck();
            });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
