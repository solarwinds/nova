import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    NuiBusyModule,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiRepeatModule,
    NuiSelectV2Module,
    NuiSwitchModule,
} from "@solarwinds/nova-bits";
import {
    NuiDashboardsModule,
    ProviderRegistryService,
    WellKnownPathKey,
    WidgetTypesService,
} from "@solarwinds/nova-dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestTimeseriesDataSource, TestTimeseriesDataSource2, TestTimeseriesStatusDataSource, TestTimeseriesStatusIntervalDataSource } from "../../data/timeseries-data-sources";

import { AcmeDashboardComponent } from "./timeseries-test.component";

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
        NuiFormFieldModule,
        NuiRepeatModule,
        NuiSelectV2Module,
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
export class TimeseriesTestModule {
    constructor(private widgetTypesService: WidgetTypesService) {
        this.setupDataSourceProviders();
    }

    private setupDataSourceProviders() {
        this.setDataSourceProviders("timeseries", [
            TestTimeseriesDataSource.providerId,
            TestTimeseriesDataSource2.providerId,
            TestTimeseriesStatusDataSource.providerId,
            TestTimeseriesStatusIntervalDataSource.providerId]);
    }

    private setDataSourceProviders(type: string, providers: string[]) {
        const widgetTemplate = this.widgetTypesService.getWidgetType(type, 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, providers);
    }
}
