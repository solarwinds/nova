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
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { InMemoryCache } from "@apollo/client/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";

import {
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiImageModule,
    NuiMessageModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectorModule,
    NuiSorterModule,
    NuiSpinnerModule,
    NuiTableModule,
    NuiTabsModule,
    NuiToolbarModule,
    SrlcStage,
} from "@nova-ui/bits";

import { BasicFilterGroupExampleComponent } from "./filter-group/basic-filter-group/basic-filter-group.example.component";
import { BasicFilterGroupCompositeModule } from "./filter-group/basic-filter-group/basic-filter-group.module";
import { CustomDataSourceFilterGroupExampleComponent } from "./filter-group/custom-data-source-filter-group/custom-data-source-filter-group.example.component";
import { CustomDataSourceFilterGroupCompositeModule } from "./filter-group/custom-data-source-filter-group/custom-data-source-filter-group.module";
import { CustomTemplateFilterGroupExampleComponent } from "./filter-group/custom-template-filter-group/custom-template-filter-group.example.component";
import { CustomTemplateFilterGroupCompositeModule } from "./filter-group/custom-template-filter-group/custom-template-filter-group.module";
import { DialogFilterGroupExampleComponent } from "./filter-group/dialog-filter-group/dialog-filter-group.example.component";
import { DialogFilterGroupCompositeModule } from "./filter-group/dialog-filter-group/dialog-filter-group.module";
import { FakeHTTPService, FakeServer } from "./filter-group/fake-http.service";
import { FilterGroupSchematicExampleComponent } from "./filter-group/filter-group-schematic.example.component";
import { FilteredViewListWithPaginationComponent } from "./filtered-view/filtered-view-list-with-pagination/filtered-view-list-with-pagination.component";
import { FilteredViewListWithPaginationModule } from "./filtered-view/filtered-view-list-with-pagination/filtered-view-list-with-pagination.module";
import { FilteredViewListWithVirtualScrollComponent } from "./filtered-view/filtered-view-list-with-virtual-scroll/filtered-view-list-with-virtual-scroll.component";
import { FilteredViewListWithVirtualScrollModule } from "./filtered-view/filtered-view-list-with-virtual-scroll/filtered-view-list-with-virtual-scroll.module";
import { FilteredViewSchematicExampleComponent } from "./filtered-view/filtered-view-schematic.example.component";
import { FilteredViewTableWithCustomVirtualScrollComponent } from "./filtered-view/filtered-view-table-with-custom-virtual-scroll/filtered-view-table-with-custom-virtual-scroll.component";
import { FilteredViewTableWithCustomVirtualScrollModule } from "./filtered-view/filtered-view-table-with-custom-virtual-scroll/filtered-view-table-with-custom-virtual-scroll.module";
import { FilteredViewTableWithPaginationComponent } from "./filtered-view/filtered-view-table-with-pagination/filtered-view-table-with-pagination.component";
import { FilteredViewTableWithPaginationModule } from "./filtered-view/filtered-view-table-with-pagination/filtered-view-table-with-pagination.module";
import { FilteredViewTableWithSelectionComponent } from "./filtered-view/filtered-view-table-with-selection/filtered-view-table-with-selection.component";
import { FilteredViewTableWithSelectionModule } from "./filtered-view/filtered-view-table-with-selection/filtered-view-table-with-selection.module";
import { FilteredViewTableWithVirtualScrollSelectionComponent } from "./filtered-view/filtered-view-table-with-virtual-scroll-selection/filtered-view-table-with-virtual-scroll-selection.component";
import { FilteredViewTableWithVirtualScrollSelectionModule } from "./filtered-view/filtered-view-table-with-virtual-scroll-selection/filtered-view-table-with-virtual-scroll-selection.module";
import { FilteredViewTableWithVirtualScrollComponent } from "./filtered-view/filtered-view-table-with-virtual-scroll/filtered-view-table-with-virtual-scroll.component";
import { FilteredViewTableWithVirtualScrollModule } from "./filtered-view/filtered-view-table-with-virtual-scroll/filtered-view-table-with-virtual-scroll.module";
import { FilteredViewWithListComponent } from "./filtered-view/filtered-view-with-list/filtered-view-with-list.component";
import { FilteredViewWithListModule } from "./filtered-view/filtered-view-with-list/filtered-view-with-list.module";
import { FilteredViewWithTableComponent } from "./filtered-view/filtered-view-with-table/filtered-view-with-table.component";
import { FilteredViewWithTableModule } from "./filtered-view/filtered-view-with-table/filtered-view-with-table.module";
import { FilteredViewWithTreeComponent } from "./filtered-view/filtered-view-with-tree/filtered-view-with-tree.component";
import { FilteredViewWithTreeModule } from "./filtered-view/filtered-view-with-tree/filtered-view-with-tree.module";
import { BasicListComponent } from "./list/basic-list/basic-list.component";
import { ListSchematicExampleComponent } from "./list/list-schematic.example.component";
import { PaginatedListComponent } from "./list/paginated-list/paginated-list.component";
import { SearchListComponent } from "./list/search-list/search-list.component";
import { SelectionListComponent } from "./list/selection-list/selection-list.component";
import { VirtualScrollListComponent } from "./list/virtual-scroll-list/virtual-scroll-list.component";
import { SchematicsDocsComponent } from "./schematics-docs.component";
import { SchematicsOutletComponent } from "./schematics-outlet.component";
import { BasicTableComponent } from "./table/basic-table/basic-table.component";
import { TableSchematicExampleComponent } from "./table/table-schematic-example.component";
import { TableWithCustomVirtualScrollComponent } from "./table/table-with-custom-virtual-scroll/table-with-custom-virtual-scroll.component";
import { TableWithPaginationComponent } from "./table/table-with-pagination/table-with-pagination.component";
import { TableWithSearchComponent } from "./table/table-with-search/table-with-search.component";
import { TableWithSelectionComponent } from "./table/table-with-selection/table-with-selection.component";
import { TableWithSortComponent } from "./table/table-with-sort/table-with-sort.component";
import { TableWithVirtualScrollComponent } from "./table/table-with-virtual-scroll/table-with-virtual-scroll.component";
import { TableSchematicsVisualTestComponent } from "./table/visual-test/table-schematics-visual-test.component";
import { RecursiveObjectViewComponent } from "./utils/recursive-object-view.component";
import { SchematicsDocsCliOptionComponent } from "./utils/schematic-docs-cli-option/schematic-docs-cli-option.component";
import { SchematicsDocsCommandComponent } from "./utils/schematic-docs-command/schematic-docs-command.component";
import { SchematicDocsExampleComponent } from "./utils/schematic-docs-example/schematic-docs-example.component";
import { SchematicDocsPageComponent } from "./utils/schematic-docs-page/schematic-docs-page.component";
import { SchematicJsonComponent } from "./utils/schematic-json.component";

