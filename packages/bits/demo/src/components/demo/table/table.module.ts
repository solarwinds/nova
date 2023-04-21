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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPaginatorModule,
    NuiProgressModule,
    NuiSearchModule,
    NuiSpinnerModule,
    NuiSwitchModule,
    NuiTableModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TableBasicExampleComponent,
    TableCellContentAlignComponent,
    TableCellWidthSetExampleComponent,
    TableColumnsAddRemoveExampleComponent,
    TableDocsComponent,
    TablePaginationExampleComponent,
    TablePinnedHeaderComponent,
    TableReorderExampleComponent,
    TableResizeExampleComponent,
    TableRowClickableExampleComponent,
    TableRowHeightSetExampleComponent,
    TableRowSelectInstructionsComponent,
    TableSearchExampleComponent,
    TableSearchWithSelectAndPaginationComponent,
    TableSelectableToggleExampleComponent,
    TableSelectExampleComponent,
    TableSelectPinnedHeaderComponent,
    TableSortingExampleComponent,
    TableTestComponent,
    TableVirtualScrollRealApiExampleComponent,
    TableVirtualScrollRealApiMinimalistExampleComponent,
    TableVirtualScrollRealApiProgressFooterExampleComponent,
    TableVirtualScrollRealApiProgressTextFooterExampleComponent,
    TableVirtualScrollSelectStickyHeaderExampleComponent,
    TableVirtualScrollStepsAndButtonExampleComponent,
    TableVirtualScrollStickyHeaderExampleComponent,
    TableVirtualScrollStickyHeaderTestExampleComponent,
    TableVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TableDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "table-test",
        component: TableTestComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "basic",
        component: TableBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "width-set",
        component: TableCellWidthSetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "pagination",
        component: TablePaginationExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "search",
        component: TableSearchExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "height",
        component: TableRowHeightSetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-actions",
        component: TableColumnsAddRemoveExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "sorting",
        component: TableSortingExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "reorder",
        component: TableReorderExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "resize",
        component: TableResizeExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "selectable-toggle",
        component: TableSelectableToggleExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "select",
        component: TableSelectExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "visual-test",
        component: TableVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "table-row-clickable",
        component: TableRowClickableExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "virtual-1",
        component: TableVirtualScrollRealApiExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "virtual-2",
        component: TableVirtualScrollRealApiMinimalistExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "step",
        component: TableVirtualScrollStepsAndButtonExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "sticky",
        component: TableVirtualScrollStickyHeaderExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "sticky-test",
        component: TableVirtualScrollStickyHeaderTestExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "select-sticky",
        component: TableVirtualScrollSelectStickyHeaderExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiTableModule,
        NuiDocsModule,
        NuiPaginatorModule,
        NuiSearchModule,
        NuiSwitchModule,
        NuiDividerModule,
        NuiCheckboxModule,
        NuiTextboxModule,
        NuiMessageModule,
        NuiExpanderModule,
        NuiMenuModule,
        NuiIconModule,
        RouterModule.forChild(routes),
        ScrollingModule,
        NuiSpinnerModule,
        NuiProgressModule,
    ],
    declarations: [
        TableBasicExampleComponent,
        TableCellWidthSetExampleComponent,
        TableColumnsAddRemoveExampleComponent,
        TableDocsComponent,
        TablePaginationExampleComponent,
        TablePinnedHeaderComponent,
        TableReorderExampleComponent,
        TableRowHeightSetExampleComponent,
        TableRowClickableExampleComponent,
        TableResizeExampleComponent,
        TableSearchExampleComponent,
        TableSelectableToggleExampleComponent,
        TableSelectExampleComponent,
        TableSelectPinnedHeaderComponent,
        TableSortingExampleComponent,
        TableCellContentAlignComponent,
        TableTestComponent,
        TableVisualTestComponent,
        TableVirtualScrollRealApiExampleComponent,
        TableVirtualScrollStepsAndButtonExampleComponent,
        TableVirtualScrollRealApiProgressFooterExampleComponent,
        TableVirtualScrollRealApiProgressTextFooterExampleComponent,
        TableVirtualScrollRealApiMinimalistExampleComponent,
        TableSearchWithSelectAndPaginationComponent,
        TableVirtualScrollStickyHeaderExampleComponent,
        TableVirtualScrollStickyHeaderTestExampleComponent,
        TableVirtualScrollSelectStickyHeaderExampleComponent,
        TableRowSelectInstructionsComponent,
    ],
    providers: [DatePipe],
    exports: [RouterModule],
})
export default class TableModule {}
