import { CdkTableModule } from "@angular/cdk/table";
import { NgModule, Type } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiSelectModule } from "../select/select.module";
import { NuiSelectorModule } from "../selector/selector.module";
import { TableCellDefDirective } from "./table-cell/table-cell-def.directive";
import { TableCellDirective } from "./table-cell/table-cell.directive";
import { TableColumnDefDirective } from "./table-cell/table-column-def.directive";
import { TableFooterCellDefDirective } from "./table-cell/table-footer-cell-def.directive";
import { TableFooterCellDirective } from "./table-cell/table-footer-cell.directive";
import { TableHeaderCellDefDirective } from "./table-cell/table-header-cell-def.directive";
import { TableHeaderCellComponent } from "./table-cell/table-header-cell.component";
import { TableResizerDirective } from "./table-resizer/table-resizer.directive";
import {
    TableFooterRowComponent,
    TableFooterRowDefDirective,
    TableHeaderRowComponent,
    TableHeaderRowDefDirective,
    TableRowComponent,
    TableRowDefDirective,
} from "./table-row/table-row.component";
import { SliceRangePipe } from "./table-virtual-scroll/slice-range.pipe";
import { TableStickyHeaderDirective } from "./table-virtual-scroll/table-sticky-header.directive";
import {
    TableVirtualScrollDirective,
    TableVirtualScrollLinearDirective,
} from "./table-virtual-scroll/table-virtual-scroll.directive";
import { TableComponent } from "./table.component";

const DECLARATIONS_EXPORTS: Array<Type<any> | any[]> = [
    TableComponent,
    TableHeaderRowDefDirective,
    TableResizerDirective,
    TableCellDefDirective,
    TableRowDefDirective,
    TableFooterRowDefDirective,
    TableHeaderRowComponent,
    TableRowComponent,
    TableFooterRowComponent,
    TableHeaderCellDefDirective,
    TableHeaderCellComponent,
    TableCellDirective,
    TableFooterCellDefDirective,
    TableFooterCellDirective,
    TableColumnDefDirective,
    TableVirtualScrollDirective,
    TableVirtualScrollLinearDirective,
    TableStickyHeaderDirective,
    SliceRangePipe,
];

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiSelectModule,
        NuiSelectorModule,
        NuiCheckboxModule,
        NuiIconModule,
        CdkTableModule,
    ],
    declarations: DECLARATIONS_EXPORTS,
    exports: DECLARATIONS_EXPORTS,
    providers: [],
})
export class NuiTableModule {}
