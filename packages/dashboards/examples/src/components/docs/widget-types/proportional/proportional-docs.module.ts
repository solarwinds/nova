import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { ProportionalDocsComponent } from "./proportional-docs.component";
import { ProportionalWidgetExampleComponent } from "./proportional-widget-example/proportional-widget-example.component";

const routes: Routes = [
    {
        path: "",
        component: ProportionalDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: ProportionalWidgetExampleComponent,
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
        NuiDashboardsModule,
        NuiMessageModule,
        NuiSwitchModule,
    ],
    declarations: [
        ProportionalDocsComponent,
        ProportionalWidgetExampleComponent,
    ],
})
export class ProportionalDocsModule {
}
