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
import { RouterModule, Routes } from "@angular/router";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    KpiColorComparatorsRegistryService,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { KpiBackgroundColorDocsComponent } from "./kpi-background-color/docs/kpi-background-color-docs.component";
import { KpiWidgetBackgroundColorExampleComponent } from "./kpi-background-color/example/kpi-widget-background-color-example.component";
import { KpiDocsComponent } from "./kpi-docs.component";
import { KpiSyncBrokerDocsComponent } from "./kpi-sync-broker/docs/kpi-sync-broker-docs.component";
import { KpiSyncBrokerExampleComponent } from "./kpi-sync-broker/example/kpi-sync-broker-example.component";
import { KpiSyncBrokerForAllTilesExampleComponent } from "./kpi-sync-broker/example/kpi-sync-broker-for-all-tiles-example.component";
import { KpiWidgetExampleComponent } from "./kpi-widget-example/kpi-widget-example.component";
import { KpiWidgetInteractiveExampleComponent } from "./kpi-widget-interactive-example/kpi-widget-interactive-example.component";

const routes: Routes = [
    {
        path: "",
        component: KpiDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: KpiWidgetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "background-color",
        component: KpiBackgroundColorDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "sync-broker",
        component: KpiSyncBrokerDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiDashboardsModule,
        NuiSwitchModule,
    ],
    declarations: [
        KpiDocsComponent,
        KpiWidgetExampleComponent,
        KpiWidgetInteractiveExampleComponent,
        KpiBackgroundColorDocsComponent,
        KpiWidgetBackgroundColorExampleComponent,
        KpiSyncBrokerDocsComponent,
        KpiSyncBrokerExampleComponent,
        KpiSyncBrokerForAllTilesExampleComponent,
    ],
    providers: [KpiColorComparatorsRegistryService],
})
export default class KpiDocsModule {
    constructor(
        private comparatorsRegistry: KpiColorComparatorsRegistryService
    ) {
        this.backgroundColorDocsSetup();
    }

    private backgroundColorDocsSetup() {
        this.comparatorsRegistry.registerComparators({
            "!=": {
                comparatorFn: (actual: any, reference: any) =>
                    // eslint-disable-next-line eqeqeq
                    actual != reference,
                label: "Not equal",
            },
        });
    }
}
