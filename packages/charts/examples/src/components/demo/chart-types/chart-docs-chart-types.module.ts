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

import { NuiDocsModule, NuiIconModule, NuiMessageModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

const exampleRoutes: Routes = [
    {
        path: "bar",
        loadChildren: async () =>
            import("./bar/chart-docs-bar.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "bucketed-bar",
        loadChildren: async () =>
            import(
                "./bucketed-bar/chart-docs-bucketed-bar.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "line",
        loadChildren: async () =>
            import("./line/chart-docs-line.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "pie-and-donut",
        loadChildren: async () =>
            import(
                "./pie-and-donut/chart-docs-pie-and-donut.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "spark",
        loadChildren: async () =>
            import("./spark/chart-docs-spark.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "gauge",
        loadChildren: async () =>
            import("./gauge/chart-docs-gauge.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "status",
        loadChildren: async () =>
            import("./status/chart-docs-status.module") as object as Promise<
                Type<any>
            >,
    },
    {
        path: "waterfall",
        loadChildren: async () =>
            import(
                "./waterfall/chart-docs-waterfall.module"
            ) as object as Promise<Type<any>>,
    },
    {
        path: "area",
        loadChildren: async () =>
            import("./area/chart-docs-area.module") as object as Promise<
                Type<any>
            >,
    },
];

@NgModule({
    declarations: [],
    imports: [
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsChartTypesModule {}
