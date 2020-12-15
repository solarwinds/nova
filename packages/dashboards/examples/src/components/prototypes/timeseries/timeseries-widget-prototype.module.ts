import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    NuiBusyModule,
    NuiButtonModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiImageModule,
    NuiRepeatModule,
    NuiSelectV2Module,
    NuiSwitchModule
} from "@solarwinds/nova-bits";
import {
    ComponentRegistryService,
    DEFAULT_PIZZAGNA_ROOT,
    NuiDashboardsModule,
    ProviderRegistryService,
    WellKnownPathKey,
    WidgetTypesService
} from "@solarwinds/nova-dashboards";

import { AcmeProportionalDSConfigComponent } from "../components/data-source-configuration/proportional-ds-config.component";
import { AcmeKpiDataSource, AcmeKpiDataSource2 } from "../data/kpi-datasources";
import { AcmeProportionalDataSource, AcmeProportionalDataSource2 } from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSource3 } from "../data/table/acme-table-data-source3.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import { AcmeTimeseriesDataSource, AcmeTimeseriesDataSource2, AcmeTimeseriesStatusDataSource, AcmeTimeseriesStatusIntervalDataSource } from "../data/timeseries-data-sources";

import { AcmeDashboardComponent } from "./timeseries-widget-prototype.component";

const routes = [
    {
        path: "",
        component: AcmeDashboardComponent,
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
        NuiBusyModule,
        NuiButtonModule,
        NuiFormFieldModule,
        NuiImageModule,
        NuiRepeatModule,
        NuiSelectV2Module,
        NuiSwitchModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        AcmeDashboardComponent,
    ],
    providers: [
        ProviderRegistryService,
    ],
    entryComponents: [],
})
export class TimeseriesWidgetPrototypeModule {
    constructor(private widgetTypesService: WidgetTypesService, private componentRegistry: ComponentRegistryService) {
        this.setupDataSourceProviders();
        this.setupCustomProportionalWidgetDSConfig();
    }

    private setupCustomProportionalWidgetDSConfig() {
        // For testing purposes, delete the refresher to prove that the widget gets refreshed on configuration change
        const widgetTemplate = this.widgetTypesService.getWidgetType("proportional", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers?.refresher;

        this.widgetTypesService.setNode(widgetTemplate, "configurator",
            WellKnownPathKey.DataSourceConfigComponentType, AcmeProportionalDSConfigComponent.lateLoadKey);
        this.componentRegistry.registerByLateLoadKey(AcmeProportionalDSConfigComponent);
    }

    private setupDataSourceProviders() {
        this.setDataSourceProviders("table", [
            AcmeTableDataSource.providerId,
            AcmeTableDataSource2.providerId,
            AcmeTableDataSource3.providerId,
            AcmeTableMockDataSource.providerId,
        ]);
        this.setDataSourceProviders("kpi", [AcmeKpiDataSource.providerId, AcmeKpiDataSource2.providerId]);
        this.setDataSourceProviders("proportional", [AcmeProportionalDataSource.providerId, AcmeProportionalDataSource2.providerId]);
        this.setDataSourceProviders("timeseries", [
            AcmeTimeseriesDataSource.providerId,
            AcmeTimeseriesDataSource2.providerId,
            AcmeTimeseriesStatusDataSource.providerId,
            AcmeTimeseriesStatusIntervalDataSource.providerId,
        ]);
    }

    private setDataSourceProviders(type: string, providers: string[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, providers);
    }
}
