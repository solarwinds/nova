import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiBusyModule,
    NuiChipsModule,
    NuiIconModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiSpinnerModule,
    NuiTableModule,
} from "@nova-ui/bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewTableWithPaginationComponent } from "./filtered-view-table-with-pagination.component";
import { FilteredViewTableComponent } from "./filtered-view-table/filtered-view-table.component";

@NgModule({
    imports: [
        CommonModule,
        NuiPaginatorModule,
        NuiPanelModule,
        NuiProgressModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSorterModule,
        NuiIconModule,
        NuiSpinnerModule,
        NuiTableModule,
        NuiBusyModule,
        FilterGroupModule,
        NuiChipsModule,
        NuiPopoverModule,
    ],
    declarations: [
        FilteredViewTableWithPaginationComponent,
        FilteredViewTableComponent,
    ],
    exports: [
        FilteredViewTableWithPaginationComponent,
        FilteredViewTableComponent,
    ],
})

export class FilteredViewTableWithPaginationModule {}
