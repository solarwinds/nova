import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    NuiBusyModule,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiImageModule,
    NuiRepeatModule,
    NuiSwitchModule,
    NuiTextboxModule,
} from "@nova-ui/bits";
import {
    ComponentRegistryService,
    DataSourceConfigurationV2Component,
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfigurationForDisplay,
    NuiDashboardsModule,
    ProviderRegistryService,
    WellKnownPathKey,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeProportionalDSConfigComponent } from "../components/data-source-configuration/proportional-ds-config.component";
import { AcmeKpiDataSource, AcmeKpiDataSource2, AcmeKpiDataSource3 } from "../data/kpi-datasources";
import { AcmeProportionalDataSource, AcmeProportionalDataSource2 } from "../data/proportional-datasources";
import { AcmeTableDataSourceNoDataFields } from "../data/table/acme-table-data-source-no-data-fields.service";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSource3 } from "../data/table/acme-table-data-source3.service";
import { AcmeTableGBooksDataSource } from "../data/table/acme-table-gbooks-data-source.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import { AcmeTimeseriesDataSource, AcmeTimeseriesDataSource2 } from "../data/timeseries-data-sources";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeEditWithClonerComponent } from "./acme-clone-selection/acme-edit-with-cloner.component";
import { AcmeDashboardComponent } from "./prototype-1.component";

const routes = [
    {
        path: "",
        component: AcmeDashboardComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        NuiDashboardsModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiIconModule,
        NuiImageModule,
        NuiRepeatModule,
        RouterModule.forChild(routes),
        NuiFormFieldModule,
        NuiTextboxModule,
    ],
    declarations: [
        AcmeDashboardComponent,
        AcmeCloneSelectionComponent,
        AcmeEditWithClonerComponent,
    ],
    providers: [
        ProviderRegistryService,
    ],
})
export class Prototype1Module {
    constructor(
        private widgetTypesService: WidgetTypesService,
        private componentRegistry: ComponentRegistryService
    ) {
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
            AcmeTableGBooksDataSource.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
            AcmeTableDataSourceNoDataFields.providerId,
        ]);

        const kpiWidgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            kpiWidgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This is the path to go to the data source config component type.
            WellKnownPathKey.DataSourceConfigComponentType,
            // We are changing it to use the v2 so we can have one data source since the logic is similar.
            DataSourceConfigurationV2Component.lateLoadKey
        );

        this.setDataSourceProviders("kpi", [
            {
                providerId: AcmeKpiDataSource.providerId,
                label: "Acme KPI Data Source 1",
            }, {
                providerId: AcmeKpiDataSource2.providerId,
                label: "Acme KPI Data Source 2",
                properties: {
                    numberFormat: "1.1-1",
                },
            },
            {
                providerId: AcmeKpiDataSource3.providerId,
                label: "Acme KPI Data Source 3",
            }]);

        this.setDataSourceProviders("proportional", [AcmeProportionalDataSource.providerId, AcmeProportionalDataSource2.providerId]);
        this.setDataSourceProviders("timeseries", [AcmeTimeseriesDataSource.providerId, AcmeTimeseriesDataSource2.providerId]);
    }

    private setDataSourceProviders(type: string, providers: string[] | IProviderConfigurationForDisplay[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, providers);
    }
}
