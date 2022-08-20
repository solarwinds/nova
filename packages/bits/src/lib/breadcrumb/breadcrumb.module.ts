import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

import { BreadcrumbStateService } from "./breadcrumb-state.service";
import { BreadcrumbComponent } from "./breadcrumb.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiIconModule],
    declarations: [BreadcrumbComponent],
    exports: [BreadcrumbComponent],
    providers: [BreadcrumbStateService],
})
export class NuiBreadcrumbModule {}
