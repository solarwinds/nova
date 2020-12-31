import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
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
    TableSelectExampleComponent,
    TableSortingExampleComponent,
    TableTestComponent,
    TableVirtualScrollRealApiExampleComponent,
    TableVirtualScrollRealApiMinimalistExampleComponent,
    TableVirtualScrollRealApiProgressFooterExampleComponent,
    TableVirtualScrollRealApiProgressTextFooterExampleComponent,
    TableVirtualScrollStepsAndButtonExampleComponent,
    TableVisualTestComponent,
} from "./index";
import { TableVirtualScrollSelectStickyHeaderExampleComponent } from "./table-virtual-scroll-select-sticky-header/table-virtual-scroll-select-sticky-header-example.component";
import { TableVirtualScrollStickyHeaderExampleComponent } from "./table-virtual-scroll-sticky-header/table-virtual-scroll-sticky-header-example.component";

const routes = [
    {
        path: "",
        component: TableDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "table-test",
        component: TableTestComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "basic",
        component: TableBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "width-set",
        component: TableCellWidthSetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "pagination",
        component: TablePaginationExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "search",
        component: TableSearchExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "height",
        component: TableRowHeightSetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-actions",
        component: TableColumnsAddRemoveExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "sorting",
        component: TableSortingExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "reorder",
        component: TableReorderExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "resize",
        component: TableResizeExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "select",
        component: TableSelectExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "table-visual-test",
        component: TableVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "table-row-clickable",
        component: TableRowClickableExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "virtual-1",
        component: TableVirtualScrollRealApiExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "virtual-2",
        component: TableVirtualScrollRealApiMinimalistExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "step",
        component: TableVirtualScrollStepsAndButtonExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "sticky",
        component: TableVirtualScrollStickyHeaderExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "select-sticky",
        component: TableVirtualScrollSelectStickyHeaderExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
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
        TableSelectExampleComponent,
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
        TableVirtualScrollSelectStickyHeaderExampleComponent,
        TableRowSelectInstructionsComponent,
    ],
    providers: [
        DatePipe,
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class TableModule {
}
