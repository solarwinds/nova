import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiSwitchModule } from "@solarwinds/nova-bits";
import { DEFAULT_PIZZAGNA_ROOT, NuiDashboardsModule, ProviderRegistryService, WellKnownPathKey, WidgetTypesService } from "@solarwinds/nova-dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestKpiDataSource, TestKpiDataSource2, TestKpiDataSourceBigNumber, TestKpiDataSourceSmallNumber } from "../../data/kpi-data-sources";

import { KpiDashboardComponent } from "./kpi-widget-test.component";

const routes = [
    {
        path: "",
        component: KpiDashboardComponent,
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
        RouterModule.forChild(routes),
    ],
    declarations: [
        KpiDashboardComponent,
    ],
    providers: [
        ProviderRegistryService,
    ],
})
export class KpiWidgetTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType("kpi", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers?.refresher;

        widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders,
            [
                TestKpiDataSource.providerId,
                TestKpiDataSource2.providerId,
                TestKpiDataSourceBigNumber.providerId,
                TestKpiDataSourceSmallNumber.providerId,
            ]);
    }
}
