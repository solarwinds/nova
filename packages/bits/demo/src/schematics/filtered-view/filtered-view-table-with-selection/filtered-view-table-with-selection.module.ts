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
} from "@solarwinds/nova-bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewTableWithSelectionComponent } from "./filtered-view-table-with-selection.component";
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
        FilteredViewTableWithSelectionComponent,
        FilteredViewTableComponent,
    ],
    exports: [
        FilteredViewTableWithSelectionComponent,
        FilteredViewTableComponent,
    ],
})

export class FilteredViewTableWithSelectionModule {}
