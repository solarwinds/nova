import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMenuModule, NuiMessageModule, NuiSwitchModule, NuiToastModule } from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { PersistenceHandlerSetupDocsComponent } from "./persistence-handler-setup-docs.component";
import { PersistenceHandlerSetupComponent } from "./persistence-handler-setup.component";

const routes = [
    {
        path: "",
        component: PersistenceHandlerSetupDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: PersistenceHandlerSetupComponent,
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
        NuiSwitchModule,
        NuiToastModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        PersistenceHandlerSetupDocsComponent,
        PersistenceHandlerSetupComponent,
    ],
    entryComponents: [
    ],
})
export class PersistenceHandlerSetupModule { }
