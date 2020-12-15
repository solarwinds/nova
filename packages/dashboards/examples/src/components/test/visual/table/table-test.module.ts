import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule, ProviderRegistryService, WellKnownPathKey, WidgetTypesService } from "@nova-ui/dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestTableDataSource, TestTableDataSource2 } from "../../data/table-datasources";

import { AcmeDashboardComponent } from "./table-widget-test.component";

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
        RouterModule.forChild(routes),
    ],
    declarations: [
        AcmeDashboardComponent,
    ],
    providers: [
        ProviderRegistryService,
    ],
})
export class TableTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType("table", 1);
        widgetTypesService
            .setNode(
                widgetTemplate,
                "configurator",
                WellKnownPathKey.DataSourceProviders,
                [TestTableDataSource.providerId,
                TestTableDataSource2.providerId]
            );
    }
}
