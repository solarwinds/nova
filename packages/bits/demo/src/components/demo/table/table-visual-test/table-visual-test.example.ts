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

import { Component } from "@angular/core";
import { TableBasicExampleComponent } from "../table-basic/table-basic.example.component";
import { TablePinnedHeaderComponent } from "../table-pinned-header/table-pinned-header.example.component";
import { TableCellContentAlignComponent } from "../table-cell-content-align/table-cell-content-align.example.component";
import { TableRowHeightSetExampleComponent } from "../table-row-height-set/table-row-height-set.example.component";
import { TableSortingExampleComponent } from "../table-sorting/table-sorting.example.component";
import { TableColumnsAddRemoveExampleComponent } from "../table-columns-add-remove/table-columns-add-remove.example.component";
import { TableResizeExampleComponent } from "../table-resize/table-resize.example.component";
import { TableSelectExampleComponent } from "../table-select/table-select.example.component";
import { TableSelectPinnedHeaderComponent } from "../table-select-pinned-header/table-select-pinned-header.example.component";
import { TableVirtualScrollStickyHeaderTestExampleComponent } from "../table-virtual-scroll-sticky-header-test/table-virtual-scroll-sticky-header-test-example.component";

@Component({
    selector: "table-visual-test-example",
    templateUrl: "./table-visual-test.example.html",
    imports: [TableBasicExampleComponent, TablePinnedHeaderComponent, TableCellContentAlignComponent, TableRowHeightSetExampleComponent, TableSortingExampleComponent, TableColumnsAddRemoveExampleComponent, TableResizeExampleComponent, TableSelectExampleComponent, TableSelectPinnedHeaderComponent, TableVirtualScrollStickyHeaderTestExampleComponent]
})
export class TableVisualTestComponent {}
