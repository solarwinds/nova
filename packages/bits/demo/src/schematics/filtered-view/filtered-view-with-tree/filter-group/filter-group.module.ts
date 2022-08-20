import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiExpanderModule,
    NuiPopoverModule,
} from "@nova-ui/bits";

import { FilterGroupComponent } from "./filter-group.component";
import { FilterGroupService } from "./filter-group.service";
import { FilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";

@NgModule({
    imports: [
        CommonModule,
        NuiCheckboxModule,
        NuiDialogModule,
        NuiDividerModule,
        NuiExpanderModule,
        NuiPopoverModule,
    ],
    declarations: [FilterGroupsWrapperComponent, FilterGroupComponent],
    exports: [FilterGroupsWrapperComponent, FilterGroupComponent],
    providers: [FilterGroupService],
})
export class FilterGroupModule {}
