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

import { NgModule, Type } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NuiDocsModule } from "@nova-ui/bits";
import {
    ConfiguratorHeadingService,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

export enum WidgetTypesRoute {
    kpi = "kpi",
    riskScore = "risk-score",
    timeseries = "timeseries",
    table = "table",
    cartesian = "cartesian",
    proportional = "proportional",
    embedded = "embedded",
    drilldown = "drilldown",
}

const routes: Routes = [
    {
        path: WidgetTypesRoute.kpi,
        loadChildren: async () =>
            import("./kpi/kpi-docs.module") as object as Promise<Type<any>>,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.riskScore,
        loadChildren: async () =>
            import("./risk-score/risk-score-docs.module") as object as Promise<
                Type<any>
            >,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.timeseries,
        loadChildren: async () =>
            import("./timeseries/timeseries-docs.module") as object as Promise<
                Type<any>
            >,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.table,
        loadChildren: async () =>
            import("./table/table-docs.module") as object as Promise<Type<any>>,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.cartesian,
        loadChildren: async () =>
            import(
                "./cartesian/cartesian-docs/cartesian-docs.module"
            ) as object as Promise<Type<any>>,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.proportional,
        loadChildren: async () =>
            import(
                "./proportional/proportional-docs.module"
            ) as object as Promise<Type<any>>,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.embedded,
        loadChildren: async () =>
            import(
                "./embedded-content/embedded-content-docs.module"
            ) as object as Promise<Type<any>>,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: WidgetTypesRoute.drilldown,
        loadChildren: async () =>
            import("./drilldown/drilldown-docs.module") as object as Promise<
                Type<any>
            >,
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
export default class WidgetTypesModule {}
