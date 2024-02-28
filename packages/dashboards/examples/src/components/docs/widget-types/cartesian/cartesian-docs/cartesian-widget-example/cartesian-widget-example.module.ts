import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { NuiButtonModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { CartesianWidgetExampleComponent } from "./cartesian-widget-example.component";


@NgModule({
    declarations: [CartesianWidgetExampleComponent],
    exports: [CartesianWidgetExampleComponent],
    imports: [
        CommonModule,
        NuiDashboardsModule,
        NuiSwitchModule,
        NuiButtonModule,
    ],
})
export class CartesianWidgetExampleModule {}
