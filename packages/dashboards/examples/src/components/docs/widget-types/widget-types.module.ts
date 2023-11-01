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

import { NuiDocsModule } from "@nova-ui/bits";
import {
    ConfiguratorHeadingService,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

const routes: Routes = [
    {
        path: "kpi",
        loadChildren: async () =>
            import("components/docs/widget-types/kpi/kpi-docs.module").then(
                (m) => m.KpiDocsModule
            ),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "risk-score",
        loadChildren: async () =>
            import(
                "components/docs/widget-types/risk-score/risk-score-docs.module"
            ).then((m) => m.RiskScoreDocsModule),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "timeseries",
        loadChildren: async () =>
            import(
                "components/docs/widget-types/timeseries/timeseries-docs.module"
            ).then((m) => m.TimeseriesDocsModule),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "table",
        loadChildren: async () =>
            import("components/docs/widget-types/table/table-docs.module").then(
                (m) => m.TableDocsModule
            ),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "proportional",
        loadChildren: async () =>
            import(
                "components/docs/widget-types/proportional/proportional-docs.module"
            ).then((m) => m.ProportionalDocsModule),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "embedded",
        loadChildren: async () =>
            import(
                "components/docs/widget-types/embedded-content/embedded-content-docs.module"
            ).then((m) => m.EmbeddedContentDocsModule),
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "drilldown",
        loadChildren: async () =>
            import(
                "components/docs/widget-types/drilldown/drilldown-docs.module"
            ).then((m) => m.DrilldownDocsModule),
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
        NuiDocsModule,
        NuiDashboardsModule,
    ],
    providers: [ConfiguratorHeadingService],
})
export class WidgetTypesModule {}
