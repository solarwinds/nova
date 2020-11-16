import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiSwitchModule } from "@solarwinds/nova-bits";
import { DEFAULT_PIZZAGNA_ROOT, NuiDashboardsModule, ProviderRegistryService, WellKnownPathKey, WidgetTypesService } from "@solarwinds/nova-dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestProportionalDataSource, TestProportionalDataSource2, TestProportionalDataSource3 } from "../../data/proportional-data-sources";

import { AcmeDashboardComponent } from "./proportional-widget-test.component";

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
export class ProportionalWidgetTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType("proportional", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers?.refresher;

        widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders,
            [
                TestProportionalDataSource.providerId,
                TestProportionalDataSource2.providerId,
                TestProportionalDataSource3.providerId,
            ]);
    }
}
