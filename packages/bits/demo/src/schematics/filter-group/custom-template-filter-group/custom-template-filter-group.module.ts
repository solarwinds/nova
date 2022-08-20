import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiCheckboxModule,
    NuiExpanderModule,
    NuiPopoverModule,
} from "@nova-ui/bits";

import { CustomTemplateFilterGroupCompositeComponent } from "./custom-template-filter-group.component";
import { CustomTemplateFilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";

@NgModule({
    imports: [
        CommonModule,
        NuiExpanderModule,
        NuiCheckboxModule,
        NuiPopoverModule,
    ],
    declarations: [
        CustomTemplateFilterGroupsWrapperComponent,
        CustomTemplateFilterGroupCompositeComponent,
    ],
    exports: [
        CustomTemplateFilterGroupsWrapperComponent,
        CustomTemplateFilterGroupCompositeComponent,
    ],
})
export class CustomTemplateFilterGroupCompositeModule {}
