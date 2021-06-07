import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";

import { DataSourceErrorComponent } from "../data-source-error.component";
import { IDataField } from "@nova-ui/bits";

@Component({
    selector: "nui-table-data-source-error-handling",
    templateUrl: "./table-data-source-error.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataSourceErrorComponent extends DataSourceErrorComponent implements OnDestroy, OnChanges {
    public static lateLoadKey = "TableDataSourceErrorHandlingComponent";

    constructor(
        public changeDetector: ChangeDetectorRef
    ) {
        super(changeDetector);
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
