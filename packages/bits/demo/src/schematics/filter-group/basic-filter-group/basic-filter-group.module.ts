import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiExpanderModule,
} from "@nova-ui/bits";

import { BasicFilterGroupCompositeComponent } from "./basic-filter-group.component";
import { FilterGroupCompositeDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupService } from "./filter-group.service";
import { BasicFilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";
import { ItemPickerCompositeModule } from "./item-picker/item-picker.module";

@NgModule({
    imports: [
        CommonModule,
        NuiCheckboxModule,
        NuiButtonModule,
        NuiDialogModule,
        ItemPickerCompositeModule,
        NuiExpanderModule,
        NuiCheckboxModule,
    ],
    declarations: [
        BasicFilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        BasicFilterGroupCompositeComponent,
    ],
    exports: [
        BasicFilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        BasicFilterGroupCompositeComponent,
    ],
    providers: [FilterGroupService],
})
export class BasicFilterGroupCompositeModule {}
