import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiBusyModule,
    NuiChipsModule,
    NuiIconModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiSpinnerModule,
    NuiTableModule,
} from "@nova-ui/bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewTableComponent } from "./filtered-view-table/filtered-view-table.component";
import { FilteredViewWithTableComponent } from "./filtered-view-with-table.component";

@NgModule({
    imports: [
        CommonModule,
        NuiPaginatorModule,
        NuiPanelModule,
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
    declarations: [FilteredViewWithTableComponent, FilteredViewTableComponent],
    exports: [FilteredViewWithTableComponent, FilteredViewTableComponent],
})
export class FilteredViewWithTableModule {}
