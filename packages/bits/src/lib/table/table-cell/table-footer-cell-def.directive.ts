import { CdkFooterCellDef } from "@angular/cdk/table";
import { Directive, TemplateRef } from "@angular/core";

/**
 * @ignore
 */

@Directive({
    selector: "[nuiFooterCellDef]",
    providers: [
        { provide: CdkFooterCellDef, useExisting: TableFooterCellDefDirective },
    ],
})
export class TableFooterCellDefDirective extends CdkFooterCellDef {
    constructor(public template: TemplateRef<any>) {
        super(template);
    }
}
