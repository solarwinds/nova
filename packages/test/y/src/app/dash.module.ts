import {NgModule} from "@angular/core";
import {NuiDashboardsModule} from "@nova-ui/dashboards";
import {DashComponent} from "./dash.component";
import {DashRoutingModule} from "./dash.routing.module";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        DashRoutingModule,
        NuiDashboardsModule,
    ],
    declarations: [
        DashComponent
    ]
})
export class AppModule {

}
