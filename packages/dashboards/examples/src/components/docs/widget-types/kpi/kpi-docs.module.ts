import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { KpiColorComparatorsRegistryService, NuiDashboardsModule } from "@nova-ui/dashboards";

import { KpiBackgroundColorDocsComponent } from "./kpi-background-color/docs/kpi-background-color-docs.component";
import { KpiWidgetBackgroundColorExampleComponent } from "./kpi-background-color/example/kpi-widget-background-color-example.component";
import { KpiDocsComponent } from "./kpi-docs.component";
import { KpiSyncBrokerDocsComponent } from "./kpi-sync-broker-example/docs/kpi-sync-broker-docs.component";
import { KpiSyncBrokerExampleComponent } from "./kpi-sync-broker-example/example/kpi-sync-broker-example.component";
import { KpiSyncBrokerForAllTilesExampleComponent } from "./kpi-sync-broker-example/example/kpi-sync-broker-for-all-tiles-example.component";
import { KpiWidgetExampleComponent } from "./kpi-widget-example/kpi-widget-example.component";

const routes: Routes = [
    {
        path: "",
        component: KpiDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: KpiWidgetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "background-color",
        component: KpiBackgroundColorDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "sync-broker",
        component: KpiSyncBrokerDocsComponent,
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
        KpiDocsComponent,
        KpiWidgetExampleComponent,
        KpiBackgroundColorDocsComponent,
        KpiWidgetBackgroundColorExampleComponent,
        KpiSyncBrokerDocsComponent,
        KpiSyncBrokerExampleComponent,
        KpiSyncBrokerForAllTilesExampleComponent,
    ],
    providers: [KpiColorComparatorsRegistryService],
})
export class KpiDocsModule {
    constructor(private comparatorsRegistry: KpiColorComparatorsRegistryService) {
        this.backgroundColorDocsSetup();
    }

    private backgroundColorDocsSetup() {
        this.comparatorsRegistry.registerComparators({
            "!=": {
                // eslint-disable-next-line eqeqeq
                comparatorFn: (actual: any, reference: any) => actual != reference,
                label: "Not equal",
            },
        });
    }
}
