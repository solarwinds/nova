import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiRepeatModule, NuiSwitchModule } from "@solarwinds/nova-bits";
import { DEFAULT_PIZZAGNA_ROOT, NuiDashboardsModule, ProviderRegistryService, WellKnownPathKey, WidgetTypesService } from "@solarwinds/nova-dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestKpiDataSource, TestKpiDataSource2 } from "../../data/kpi-data-sources";
import { TestProportionalDataSource, TestProportionalDataSource2, TestProportionalDataSource3 } from "../../data/proportional-data-sources";
import { TestTableDataSource, TestTableDataSource2 } from "../../data/table-datasources";
import { TestTimeseriesDataSource, TestTimeseriesDataSource2 } from "../../data/timeseries-data-sources";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeEditWithClonerComponent } from "./acme-clone-selection/acme-edit-with-cloner.component";
import { AcmeDashboardComponent } from "./configurator-test.component";

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
        TestCommonModule,
        NuiDashboardsModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiIconModule,
        NuiRepeatModule,
        RouterModule.forChild(routes),
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
export class ConfiguratorTestModule {
    constructor(private widgetTypesService: WidgetTypesService) {
        const widgetTemplate = this.widgetTypesService.getWidgetType("proportional", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers?.refresher;

        this.setDataSourceProviders("table", [TestTableDataSource.providerId, TestTableDataSource2.providerId]);
        this.setDataSourceProviders("kpi", [TestKpiDataSource.providerId, TestKpiDataSource2.providerId]);
        this.setDataSourceProviders("proportional", [
            TestProportionalDataSource.providerId,
            TestProportionalDataSource2.providerId,
            TestProportionalDataSource3.providerId,
        ]);
        this.setDataSourceProviders("timeseries", [TestTimeseriesDataSource.providerId, TestTimeseriesDataSource2.providerId]);
    }

    private setDataSourceProviders(type: string, providers: string[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, providers);
    }
}