const COUNTRIES_API = "https://countries-274616.ew.r.appspot.com/";

enum FilteredViewRoutes {
    Main = "",
    List = "list",
    ListPagination = "list-pagination",
    ListVirtualScroll = "list-virtual-scroll",
    Table = "table",
    TablePagination = "table-pagination",
    TablePaginationSelection = "table-pagination-selection",
    TableVirtualScroll = "table-virtual-scroll",
    TableVirtualScrollSelection = "table-virtual-scroll-selection",
    TableVirtualScrollCustom = "table-virtual-scroll-custom",
}

const FILTERED_VIEW_CHILD_ROUTES: (Route & { path: FilteredViewRoutes })[] = [
    {
        path: FilteredViewRoutes.Main,
        component: FilteredViewSchematicExampleComponent,
    },
    {
        path: FilteredViewRoutes.List,
        component: FilteredViewWithListComponent,
    },
    {
        path: FilteredViewRoutes.ListPagination,
        component: FilteredViewListWithPaginationComponent,
    },
    {
        path: FilteredViewRoutes.ListVirtualScroll,
        component: FilteredViewListWithVirtualScrollComponent,
    },
    {
        path: FilteredViewRoutes.Table,
        component: FilteredViewWithTableComponent,
    },
    {
        path: FilteredViewRoutes.TablePagination,
        component: FilteredViewTableWithPaginationComponent,
    },
    {
        path: FilteredViewRoutes.TablePaginationSelection,
        component: FilteredViewTableWithSelectionComponent,
    },
    {
        path: FilteredViewRoutes.TableVirtualScroll,
        component: FilteredViewTableWithVirtualScrollComponent,
    },
    {
        path: FilteredViewRoutes.TableVirtualScrollSelection,
        component: FilteredViewTableWithVirtualScrollSelectionComponent,
    },
    {
        path: FilteredViewRoutes.TableVirtualScrollCustom,
        component: FilteredViewTableWithCustomVirtualScrollComponent,
    },
];

