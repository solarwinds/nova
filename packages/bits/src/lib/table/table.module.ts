// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { CdkTableModule } from "@angular/cdk/table";
import { NgModule, Type } from "@angular/core";

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
import { NuiCommonModule } from "../../common/common.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiRadioModule } from "../radio/radio.module";
import { NuiSelectModule } from "../select/select.module";
import { NuiSelectorModule } from "../selector/selector.module";

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
        NuiRadioModule,
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
