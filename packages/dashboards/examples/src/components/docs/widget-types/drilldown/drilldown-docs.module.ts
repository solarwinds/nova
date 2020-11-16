import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// tslint:disable-next-line:max-line-length
import { NuiButtonModule, NuiDocsModule, NuiMessageModule,  NuiSwitchModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { DrilldownDocsComponent } from "./drilldown-docs.component";
import { DrilldownWidgetExampleComponent } from "./drilldown-widget-example/drilldown-widget-example.component";

const routes: Routes = [
    {
        path: "",
        component: DrilldownDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "example",
        component: DrilldownWidgetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiDashboardsModule,
        NuiSwitchModule,
    ],
    declarations: [
        DrilldownDocsComponent,
        DrilldownWidgetExampleComponent,
    ],
})
export class DrilldownDocsModule {
}
