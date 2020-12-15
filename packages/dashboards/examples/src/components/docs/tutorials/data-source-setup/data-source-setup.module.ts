import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiDocsModule, NuiMenuModule, NuiMessageModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { DataSourceDocsComponent } from "./data-source-setup-docs.component";
import { DataSourceSetupComponent } from "./data-source-setup.component";

const routes = [
    {
        path: "",
        component: DataSourceDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: DataSourceSetupComponent,
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
        HttpClientModule,
        NuiDashboardsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DataSourceDocsComponent,
        DataSourceSetupComponent,
    ],
    entryComponents: [
    ],
})
export class DataSourceSetupModule { }
