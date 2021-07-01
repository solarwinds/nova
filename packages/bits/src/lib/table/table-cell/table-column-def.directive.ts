import { CdkColumnDef } from "@angular/cdk/table";
import { Directive, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

import { ColumnTypes } from "../types";
import { TableStateHandlerService } from "../table-state-handler.service";
import { ICON_CELL_WIDTH_PX } from "../constants";

/**
 * @ignore
 */

@Directive({
    selector: "[nuiColumnDef]",
    providers: [{ provide: CdkColumnDef, useExisting: TableColumnDefDirective }],
})
export class TableColumnDefDirective extends CdkColumnDef implements OnInit, OnChanges {
    /* eslint-disable @angular-eslint/no-input-rename */
    public get name(): string {
        return super.name;
    }
    @Input("nuiColumnDef")
    public set name(value: string) {
        super.name = value;
    }
    /* eslint-enable @angular-eslint/no-input-rename */
    @Input() type: ColumnTypes;
    @Input() columnWidth: number;

    constructor(private tableStateHandlerService: TableStateHandlerService) {
        super();
    }

    ngOnInit(): void {
        if (this.type === "icon") {
            this.tableStateHandlerService.setAlignment(this.name, "align-center");
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.columnWidth || changes.type) {
            const width = this.type === "icon" ? ICON_CELL_WIDTH_PX : changes.columnWidth.currentValue;
            const fixed = !!this.columnWidth || this.type === "icon";
            this.tableStateHandlerService.setColumnWidth(this.name, width, fixed);
        }
    }
}
