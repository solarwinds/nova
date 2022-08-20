import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiExpanderModule,
    NuiPopoverModule,
} from "@nova-ui/bits";

import { FilterGroupDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupComponent } from "./filter-group.component";
import { FilterGroupService } from "./filter-group.service";
import { FilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";
import { ItemPickerModule } from "./item-picker/item-picker.module";

@NgModule({
    imports: [
        CommonModule,
        NuiCheckboxModule,
        NuiDialogModule,
        NuiDividerModule,
        NuiExpanderModule,
        NuiPopoverModule,
        ItemPickerModule,
    ],
    declarations: [
        FilterGroupsWrapperComponent,
        FilterGroupDialogComponent,
        FilterGroupComponent,
    ],
    exports: [
        FilterGroupsWrapperComponent,
        FilterGroupDialogComponent,
        FilterGroupComponent,
    ],
    providers: [FilterGroupService],
})
export class FilterGroupModule {}
