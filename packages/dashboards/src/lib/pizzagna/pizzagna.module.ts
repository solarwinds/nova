import { PortalModule } from "@angular/cdk/portal";
import { NgModule } from "@angular/core";

import { NuiDashboardsCommonModule } from "../common/common.module";

import { PizzagnaComponent } from "./components/pizzagna/pizzagna.component";
import { ComponentPortalDirective } from "./directives/component-portal/component-portal.directive";

@NgModule({
    imports: [
        PortalModule,
        NuiDashboardsCommonModule,
    ],
    declarations: [
        PizzagnaComponent,
        ComponentPortalDirective,
    ],
    exports: [
        PortalModule,
        PizzagnaComponent,
        ComponentPortalDirective,
    ],
})
export class NuiPizzagnaModule {

}