const staticRoutes: Routes = [
    {
        path: "",
        component: SchematicsDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "filtered-view",
        component: SchematicsOutletComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
        children: FILTERED_VIEW_CHILD_ROUTES,
    },
    {
        path: "filter-group",
        component: FilterGroupSchematicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "list",
        component: ListSchematicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "list-outlet",
        component: SchematicsOutletComponent,
        children: [
            {
                path: "selection",
                component: SelectionListComponent,
            },
            {
                path: "vscroll",
                component: VirtualScrollListComponent,
            },
        ],
    },
    {
        path: "table",
        component: TableSchematicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "table-outlet",
        component: SchematicsOutletComponent,
        children: [
            {
                path: "virtual-scroll",
                component: TableWithVirtualScrollComponent,
                data: {
                    srlc: {
                        hideIndicator: true,
                    },
                },
            },
            {
                path: "visual-test",
                component: TableSchematicsVisualTestComponent,
                data: {
                    srlc: {
                        hideIndicator: true,
                    },
                },
            },
        ],
    },
    {
        path: "tree",
        component: FilteredViewWithTreeComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        FakeServer,
        SchematicsOutletComponent,
        FilteredViewSchematicExampleComponent,
        BasicFilterGroupExampleComponent,
        CustomDataSourceFilterGroupExampleComponent,
        CustomTemplateFilterGroupExampleComponent,
        DialogFilterGroupExampleComponent,
        FilterGroupSchematicExampleComponent,
        BasicListComponent,
        SearchListComponent,
        SelectionListComponent,
        ListSchematicExampleComponent,
        TableSchematicExampleComponent,
        TableSchematicsVisualTestComponent,
        RecursiveObjectViewComponent,
        SchematicJsonComponent,
        SchematicsDocsComponent,
        SchematicsDocsCommandComponent,
        SchematicDocsExampleComponent,
        SchematicDocsPageComponent,
        SchematicsDocsCliOptionComponent,
        VirtualScrollListComponent,
        PaginatedListComponent,
        TableWithVirtualScrollComponent,
        TableWithPaginationComponent,
        BasicTableComponent,
        TableWithSortComponent,
        TableWithSearchComponent,
        TableWithSelectionComponent,
        TableWithCustomVirtualScrollComponent,
    ],
    imports: [
        CommonModule,
        NuiExpanderModule,
        NuiMessageModule,
        NuiPaginatorModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSorterModule,
        NuiSelectorModule,
        NuiToolbarModule,
        NuiCheckboxModule,
        NuiTabsModule,
        NuiSpinnerModule,
        NuiPanelModule,
        NuiTableModule,
        NuiDialogModule,
        NuiBusyModule,
        NuiIconModule,
        RouterModule.forChild(staticRoutes),
        FilteredViewWithTableModule,
        BasicFilterGroupCompositeModule,
        CustomDataSourceFilterGroupCompositeModule,
        CustomTemplateFilterGroupCompositeModule,
        DialogFilterGroupCompositeModule,
        NuiDocsModule,
        NuiButtonModule,
        NuiImageModule,
        HttpClientModule,
        NuiPopoverModule,
        ScrollingModule,
        NuiProgressModule,
        FilteredViewTableWithPaginationModule,
        FilteredViewTableWithVirtualScrollModule,
        FilteredViewListWithVirtualScrollModule,
        FilteredViewListWithPaginationModule,
        FilteredViewWithListModule,
        FilteredViewWithTableModule,
        FilteredViewWithTreeModule,
        NuiDividerModule,
        FilteredViewTableWithSelectionModule,
        FilteredViewTableWithCustomVirtualScrollModule,
        FilteredViewTableWithVirtualScrollSelectionModule,
    ],
    providers: [
        DatePipe,
        FakeHTTPService,
        {
            provide: APOLLO_OPTIONS,
            useFactory: (httpLink: HttpLink) => ({
                cache: new InMemoryCache(),
                link: httpLink.create({
                    uri: COUNTRIES_API,
                }),
            }),
            deps: [HttpLink],
        },
    ],
})
export default class SchematicModule {}
