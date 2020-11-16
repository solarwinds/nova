import { CdkCellDef } from "@angular/cdk/table";
import { Directive, TemplateRef } from "@angular/core";

/**
 * @ignore
 */

@Directive({
    selector: "[nuiCellDef]",
    providers: [{ provide: CdkCellDef, useExisting: TableCellDefDirective }],
})
export class TableCellDefDirective extends CdkCellDef {
    constructor(public template: TemplateRef<any>) {
        super(template);
    }
}
