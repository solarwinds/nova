import { ScrollingModule } from "@angular/cdk/scrolling";
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
import { FilteredViewTableWithVirtualScrollSelectionComponent } from "./filtered-view-table-with-virtual-scroll-selection.component";
import { FilteredViewTableComponent } from "./filtered-view-table/filtered-view-table.component";

@NgModule({
    imports: [
        ScrollingModule,
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
        FilteredViewTableWithVirtualScrollSelectionComponent,
        FilteredViewTableComponent,
    ],
    exports: [
        FilteredViewTableWithVirtualScrollSelectionComponent,
        FilteredViewTableComponent,
    ],
})

export class FilteredViewTableWithVirtualScrollSelectionModule {}
