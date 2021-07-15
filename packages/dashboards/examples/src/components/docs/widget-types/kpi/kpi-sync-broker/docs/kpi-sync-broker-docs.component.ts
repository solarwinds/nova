import { Component } from "@angular/core";

@Component({
    selector: "kpi-sync-broker-docs",
    templateUrl: "./kpi-sync-broker-docs.component.html",
})
export class KpiSyncBrokerDocsComponent {
    public kpiScaleSyncBroker = `
"tiles": {
    "providers": {
        kpiScaleSyncBroker: {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value" },
                    { id: "label" },
                    { id: "units" },
                ],
            },
        },
    },
},
`;

    public defineScaleBrokerOnDashboardSetup = `
// To add the sync broker globally to all the kpi tiles you may start with setting up the broker config
// Here you define which values to keep in sync
const brokerConfig = {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value" },
                    { id: "label" },
                    { id: "units" },
                ],
            },
        };

// And here is how you set the sync broker for every KPI widget in the dashboard.
// Later, you will be able to override this setting for each separate KPI widget in the configuration (just like it is shown in the third
// width of the example with the 'kpiWidgetId3')
this.widgetTypesService.setNode(
    widgetTemplate,
    "widget",
    "tiles.providers.kpiScaleSyncBroker",
    brokerConfig
);
`;
}
