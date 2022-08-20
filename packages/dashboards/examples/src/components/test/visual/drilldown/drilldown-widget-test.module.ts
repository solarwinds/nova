import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    NuiDashboardsModule,
    ProviderRegistryService,
} from "@nova-ui/dashboards";

import { TestCommonModule } from "../../common/common.module";

import { DrilldownWidgetTestComponent } from "./drilldown-widget-test.component";

const routes = [
    {
        path: "",
        component: DrilldownWidgetTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        TestCommonModule,
        NuiDashboardsModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        HttpClientTestingModule,
        RouterModule.forChild(routes),
    ],
    declarations: [DrilldownWidgetTestComponent],
    providers: [ProviderRegistryService],
})
export class DrilldownWidgetTestModule {}
