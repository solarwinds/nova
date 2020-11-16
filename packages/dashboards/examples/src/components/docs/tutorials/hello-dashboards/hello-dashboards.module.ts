import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiDocsModule, NuiMenuModule, NuiMessageModule } from "@solarwinds/nova-bits";
import { NuiDashboardsModule } from "@solarwinds/nova-dashboards";

import { HelloDashboardsDocsComponent } from "./hello-dashboards-docs.component";
import { HelloDashboardsComponent } from "./hello-dashboards.component";

const routes = [
    {
        path: "",
        component: HelloDashboardsDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: HelloDashboardsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        NuiDashboardsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        HelloDashboardsDocsComponent,
        HelloDashboardsComponent,
    ],
    entryComponents: [
    ],
})
export class HelloDashboardsModule { }
