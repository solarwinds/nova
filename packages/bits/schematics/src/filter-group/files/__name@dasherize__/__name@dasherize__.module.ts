import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiExpanderModule,
    NuiPopoverModule,
} from "@solarwinds/nova-bits";

import { FilterGroupDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupService } from "./filter-group.service";
import { FilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";
import { ItemPickerModule } from "./item-picker/item-picker.module";

import { <%= classify(name) %>Component } from "./<%= name %>.component";

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
        <%= classify(name) %>Component,
    ],
    exports: [
        FilterGroupsWrapperComponent,
        FilterGroupDialogComponent,
        <%= classify(name) %>Component,
    ],
    providers: [FilterGroupService],
})

export class <%= classify(name) %>Module {}
