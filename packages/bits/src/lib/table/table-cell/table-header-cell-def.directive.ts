import { CdkHeaderCellDef } from "@angular/cdk/table";
import { Directive, TemplateRef } from "@angular/core";

/**
 * @ignore
 */

@Directive({
    selector: "[nuiHeaderCellDef]",
    providers: [{ provide: CdkHeaderCellDef, useExisting: TableHeaderCellDefDirective }],
})
export class TableHeaderCellDefDirective extends CdkHeaderCellDef {
    constructor(public template: TemplateRef<any>) {
        super(template);
    }
}
