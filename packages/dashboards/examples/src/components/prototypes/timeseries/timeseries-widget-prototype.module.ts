// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    ComponentRegistryService,
    DEFAULT_PIZZAGNA_ROOT,
    NuiDashboardsModule,
    ProviderRegistryService,
    WellKnownPathKey,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeProportionalDSConfigComponent } from "../components/data-source-configuration/proportional-ds-config.component";
import { AcmeKpiDataSource, AcmeKpiDataSource2 } from "../data/kpi-datasources";
import {
    AcmeProportionalDataSource,
    AcmeProportionalDataSource2,
} from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSourceNoColumnGeneration } from "../data/table/acme-table-data-source3.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import {
    AcmeTimeseriesDataSource,
    AcmeTimeseriesDataSource2,
    AcmeTimeseriesStatusDataSource,
    AcmeTimeseriesStatusIntervalDataSource,
} from "../data/timeseries-data-sources";
import { AcmeDashboardComponent } from "./timeseries-widget-prototype.component";

const routes = [
    {
        path: "",
        component: AcmeDashboardComponent,
        data: {
            srlc: {
                hideIndicator: true,
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
    declarations: [AcmeDashboardComponent],
    providers: [ProviderRegistryService],
    entryComponents: [],
})
export class TimeseriesWidgetPrototypeModule {
    constructor(
        private widgetTypesService: WidgetTypesService,
        private componentRegistry: ComponentRegistryService
    ) {
        this.setupDataSourceProviders();
        this.setupCustomProportionalWidgetDSConfig();
    }

    private setupCustomProportionalWidgetDSConfig() {
        // For testing purposes, delete the refresher to prove that the widget gets refreshed on configuration change
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "proportional",
            1
        );
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers
            ?.refresher;

        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceConfigComponentType,
            AcmeProportionalDSConfigComponent.lateLoadKey
        );
        this.componentRegistry.registerByLateLoadKey(
            AcmeProportionalDSConfigComponent
        );
    }

    private setupDataSourceProviders() {
        this.setDataSourceProviders("table", [
            AcmeTableDataSource.providerId,
            AcmeTableDataSource2.providerId,
            AcmeTableDataSourceNoColumnGeneration.providerId,
            AcmeTableMockDataSource.providerId,
        ]);
        this.setDataSourceProviders("kpi", [
            AcmeKpiDataSource.providerId,
            AcmeKpiDataSource2.providerId,
        ]);
        this.setDataSourceProviders("proportional", [
            AcmeProportionalDataSource.providerId,
            AcmeProportionalDataSource2.providerId,
        ]);
        this.setDataSourceProviders("timeseries", [
            AcmeTimeseriesDataSource.providerId,
            AcmeTimeseriesDataSource2.providerId,
            AcmeTimeseriesStatusDataSource.providerId,
            AcmeTimeseriesStatusIntervalDataSource.providerId,
        ]);
    }

    private setDataSourceProviders(type: string, providers: string[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            providers
        );
    }
}
