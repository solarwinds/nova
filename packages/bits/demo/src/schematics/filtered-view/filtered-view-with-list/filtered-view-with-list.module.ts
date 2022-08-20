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
import { FilteredViewListComponent } from "./filtered-view-list/filtered-view-list.component";
import { FilteredViewWithListComponent } from "./filtered-view-with-list.component";

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
    declarations: [FilteredViewWithListComponent, FilteredViewListComponent],
    exports: [FilteredViewWithListComponent, FilteredViewListComponent],
})
export class FilteredViewWithListModule {}
