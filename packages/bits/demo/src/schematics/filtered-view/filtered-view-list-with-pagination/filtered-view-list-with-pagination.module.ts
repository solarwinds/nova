import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import {
    NuiBusyModule,
    NuiChipsModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiSpinnerModule,
} from "@nova-ui/bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewListWithPaginationComponent } from "./filtered-view-list-with-pagination.component";
import { FilteredViewListComponent } from "./filtered-view-list/filtered-view-list.component";

@NgModule({
    imports: [
        CommonModule,
        NuiPaginatorModule,
        NuiPanelModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSorterModule,
        NuiSpinnerModule,
        NuiBusyModule,
        FilterGroupModule,
        NuiChipsModule,
        NuiPopoverModule,
    ],
    declarations: [
        FilteredViewListWithPaginationComponent,
        FilteredViewListComponent,
    ],
    exports: [
        FilteredViewListWithPaginationComponent,
        FilteredViewListComponent,
    ],
})
export class FilteredViewListWithPaginationModule {}
