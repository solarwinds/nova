import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";

import { DataSourceErrorHandlingComponent } from "../data-source-error-handling.component";
import { IDataField } from "@nova-ui/bits";

@Component({
    selector: "nui-table-data-source-error-handling",
    templateUrl: "./table-data-source-error-handling.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataSourceErrorHandlingComponent extends DataSourceErrorHandlingComponent implements OnDestroy, OnInit, OnChanges {
    public static lateLoadKey = "TableDataSourceErrorHandlingComponent";

    constructor(
        public changeDetector: ChangeDetectorRef
    ) {
        super(changeDetector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
