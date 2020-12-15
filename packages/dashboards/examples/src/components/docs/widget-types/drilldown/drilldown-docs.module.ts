import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// tslint:disable-next-line:max-line-length
import { NuiButtonModule, NuiDocsModule, NuiMessageModule,  NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { DrilldownDocsComponent } from "./drilldown-docs.component";
import { DrilldownMultiRequestWidgetExampleComponent } from "./drilldown-multi-request-widget-example/drilldown-multi-request-widget-example.component";
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
    {
        path: "multiple-requests",
        component: DrilldownMultiRequestWidgetExampleComponent,
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
        ApolloModule,
        HttpLinkModule,
        NuiSwitchModule,
        ApolloModule,
        HttpLinkModule,
    ],
    declarations: [
        DrilldownDocsComponent,
        DrilldownWidgetExampleComponent,
        DrilldownMultiRequestWidgetExampleComponent,
    ],
})
export class DrilldownDocsModule {
}
