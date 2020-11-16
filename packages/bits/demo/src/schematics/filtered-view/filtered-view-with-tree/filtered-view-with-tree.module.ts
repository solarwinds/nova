import { CdkTreeModule } from "@angular/cdk/tree";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiBusyModule,
    NuiButtonModule,
    NuiChipsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiSpinnerModule,
} from "@solarwinds/nova-bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { FilteredViewTreeComponent } from "./filtered-view-tree/filtered-view-tree.component";
import { FilteredViewWithTreeComponent } from "./filtered-view-with-tree.component";

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
        NuiIconModule,
        NuiButtonModule,
        NuiExpanderModule,
        FilterGroupModule,
        NuiChipsModule,
        NuiPopoverModule,
        CdkTreeModule,
    ],
    declarations: [
        FilteredViewWithTreeComponent,
        FilteredViewTreeComponent,
    ],
    exports: [
        FilteredViewWithTreeComponent,
        FilteredViewTreeComponent,
    ],
})

export class FilteredViewWithTreeModule {}
