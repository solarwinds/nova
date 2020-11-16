import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

import { TabGroupComponent } from "./tab-group/tab-group.component";
import { TabHeadingGroupComponent } from "./tab-heading-group/tab-heading-group.component";
import { TabHeadingComponent } from "./tab-heading/tab-heading.component";
import { TabHeadingCustomTemplateRefDirective } from "./tab/tab-heading-custom-template-ref.directive";
import { TabHeadingDirective } from "./tab/tab-heading.directive";
import { TabComponent } from "./tab/tab.component";

/**
 * @ignore
 */
@NgModule({
    declarations: [
        TabHeadingCustomTemplateRefDirective,
        TabHeadingDirective,
        TabComponent,
        TabGroupComponent,
        TabHeadingComponent,
        TabHeadingGroupComponent,
    ],
    imports: [
        NuiCommonModule,
        NuiIconModule,
    ],
    exports: [
        TabHeadingCustomTemplateRefDirective,
        TabHeadingDirective,
        TabComponent,
        TabGroupComponent,
        TabHeadingComponent,
        TabHeadingGroupComponent,
    ],
})
export class NuiTabsModule {}
