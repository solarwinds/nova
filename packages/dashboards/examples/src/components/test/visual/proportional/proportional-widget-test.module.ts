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

import { AcmeDashboardComponent } from "./proportional-widget-test.component";
import { TestCommonModule } from "../../common/common.module";
import {
    TestProportionalDataSource,
    TestProportionalDataSource2,
    TestProportionalDataSource3,
} from "../../data/proportional-data-sources";

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
        TestCommonModule,
        NuiDashboardsModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [AcmeDashboardComponent],
    providers: [ProviderRegistryService],
})
export class ProportionalWidgetTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType(
            "proportional",
            1
        );
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers
            ?.refresher;

        widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [
                TestProportionalDataSource.providerId,
                TestProportionalDataSource2.providerId,
                TestProportionalDataSource3.providerId,
            ]
        );
    }
}
