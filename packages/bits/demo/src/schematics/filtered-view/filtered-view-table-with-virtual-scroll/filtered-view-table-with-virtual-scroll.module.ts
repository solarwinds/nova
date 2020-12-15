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
} from "@nova-ui/bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewTableWithVirtualScrollComponent } from "./filtered-view-table-with-virtual-scroll.component";
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
        FilteredViewTableWithVirtualScrollComponent,
        FilteredViewTableComponent,
    ],
    exports: [
        FilteredViewTableWithVirtualScrollComponent,
        FilteredViewTableComponent,
    ],
})

export class FilteredViewTableWithVirtualScrollModule {}
