import { CdkColumnDef, CdkFooterCell } from "@angular/cdk/table";
import { Directive, ElementRef } from "@angular/core";

/**
 * @ignore
 */

@Directive({
    selector: "nui-footer-cell, td[nuiFooterCell]",
    host: {
        "class": "mat-footer-cell",
        "role": "gridcell",
    },
})
export class TableFooterCellDirective extends CdkFooterCell {
    constructor(columnDef: CdkColumnDef,
                elementRef: ElementRef) {
        super(columnDef, elementRef);
    }
}
