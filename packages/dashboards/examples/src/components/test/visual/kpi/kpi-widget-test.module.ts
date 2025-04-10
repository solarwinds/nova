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

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiBusyModule,
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NuiDashboardsModule,
    ProviderRegistryService,
    WellKnownPathKey,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { KpiErrorTestComponent } from "./kpi-error/kpi-error-test.component";
import { KpiDashboardComponent } from "./kpi-widget-test.component";
import { TestCommonModule } from "../../common/common.module";
import {
    TestKpiDataSource,
    TestKpiDataSource2,
    TestKpiDataSourceBigNumber,
    TestKpiDataSourceSmallNumber,
} from "../../data/kpi-data-sources";

const routes = [
    {
        path: "",
        component: KpiDashboardComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "error",
        component: KpiErrorTestComponent,
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
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [KpiDashboardComponent, KpiErrorTestComponent],
    providers: [ProviderRegistryService],
})
export class KpiWidgetTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType("kpi", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers
            ?.refresher;

        widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [
                TestKpiDataSource.providerId,
                TestKpiDataSource2.providerId,
                TestKpiDataSourceBigNumber.providerId,
                TestKpiDataSourceSmallNumber.providerId,
            ]
        );
    }
}
