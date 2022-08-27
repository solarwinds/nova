import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiExpanderModule,
    NuiPopoverModule,
    NuiSpinnerModule,
} from "@nova-ui/bits";

import { DialogFilterGroupCompositeComponent } from "./dialog-filter-group.component";
import { FilterGroupCompositeDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupService } from "./filter-group.service";
import { FilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";
import { ItemPickerCompositeModule } from "./item-picker/item-picker.module";

@NgModule({
    imports: [
        CommonModule,
        NuiDialogModule,
        NuiSpinnerModule,
        NuiButtonModule,
        ItemPickerCompositeModule,
        NuiPopoverModule,
        NuiExpanderModule,
        NuiCheckboxModule,
    ],
    declarations: [
        FilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        DialogFilterGroupCompositeComponent,
    ],
    exports: [
        FilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        DialogFilterGroupCompositeComponent,
    ],
    providers: [FilterGroupService],
    entryComponents: [FilterGroupCompositeDialogComponent],
})
export class DialogFilterGroupCompositeModule {}
