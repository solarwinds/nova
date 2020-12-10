import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { TimeseriesDocsComponent } from "./timeseries-docs.component";
import { TimeseriesWidgetExampleComponent } from "./timeseries-widget-example/timeseries-widget-example.component";
import { TimeseriesWidgetStatusBarExampleComponent } from "./timeseries-widget-status-bar-example/timeseries-widget-status-bar-example.component";

const routes: Routes = [
    {
        path: "",
        component: TimeseriesDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: TimeseriesWidgetExampleComponent,
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
        NuiSwitchModule,
        NuiDashboardsModule,
    ],
    declarations: [
        TimeseriesDocsComponent,
        TimeseriesWidgetExampleComponent,
        TimeseriesWidgetStatusBarExampleComponent,
    ],
})
export class TimeseriesDocsModule {
}
