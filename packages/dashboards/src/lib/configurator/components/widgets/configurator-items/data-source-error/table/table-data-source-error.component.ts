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
    selector: "nui-table-data-source-error",
    templateUrl: "./table-data-source-error.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataSourceErrorComponent
    extends DataSourceErrorComponent
    implements OnDestroy
{
    public static lateLoadKey = "TableDataSourceErrorComponent";

    constructor(public changeDetector: ChangeDetectorRef) {
        super(changeDetector);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
