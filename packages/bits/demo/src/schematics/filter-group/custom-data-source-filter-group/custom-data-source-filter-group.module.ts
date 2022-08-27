import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import {
    NuiCheckboxModule,
    NuiExpanderModule,
    NuiPopoverModule,
} from "@nova-ui/bits";

import { CustomDataSourceFilterGroupCompositeComponent } from "./custom-data-source-filter-group.component";
import { CustomDataSourceFilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";

@NgModule({
    imports: [
        CommonModule,
        NuiExpanderModule,
        NuiCheckboxModule,
        NuiPopoverModule,
    ],
    declarations: [
        CustomDataSourceFilterGroupsWrapperComponent,
        CustomDataSourceFilterGroupCompositeComponent,
    ],
    exports: [
        CustomDataSourceFilterGroupsWrapperComponent,
        CustomDataSourceFilterGroupCompositeComponent,
    ],
})
export class CustomDataSourceFilterGroupCompositeModule {}
